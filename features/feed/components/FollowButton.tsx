"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleFollow } from "@/features/feed/actions/toggleFollow";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing: boolean;
  className?: string;
}

export function FollowButton({
  targetUserId,
  initialIsFollowing,
  className,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    const newFollowing = !isFollowing;
    setIsFollowing(newFollowing);

    startTransition(async () => {
      const result = await toggleFollow(targetUserId);
      if (!result.success) {
        // Revert on failure
        setIsFollowing(!newFollowing);
      }
    });
  };

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={handleFollow}
      disabled={isPending}
      className={className}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <UserMinus className="h-4 w-4" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
