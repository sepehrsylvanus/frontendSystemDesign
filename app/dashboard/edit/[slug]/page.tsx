import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { posts, postTags, tags } from "@/db/schema";
import { eq } from "drizzle-orm";
import EditPostClient from "./EditPostClient";

const EditPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/login");
  }

  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  if (post.length === 0) {
    notFound();
  }

  const postData = post[0];

  if (postData.authorId !== currentUser.userId) {
    redirect("/dashboard");
  }

  const postTagsData = await db
    .select({
      tagName: tags.name,
    })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, postData.id));

  const tagsString = postTagsData.map((t) => t.tagName).join(", ");

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
          <CardTitle className="text-2xl">Edit Post</CardTitle>
        </CardHeader>

        <CardContent>
          <EditPostClient
            postId={postData.id}
            initialTitle={postData.title}
            initialContent={postData.content}
            initialCoverImage={postData.coverImage || ""}
            initialTags={tagsString}
            initialStatus={postData.status as "draft" | "published"}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPage;
