import { db } from "@/db";
import { notifications, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { and, count, eq } from "drizzle-orm";
import { Code2, PenSquare, Search } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import NotificationBell from "@/features/notifications/components/NotificationBell";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";

async function getUserData(userId: string) {
  const user = await db
    .select({
      name: users.name,
      username: users.username,
      avatar: users.avatar,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user[0] || null;
}

async function getUnreadCount(userId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(notifications)
    .where(
      and(eq(notifications.userId, userId), eq(notifications.isRead, false)),
    );

  return result?.count || 0;
}

const Header = async () => {
  const currentUser = await getCurrentUser();
  const userData = currentUser ? await getUserData(currentUser.userId) : null;
  const unreadCount = currentUser
    ? await getUnreadCount(currentUser.userId)
    : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href={"/"} className="flex items-center gap-2 font-bold text-xl">
          <Code2 className="h-6 w-6 text-primary" />
          <span>DevHub</span>
        </Link>

        {/* Search bar -Desktop */}

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <Link href="/explore" className="w-full">
            <div className="flex items-center gap-2 w-full rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
              <Search className="h-4 w-4" />
              <span>Search posts, tags, people...</span>
            </div>
          </Link>
        </div>

        {/* Actions */}
        <nav className="flex items-center gap-2">
          {currentUser && userData ? (
            <>
              <Link href={"/explore"} className="md:hidden">
                <Button variant={"ghost"} size={"icon"}>
                  <Search className="h-5 w-5" />
                </Button>
              </Link>
              <NotificationBell initialUnreadCount={unreadCount} />
              <Link href="/dashboard/new">
                <Button variant="ghost" size="icon">
                  <PenSquare className="h-5 w-5" />
                </Button>
              </Link>
              <Link href={`/profile/${userData.username}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userData.avatar || undefined} />
                  <AvatarFallback>{getInitials(userData.name)}</AvatarFallback>
                </Avatar>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/explore" className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Create account</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
