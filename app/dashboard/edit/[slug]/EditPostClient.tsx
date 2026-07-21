"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updatePost } from "@/features/post/actions/updatePost";

type EditPostClientProps = {
  postId: string;
  initialTitle: string;
  initialContent: string;
  initialCoverImage: string;
  initialTags: string;
  initialStatus: "draft" | "published";
};

const EditPostClient = ({
  postId,
  initialTitle,
  initialContent,
  initialCoverImage,
  initialTags,
  initialStatus,
}: EditPostClientProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState(initialTags);
  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const [status, setStatus] = useState<"draft" | "published">(initialStatus);

  const handleSubmit = (newStatus: "draft" | "published") => {
    setErrors({});
    const formData = new FormData();
    formData.append("id", postId);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    formData.append("coverImage", coverImage);
    formData.append("status", newStatus);

    startTransition(async () => {
      const result = await updatePost(formData);
      if (result?.error) {
        setErrors(
          typeof result.error === "string"
            ? { _form: [result.error] }
            : result.error,
        );
      } else {
        router.push("/dashboard");
      }
    });
  };

  return (
    <div className="space-y-6">
      {errors._form && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {errors._form[0]}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Your post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
          className="text-xl font-semibold"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover Image URL (optional)</Label>
        <Input
          id="coverImage"
          placeholder="https://example.com/image.jpg"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Write your post content here... (supports HTML)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
          rows={15}
          className="font-mono text-sm"
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input
          id="tags"
          placeholder="javascript, react, tutorial"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Add up to 4 tags to help readers find your post
        </p>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <Button
          variant="outline"
          onClick={() => handleSubmit("draft")}
          disabled={isPending || !title.trim() || !content.trim()}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save as Draft
        </Button>
        <Button
          onClick={() => handleSubmit("published")}
          disabled={isPending || !title.trim() || !content.trim()}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Eye className="mr-2 h-4 w-4" />
          )}
          Publish
        </Button>
      </div>
    </div>
  );
};

export default EditPostClient;
