"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { posts, tags, postTags } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { slugify, generateExcerpt } from "@/lib/utils";
import { z } from "zod";

const updatePostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  content: z.string().min(50, "Content must be at least 50 characters"),
  coverImage: z.string().url().optional().or(z.literal("")),
  tags: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

export async function updatePost(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: "You must be logged in to update a post" };
  }

  const rawData = {
    id: formData.get("id") as string,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    coverImage: formData.get("coverImage") as string,
    tags: formData.get("tags") as string,
    status: formData.get("status") as "draft" | "published",
  };

  const result = updatePostSchema.safeParse(rawData);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const {
    id,
    title,
    content,
    coverImage,
    tags: tagsString,
    status,
  } = result.data;

  try {
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (existingPost.length === 0) {
      return { error: "Post not found" };
    }

    if (existingPost[0].authorId !== currentUser.userId) {
      return { error: "You don't have permission to edit this post" };
    }

    const [updatedPost] = await db
      .update(posts)
      .set({
        title,
        content,
        excerpt: generateExcerpt(content),
        coverImage: coverImage || null,
        status,
        updatedAt: new Date(),
        publishedAt:
          status === "published" && !existingPost[0].publishedAt
            ? new Date()
            : existingPost[0].publishedAt,
      })
      .where(eq(posts.id, id))
      .returning({ id: posts.id, slug: posts.slug });

    if (tagsString) {
      // Remove existing tags
      await db.delete(postTags).where(eq(postTags.postId, id));

      // Add new tags
      const tagNames = tagsString
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0)
        .slice(0, 4);

      for (const tagName of tagNames) {
        const tagSlug = slugify(tagName);

        let [existingTag] = await db
          .select({ id: tags.id })
          .from(tags)
          .where(eq(tags.slug, tagSlug))
          .limit(1);

        if (!existingTag) {
          [existingTag] = await db
            .insert(tags)
            .values({ name: tagName, slug: tagSlug })
            .returning({ id: tags.id });
        }

        await db.insert(postTags).values({
          postId: id,
          tagId: existingTag.id,
        });
      }
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/post/${updatedPost.slug}`);
  } catch (error) {
    console.error("Error updating post:", error);
    return { error: "Failed to update post" };
  }
}
