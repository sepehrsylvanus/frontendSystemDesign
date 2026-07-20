"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPost } from "@/features/post/actions/createPost";

const page = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const handleSubmit = (status: "draft" | "published") => {
    setErrors({});
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    formData.append("coverImage", coverImage);
    formData.append("status", status);

    startTransition(async () => {
      const result = await createPost(formData);
      if (result?.error) {
        setErrors(
          typeof result.error === "string"
            ? { _form: [result.error] }
            : result.error,
        );
      }

      router.push("/dashboard");
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Post</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
