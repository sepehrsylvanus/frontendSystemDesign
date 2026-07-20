"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { comments, posts, users, notifications } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function addComment(formData: FormData) {
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: "You must be logged in to comment" };
  }

  if (!content?.trim()) {
    return { error: "Comment cannot be empty" };
  }

  try {
    const [userData] = await db
      .select({
        name: users.name,
        username: users.username,
        avatar: users.avatar,
      })
      .from(users)
      .where(eq(users.id, currentUser.userId))
      .limit(1);

    const [newComment] = await db
      .insert(comments)
      .values({
        content: content.trim(),
        postId,
        authorId: currentUser.userId,
      })
      .returning();

    await db
      .update(posts)
      .set({ commentCount: sql`${posts.commentCount} + 1` })
      .where(eq(posts.id, postId));

    const [post] = await db
      .select({
        slug: posts.slug,
        authorId: posts.authorId,
        title: posts.title,
      })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (post && post.authorId !== currentUser.userId) {
      await db.insert(notifications).values({
        userId: post.authorId,
        type: "comment",
        title: "commented on your post",
        message: `${currentUser.username} commented on your post: ${post.title}`,
        link: `/post/${post.slug}`,
        actorId: currentUser.userId,
        postId: postId,
      });
    }

    if (post) {
      revalidatePath(`/post/${post.slug}`);
    }

    return {
      comment: {
        id: newComment.id,
        content: newComment.content,
        createdAt: newComment.createdAt,
        author: {
          name: userData.name,
          username: userData.username,
          avatar: userData.avatar,
        },
      },
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { error: "Failed to add comment" };
  }
}
