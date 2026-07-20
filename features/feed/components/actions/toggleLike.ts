"use server";

import { db } from "@/db";
import { likes, notifications, posts } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { and, eq, sql } from "drizzle-orm";

export async function toggleLike(postId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Unauthorized" };
    }

    const existingLike = await db
      .select()
      .from(likes)
      .where(
        and(eq(likes.userId, currentUser.userId), eq(likes.postId, postId)),
      )
      .limit(1);

    if (existingLike.length > 0) {
      await db
        .delete(likes)
        .where(
          and(eq(likes.userId, currentUser.userId), eq(likes.postId, postId)),
        );

      await db
        .update(posts)
        .set({ likeCount: sql`${posts.likeCount} - 1` })
        .where(eq(posts.id, postId));
      return { success: true, liked: false };
    } else {
      await db.insert(likes).values({
        userId: currentUser.userId,
        postId: postId,
      });

      await db
        .update(posts)
        .set({ likeCount: sql`${posts.likeCount} + 1` })
        .where(eq(posts.id, postId));

      const [post] = await db
        .select({
          authorId: posts.authorId,
          title: posts.title,
          slug: posts.slug,
        })
        .from(posts)
        .where(eq(posts.id, postId))
        .limit(1);

      if (post && post.authorId !== currentUser.userId) {
        await db.insert(notifications).values({
          userId: post.authorId,
          type: "like",
          title: "liked your post",
          message: `${currentUser.username} liked your post: ${post.title}`,
          link: `/post/${post.slug}`,
          actorId: currentUser.userId,
          postId: postId,
        });
      }

      return { success: true, liked: true };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}
