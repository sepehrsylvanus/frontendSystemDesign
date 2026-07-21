import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarkAllAsReadButton } from "@/features/notifications/components/MarkAllAsReadButton";
import { getCurrentUser } from "@/lib/auth";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import { db } from "@/db";
import { notifications, users, posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const NotficationPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/login");
  }

  const userNotifications = await db
    .select({
      id: notifications.id,
      type: notifications.type,
      title: notifications.title,
      message: notifications.message,
      link: notifications.link,
      isRead: notifications.isRead,
      createdAt: notifications.createdAt,
      actorName: users.name,
      actorUsername: users.username,
      actorAvatar: users.avatar,
      postTitle: posts.title,
      postSlug: posts.slug,
    })
    .from(notifications)
    .leftJoin(users, eq(notifications.actorId, users.id))
    .leftJoin(posts, eq(notifications.postId, posts.id))
    .where(eq(notifications.userId, currentUser.userId))
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-red-500" />;
      case "comment":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case "follow":
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case "new_post":
        return <FileText className="h-5 w-5 text-orange-500" />;
      case "mention":
        return <AtSign className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {userNotifications.length > 0 && <MarkAllAsReadButton />}
      </div>

      {userNotifications.length > 0 ? (
        <div className="space-y-2">
          {userNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.isRead ? "opacity-60" : ""}
            >
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  {notification.actorName && (
                    <Link href={`/profile/${notification.actorUsername}`}>
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={notification.actorAvatar || undefined}
                        />
                        <AvatarFallback>
                          {getInitials(notification.actorName)}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  )}

                  {/* content */}

                  <div className="flex-1 min-w-0 ">
                    <p className="text-sm flex gap-2">
                      {notification.actorName && (
                        <Link
                          href={`/profile/${notification.actorUsername}`}
                          className="font-semibold hover:underline"
                        >
                          {notification.actorName}
                        </Link>
                      )}
                      {notification.title}
                      {notification.postTitle && (
                        <>
                          {" "}
                          <Link
                            href={`/post/${notification.postSlug}`}
                            className="font-medium hover:underline"
                          >
                            {notification.postTitle}
                          </Link>
                        </>
                      )}
                    </p>
                    {notification.message && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
            <p className="text-muted-foreground">
              When someone interacts with your content, you&apos;ll see it here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotficationPage;
