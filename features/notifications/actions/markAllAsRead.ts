"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function markAllNotificationsAsRead() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(
        eq(notifications.userId, currentUser.userId),
        eq(notifications.isRead, false),
      ),
    );

  revalidatePath("/notifications");
  revalidatePath("/", "layout");
}
