import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { posts, likes, comments } from "@/db/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";
import { TrendingUp, Eye, Heart, MessageCircle, Calendar } from "lucide-react";

const AnalyticsPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/login");
  }

  // Get daily stats for last 7 days

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Get top performing posts
  const topPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      viewCount: posts.viewCount,
      likeCount: posts.likeCount,
      commentCount: posts.commentCount,
      createdAt: posts.createdAt,
    })
    .from(posts)
    .where(eq(posts.authorId, currentUser.userId))
    .orderBy(desc(posts.likeCount))
    .limit(5);

  // Get aggregate stats
  const [totalStats] = await db
    .select({
      totalViews: sql<number>`coalesce(sum(${posts.viewCount}), 0)::int`,
      totalLikes: sql<number>`coalesce(sum(${posts.likeCount}), 0)::int`,
      totalComments: sql<number>`coalesce(sum(${posts.commentCount}), 0)::int`,
      totalPosts: sql<number>`count(*)::int`,
    })
    .from(posts)
    .where(eq(posts.authorId, currentUser.userId));

  // Get recent activity
  const recentLikes = await db
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(likes)
    .innerJoin(posts, eq(likes.postId, posts.id))
    .where(
      and(
        eq(posts.authorId, currentUser.userId),
        gte(likes.createdAt, sevenDaysAgo),
      ),
    );

  const recentComments = await db
    .select({
      count: sql<number>`count(*)::int`,
    })
    .from(comments)
    .innerJoin(posts, eq(comments.postId, posts.id))
    .where(
      and(
        eq(posts.authorId, currentUser.userId),
        gte(comments.createdAt, sevenDaysAgo),
      ),
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your content performance</p>
      </div>

      {/* Overview Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Views"
          value={totalStats?.totalViews || 0}
          icon={<Eye className="h-4 w-4" />}
          description="All time"
        />
        <StatCard
          title="Total Likes"
          value={totalStats?.totalLikes || 0}
          icon={<Heart className="h-4 w-4" />}
          description={`+${recentLikes[0]?.count || 0} this week`}
        />
        <StatCard
          title="Total Comments"
          value={totalStats?.totalComments || 0}
          icon={<MessageCircle className="h-4 w-4" />}
          description={`+${recentComments[0]?.count || 0} this week`}
        />
        <StatCard
          title="Published Posts"
          value={totalStats?.totalPosts || 0}
          icon={<Calendar className="h-4 w-4" />}
          description="All time"
        />
      </div>

      {/* Top Performing Posts */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing Posts
          </CardTitle>
          <CardDescription>
            Your most popular content based on engagement
          </CardDescription>
        </CardHeader>

        <CardContent>
          {topPosts.length > 0 ? (
            <div className="space-y-4">
              {topPosts.map((post, idx) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                >
                  <span className="text-2xl font-bold text-muted-foreground/50">
                    {idx + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{post.title}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No posts yet. Start writing to see analytics!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
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
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
