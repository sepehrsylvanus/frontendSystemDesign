import { useState, useTransition } from "react";
import { toggleLike } from "../actions/toggleLike";
import { toggleBookmark } from "../actions/toggleBookmark";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatRelativeTime, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Heart, MessageCircle } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    likeCount: number;
    commentCount: number;
    createdAt: string | Date;
    author: {
      name: string;
      username: string;
      avatar: string | null;
    };
    tags: { name: string; slug: string; color: string | null }[];
    isLiked?: boolean;
    isBookmarked?: boolean;
  };
}

const PostCard = ({ post }: PostCardProps) => {
  const [liked, setLiked] = useState(post.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked ?? false);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));

    startTransition(async () => {
      const result = await toggleLike(post.id);
      if (!result.success) {
        setLiked(liked);
        setLikeCount(post.likeCount);
      }
    });
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    startTransition(async () => {
      const result = await toggleBookmark(post.id);
      if (!result.success) {
        setBookmarked(bookmarked);
      }
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author.username}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar || undefined} />
              <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
            </Avatar>
          </Link>

          <div>
            <Link
              href={`/profile/${post.author.username}`}
              className="text-sm font-medium hover:underline"
            >
              {post.author.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(post.createdAt)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {post.coverImage && (
          <Link href={`/post/${post.slug}`}>
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          </Link>
        )}

        <Link href={`/post/${post.slug}`}>
          <h2 className="text-xl font-bold hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="mt-2 text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {post.tags.slice(0, 4).map((tag) => (
              <Link key={tag.slug} href={`/explore?tag=${tag.slug}`}>
                <Badge
                  variant="secondary"
                  className="text-xs hover:bg-secondary/80 cursor-pointer"
                  style={{ borderColor: tag.color || undefined }}
                >
                  #{tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2 pt-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isPending}
          aria-label={liked ? "Unlike post" : "Like post"}
          aria-pressed={liked}
        >
          <Heart
            className={cn(
              "mr-1 h-4 w-4 transition-colors",
              liked ? "fill-red-500 text-red-500" : "text-muted-foreground",
            )}
          />
          <span>{likeCount}</span>
        </Button>

        <Link href={`/post/${post.slug}#comments`}>
          <Button variant="ghost" size="sm">
            <MessageCircle className="mr-1 h-4 w-4 text-muted-foreground" />
            <span>{post.commentCount}</span>
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          disabled={isPending}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark post"}
          className="ml-auto"
        >
          <Bookmark
            className={cn(
              "h-4 w-4 transition-colors",
              bookmarked
                ? "fill-primary text-primary"
                : "text-muted-foreground",
            )}
          />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
