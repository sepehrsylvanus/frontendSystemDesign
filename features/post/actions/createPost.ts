"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { posts, tags, postTags, follows, notifications } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { slugify, generateExcerpt } from "@/lib/utils";
import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  content: z.string().min(50, "Content must be at least 50 characters"),
  coverImage: z.string().url().optional().or(z.literal("")),
  tags: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

export async function createPost(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: "You must be logged in to create a post" };
  }

  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    coverImage: formData.get("coverImage") as string,
    tags: formData.get("tags") as string,
    status: formData.get("status") as "draft" | "published",
  };

  const result = createPostSchema.safeParse(rawData);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { title, content, coverImage, tags: tagsString, status } = result.data;

  try {
    let slug = slugify(title);
    let suffix = 1;

    while (true) {
      const existing = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.slug, slug))
        .limit(1);

      if (existing.length === 0) break;
      slug = `${slugify(title)}-${suffix}`;
      suffix++;
    }

    const [newPost] = await db
      .insert(posts)
      .values({
        title,
        slug,
        content,
        excerpt: generateExcerpt(content),
        coverImage: coverImage || null,
        status,
        authorId: currentUser.userId,
        publishedAt: status === "published" ? new Date() : null,
      })
      .returning({ id: posts.id, slug: posts.slug });

    if (status === "published") {
      const followers = await db
        .select({ followerId: follows.followerId })
        .from(follows)
        .where(eq(follows.followingId, currentUser.userId));

      if (followers.length > 0) {
        const notificationValues = followers.map((f) => ({
          userId: f.followerId,
          type: "new_post" as const,
          title: "published a new post",
          message: `${currentUser.username} published a new post: ${title}`,
          link: `/post/${slug}`,
          actorId: currentUser.userId,
          postId: newPost.id,
        }));

        await db.insert(notifications).values(notificationValues);
      }
    }

    if (tagsString) {
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
          postId: newPost.id,
          tagId: existingTag.id,
        });

        await db
          .update(tags)
          .set({ postCount: sql`${tags.postCount} + 1` })
          .where(eq(tags.id, existingTag.id));
      }
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error creating post:", error);
    return { error: "Failed to create post" };
  }
}
