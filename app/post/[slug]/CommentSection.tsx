"use client";

import { useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import { addComment } from "@/features/post/actions/addComment";
import { Loader2 } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    name: string;
    username: string;
    avatar: string | null;
  };
}

interface CommentSectionProps {
  postId: string;
  initialComments?: Comment[];
}

export const CommentSection = ({
  postId,
  initialComments = [],
}: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setError("");
    const formData = new FormData();
    formData.append("content", content);
    formData.append("postId", postId);

    startTransition(async () => {
      const result = await addComment(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.comment) {
        setComments([result.comment, ...comments]);
        setContent("");
      }
    });
  };
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Add to the discussion..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          disabled={isPending}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={isPending || !content.trim()}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post Comment"
          )}
        </Button>
      </form>

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.author.avatar || undefined} />
                <AvatarFallback>
                  {getInitials(comment.author.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{comment.author.name}</span>
                  <span className="text-sm text-muted-foreground">
                    @{comment.author.username}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    · {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  );
};
