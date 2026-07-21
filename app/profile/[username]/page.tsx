import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  FileText,
  Heart,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, getInitials } from "@/lib/utils";
import { db } from "@/db";
import { posts, users, follows } from "@/db/schema";
import { eq, desc, count, sql, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { FollowButton } from "@/features/feed/components/FollowButton";

interface Props {
  params: Promise<{ username: string }>;
}

const ProfilePage = async ({ params }: Props) => {
  const { username } = await params;
  const currentUser = await getCurrentUser();

  // Get user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username.toLowerCase()))
    .limit(1);

  if (!user) {
    notFound();
  }

  // Get user's posts
  const userPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      likeCount: posts.likeCount,
      commentCount: posts.commentCount,
      createdAt: posts.createdAt,
    })
    .from(posts)
    .where(eq(posts.authorId, user.id))
    .orderBy(desc(posts.createdAt))
    .limit(20);

  let isFollowing = false;

  if (currentUser && currentUser.userId !== user.id) {
    const [existingFollow] = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, currentUser.userId),
          eq(follows.followingId, user.id),
        ),
      )
      .limit(1);
    isFollowing = !!existingFollow;
  }

  const [followerCount] = await db
    .select({ count: count() })
    .from(follows)
    .where(eq(follows.followingId, user.id));

  const [followingCount] = await db
    .select({ count: count() })
    .from(follows)
    .where(eq(follows.followerId, user.id));

  // Get post stats
  const [stats] = await db
    .select({
      totalPosts: count(posts.id),
      totalLikes: sql<number>`coalesce(sum(${posts.likeCount}), 0)::int`,
    })
    .from(posts)
    .where(eq(posts.authorId, user.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={user.avatar || undefined} />
              <AvatarFallback className="text-3xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {user.name}
                  </h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>
                {currentUser && currentUser.userId !== user.id ? (
                  <FollowButton
                    targetUserId={user.id}
                    initialIsFollowing={isFollowing}
                  />
                ) : null}
              </div>

              {user.bio && (
                <p className="text-muted-foreground mb-4">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                {user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {user.location}
                  </span>
                )}
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    <LinkIcon className="h-4 w-4" />
                    {new URL(user.website).hostname}
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {formatDate(user.createdAt)}
                </span>
              </div>

              <div className="flex gap-6 text-sm">
                <span>
                  <strong>{followerCount?.count || 0}</strong>{" "}
                  <span className="text-muted-foreground">Followers</span>
                </span>
                <span>
                  <strong>{followingCount?.count || 0}</strong>{" "}
                  <span className="text-muted-foreground">Following</span>
                </span>
                <span>
                  <strong>{stats?.totalPosts || 0}</strong>{" "}
                  <span className="text-muted-foreground">Posts</span>
                </span>
                <span>
                  <strong>{stats?.totalLikes || 0}</strong>{" "}
                  <span className="text-muted-foreground">Likes received</span>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Post */}
      <Tabs defaultValue="posts">
        <TabsList className="mb-6">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Posts ({userPosts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          {userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <Link href={`/post/${post.slug}`}>
                      <h3 className="text-xl font-bold hover:text-primary transition-colors mb-2">
                        {post.title}
                      </h3>
                    </Link>
                    {post.excerpt && (
                      <p className="text-muted-foreground line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatDate(post.createdAt)}</span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.likeCount}
                      </span>
                      <span>💬 {post.commentCount}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No posts yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
