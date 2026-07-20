import { redirect } from "next/navigation";
import Link from "next/link";
import {
  PenSquare,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  FileText,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { posts, users, likes, comments } from "@/db/schema";
import { eq, desc, sql, count } from "drizzle-orm";
import { formatRelativeTime } from "@/lib/utils";

const page = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/login");
  }

  const userPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      status: posts.status,
      likeCount: posts.likeCount,
      commentCount: posts.commentCount,
      viewCount: posts.viewCount,
      createdAt: posts.createdAt,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(eq(posts.authorId, currentUser.userId))
    .orderBy(desc(posts.createdAt))
    .limit(10);

  const stats = await db
    .select({
      totalPosts: count(posts.id),
      totalViews: sql<number>`coalesce(sum(${posts.viewCount}), 0)::int`,
      totalLikes: sql<number>`coalesce(sum(${posts.likeCount}), 0)::int`,
      totalComments: sql<number>`coalesce(sum(${posts.commentCount}), 0)::int`,
    })
    .from(posts)
    .where(eq(posts.authorId, currentUser.userId));

  const { totalPosts, totalViews, totalLikes, totalComments } = stats[0] || {
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your content.
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Posts"
          value={totalPosts}
          icon={<FileText className="h-4 w-4" />}
        />
        <StatCard
          title="Total Views"
          value={totalViews}
          icon={<Eye className="h-4 w-4" />}
        />
        <StatCard
          title="Total Likes"
          value={totalLikes}
          icon={<Heart className="h-4 w-4" />}
        />
        <StatCard
          title="Total Comments"
          value={totalComments}
          icon={<MessageCircle className="h-4 w-4" />}
        />
      </div>

      {/* Recent Posts */}

      <Card>
        <CardHeader>
          <CardTitle>Your Posts</CardTitle>
          <CardDescription>
            Manage and track your published content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userPosts.length > 0 ? (
            <div className="divide-y">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="py-4 first:pt-0 last:pb-0 flex items-center gap-4"
                >
                  <div className="flex-1 min-w-md">
                    <Link
                      href={`/post/${post.slug}`}
                      className="font-medium hover:text-primary transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>

                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <Badge
                        variant={
                          post.status === "published" ? "default" : "secondary"
                        }
                      >
                        {post.status}
                      </Badge>

                      <span>{formatRelativeTime(post.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {post.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {post.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {post.commentCount}
                    </span>
                  </div>
                  <Link href={`/dashboard/edit/${post.slug}`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <PenSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Share your knowledge with the community!
              </p>
              <Link href="/dashboard/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Write your first post
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default page;

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}
