"use server";

import { db } from "@/db";
import { bookmarks } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

export async function toggleBookmark(postId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Unauthorized" };
    }
    const existingBookmark = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, currentUser.userId),
          eq(bookmarks.postId, postId),
        ),
      )
      .limit(1);

    if (existingBookmark.length > 0) {
      // Remove bookmark
      await db
        .delete(bookmarks)
        .where(
          and(
            eq(bookmarks.userId, currentUser.userId),
            eq(bookmarks.postId, postId),
          ),
        );

      return { success: true, bookmarked: false };
    } else {
      // Add bookmark
      await db.insert(bookmarks).values({
        userId: currentUser.userId,
        postId: postId,
      });

      return { success: true, bookmarked: true };
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return { success: false, error: "Failed to toggle bookmark" };
  }
}
