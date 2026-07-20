"use client";

import { useTransition, useState, useEffect } from "react";
import { Heart, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleLike } from "@/features/feed/actions/toggleLike";
import { toggleBookmark } from "@/features/feed/actions/toggleBookmark";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  postId: string;
  postSlug: string;
  postTitle: string;
  initialLikeCount: number;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
}

export function PostActions({
  postId,
  postSlug,
  postTitle,
  initialLikeCount,
  initialLiked = false,
  initialBookmarked = false,
}: PostActionsProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => prev + (newLiked ? 1 : -1));

    startTransition(async () => {
      const result = await toggleLike(postId);
      if (!result.success) {
        setLiked(!newLiked);
        setLikeCount((prev) => prev + (newLiked ? -1 : 1));
      }
    });
  };

  const handleBookmark = () => {
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);

    startTransition(async () => {
      const result = await toggleBookmark(postId);
      if (!result.success) {
        setBookmarked(!newBookmarked);
      }
    });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${postSlug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle,
          url,
        });
      } catch (error) {
        console.error("Error happened in bookmarking", error);
      }
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLike}
        disabled={isPending}
      >
        <Heart
          className={cn(
            "h-4 w-4 mr-1 transition-colors",
            liked && "fill-red-500 text-red-500",
          )}
        />
        {likeCount}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBookmark}
        disabled={isPending}
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark post"}
      >
        <Bookmark
          className={cn(
            "h-4 w-4 transition-colors",
            bookmarked ? "fill-primary text-primary" : "",
          )}
        />
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
      </Button>
    </>
  );
}
