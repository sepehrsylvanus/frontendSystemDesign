"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { follows, notifications, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function toggleFollow(targetUserId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Unauthorized" };
    }

    if (currentUser.userId === targetUserId) {
      return { success: false, error: "Cannot follow yourself" };
    }

    // Check if already following
    const existingFollow = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, currentUser.userId),
          eq(follows.followingId, targetUserId),
        ),
      )
      .limit(1);

    let following: boolean;

    if (existingFollow.length > 0) {
      // Unfollow
      await db
        .delete(follows)
        .where(
          and(
            eq(follows.followerId, currentUser.userId),
            eq(follows.followingId, targetUserId),
          ),
        );
      following = false;
    } else {
      await db.insert(follows).values({
        followerId: currentUser.userId,
        followingId: targetUserId,
      });

      await db.insert(notifications).values({
        userId: targetUserId,
        type: "follow",
        title: "started following you",
        message: `${currentUser.username} started following you`,
        link: `/profile/${currentUser.username}`,
        actorId: currentUser.userId,
      });
      following = true;
    }

    const [targetUser] = await db
      .select({ username: users.username })
      .from(users)
      .where(eq(users.id, targetUserId))
      .limit(1);

    if (targetUser) {
      revalidatePath(`/profile/${targetUser.username}`);
    }

    return { success: true, following };
  } catch (error) {
    console.error("Error toggling follow:", error);
    return { success: false, error: "Failed to toggle follow" };
  }
}
