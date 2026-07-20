"use server";

import { db } from "@/db";
import { bookmarks, likes, posts, postTags, tags, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { and, desc, eq, inArray, lt, or, sql } from "drizzle-orm";

export async function getFeedPage(
  cursor: string | null,
  limit: number = 10,
  tagFilter?: string,
) {
  try {
    const currentUser = await getCurrentUser();

    let cursorDate: string | undefined;
    let cursorId: string | undefined;
    if (cursor) {
      const parts = cursor.split("__");
      cursorDate = parts[0];
      cursorId = parts[1];
    }

    const cursorCondition = cursor
      ? or(
          lt(posts.createdAt, new Date(cursorDate!)),
          and(
            sql`${posts.createdAt} = ${new Date(cursorDate!)}::timestamptz`,
            lt(posts.id, cursorId!),
          ),
        )
      : undefined;

    const conditions: (typeof cursorCondition)[] = [
      eq(posts.status, "published"),
    ];

    if (cursorCondition) {
      conditions.push(cursorCondition);
    }

    let postsList;

    if (tagFilter) {
      const tagResult = await db
        .select({ id: tags.id })
        .from(tags)
        .where(eq(tags.slug, tagFilter))
        .limit(1);

      if (tagResult.length === 0) {
        return { items: [], nextCursor: null, hasMore: false };
      }

      const tagId = tagResult[0].id;

      const postsWithTag = await db
        .select({ postId: postTags.postId })
        .from(postTags)
        .where(eq(postTags.tagId, tagId));

      const postIds = postsWithTag.map((p) => p.postId);

      if (postIds.length === 0) {
        return { items: [], nextCursor: null, hasMore: false };
      }

      postsList = await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          excerpt: posts.excerpt,
          coverImage: posts.coverImage,
          likeCount: posts.likeCount,
          commentCount: posts.commentCount,
          createdAt: posts.createdAt,
          authorId: posts.authorId,
          authorName: users.name,
          authorUsername: users.username,
          authorAvatar: users.avatar,
        })
        .from(posts)
        .innerJoin(users, eq(posts.authorId, users.id))
        .where(
          and(
            eq(posts.status, "published"),
            inArray(posts.id, postIds),
            cursorCondition,
          ),
        )
        .orderBy(desc(posts.createdAt))
        .limit(limit + 1);
    } else {
      postsList = await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          excerpt: posts.excerpt,
          coverImage: posts.coverImage,
          likeCount: posts.likeCount,
          commentCount: posts.commentCount,
          createdAt: posts.createdAt,
          authorId: posts.authorId,
          authorName: users.name,
          authorUsername: users.username,
          authorAvatar: users.avatar,
        })
        .from(posts)
        .innerJoin(users, eq(posts.authorId, users.id))
        .where(and(...conditions))
        .orderBy(desc(posts.createdAt))
        .limit(limit + 1);
    }

    const hasMore = postsList.length > limit;
    const items = hasMore ? postsList.slice(0, -1) : postsList;

    const postIds = items.map((p) => p.id);

    const postTagsData =
      postIds.length > 0
        ? await db
            .select({
              postId: postTags.postId,
              tagName: tags.name,
              tagSlug: tags.slug,
              tagColor: tags.color,
            })
            .from(postTags)
            .innerJoin(tags, eq(postTags.tagId, tags.id))
            .where(inArray(postTags.postId, postIds))
        : [];

    let userLikes: string[] = [];
    let userBookmarks: string[] = [];

    if (currentUser && postIds.length > 0) {
      const [likesData, bookmarksData] = await Promise.all([
        db
          .select({ postId: likes.postId })
          .from(likes)
          .where(
            and(
              eq(likes.userId, currentUser.userId),
              inArray(likes.postId, postIds),
            ),
          ),
        db
          .select({ postId: bookmarks.postId })
          .from(bookmarks)
          .where(
            and(
              eq(bookmarks.userId, currentUser.userId),
              inArray(bookmarks.postId, postIds),
            ),
          ),
      ]);

      userLikes = likesData.map((l) => l.postId);
      userBookmarks = bookmarksData.map((b) => b.postId);
    }

    const formattedItems = items.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt,
      author: {
        name: post.authorName,
        username: post.authorUsername,
        avatar: post.authorAvatar,
      },
      tags: postTagsData
        .filter((t) => t.postId === post.id)
        .map((t) => ({
          name: t.tagName,
          slug: t.tagSlug,
          color: t.tagColor,
        })),
      isLiked: userLikes.includes(post.id),
      isBookmarked: userBookmarks.includes(post.id),
    }));

    const nextCursor = hasMore
      ? `${items[items.length - 1].createdAt.toISOString()}__${items[items.length - 1].id}`
      : null;

    return {
      items: formattedItems,
      nextCursor,
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching feed:", error);
    return { items: [], nextCursor: null, hasMore: false };
  }
}
