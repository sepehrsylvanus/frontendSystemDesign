import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, getInitials } from "@/lib/utils";
import { db } from "@/db";
import {
  posts,
  users,
  postTags,
  tags,
  comments,
  likes,
  bookmarks,
} from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { CommentSection } from "./CommentSection";
import { PostActions } from "@/features/post/components/PostActions";

interface Props {
  params: Promise<{ slug: string }>;
}
const PostPage = async ({ params }: Props) => {
  const { slug } = await params;

  const [post] = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      content: posts.content,
      excerpt: posts.excerpt,
      coverImage: posts.coverImage,
      likeCount: posts.likeCount,
      commentCount: posts.commentCount,
      viewCount: posts.viewCount,
      createdAt: posts.createdAt,
      publishedAt: posts.publishedAt,
      authorId: users.id,
      authorName: users.name,
      authorUsername: users.username,
      authorAvatar: users.avatar,
      authorBio: users.bio,
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.slug, slug))
    .limit(1);

  if (!post) {
    notFound();
  }

  const postTagsData = await db
    .select({
      name: tags.name,
      slug: tags.slug,
      color: tags.color,
    })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, post.id));

  const currentUser = await getCurrentUser();
  let isLiked = false;
  let isBookmarked = false;

  if (currentUser) {
    const [existingLike] = await db
      .select()
      .from(likes)
      .where(
        and(eq(likes.userId, currentUser.userId), eq(likes.postId, post.id)),
      )
      .limit(1);
    isLiked = !!existingLike;

    const [existingBookmark] = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, currentUser.userId),
          eq(bookmarks.postId, post.id),
        ),
      )
      .limit(1);
    isBookmarked = !!existingBookmark;
  }

  const postComments = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      authorId: users.id,
      authorName: users.name,
      authorUsername: users.username,
      authorAvatar: users.avatar,
    })
    .from(comments)
    .innerJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.postId, post.id))
    .orderBy(desc(comments.createdAt))
    .limit(50);

  const initialComments = postComments.map((c) => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    author: {
      name: c.authorName,
      username: c.authorUsername,
      avatar: c.authorAvatar,
    },
  }));

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to feed
      </Link>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
        />
      )}

      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

      {postTagsData.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {postTagsData.map((tag) => (
            <Link key={tag.slug} href={`/explore?tag=${tag.slug}`}>
              <Badge variant="secondary" className="cursor-pointer">
                #{tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mb-8 pb-8 border-b">
        <Link href={`/profile/${post.authorUsername}`}>
          <Avatar className="h-12 w-12">
            <AvatarImage src={post.authorAvatar || undefined} />
            <AvatarFallback>{getInitials(post.authorName)}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link
            href={`/profile/${post.authorUsername}`}
            className="font-semibold hover:underline"
          >
            {post.authorName}
          </Link>
          <p className="text-sm text-muted-foreground">
            Published on {formatDate(post.publishedAt || post.createdAt)}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <PostActions
            postId={post.id}
            postSlug={post.slug}
            postTitle={post.title}
            initialLikeCount={post.likeCount}
            initialLiked={isLiked}
            initialBookmarked={isBookmarked}
          />
        </div>
      </div>

      <div className="prose max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      <section id="comments" className="scroll-mt-20">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          Comments ({post.commentCount})
        </h2>
        <Suspense fallback={<CommentsSkeleton />}>
          <CommentSection postId={post.id} initialComments={initialComments} />
        </Suspense>
      </section>
    </article>
  );
};

function CommentsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostPage;
