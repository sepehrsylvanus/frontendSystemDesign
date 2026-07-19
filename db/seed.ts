import "dotenv/config";
import { db } from "./index";
import {
  users,
  posts,
  tags,
  postTags,
  comments,
  likes,
  bookmarks,
  follows,
  notifications,
} from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await db.delete(notifications);
  await db.delete(follows);
  await db.delete(bookmarks);
  await db.delete(likes);
  await db.delete(comments);
  await db.delete(postTags);
  await db.delete(posts);
  await db.delete(tags);
  await db.delete(users);

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash("password123", 10);

  // ==================== USERS ====================
  console.log("👥 Creating users...");
  const user1 = await db
    .insert(users)
    .values({
      email: "alice@example.com",
      username: "alice",
      name: "Alice Johnson",
      password: hashedPassword,
      bio: "Full-stack developer passionate about React and Node.js",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      website: "https://alice.dev",
      location: "San Francisco, CA",
      role: "admin",
      isVerified: true,
    })
    .returning();

  const user2 = await db
    .insert(users)
    .values({
      email: "bob@example.com",
      username: "bob",
      name: "Bob Smith",
      password: hashedPassword,
      bio: "Backend engineer specializing in databases",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      website: "https://bobsmith.io",
      location: "New York, NY",
      role: "user",
      isVerified: true,
    })
    .returning();

  const user3 = await db
    .insert(users)
    .values({
      email: "charlie@example.com",
      username: "charlie",
      name: "Charlie Brown",
      password: hashedPassword,
      bio: "Frontend enthusiast and UI/UX designer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie",
      location: "London, UK",
      role: "user",
      isVerified: false,
    })
    .returning();

  const user4 = await db
    .insert(users)
    .values({
      email: "diana@example.com",
      username: "diana",
      name: "Diana Prince",
      password: hashedPassword,
      bio: "DevOps engineer and cloud architect",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=diana",
      website: "https://diana.cloud",
      location: "Berlin, Germany",
      role: "user",
      isVerified: true,
    })
    .returning();

  const user5 = await db
    .insert(users)
    .values({
      email: "eve@example.com",
      username: "eve",
      name: "Eve Davis",
      password: hashedPassword,
      bio: "Mobile developer and open source contributor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=eve",
      location: "Toronto, Canada",
      role: "user",
      isVerified: false,
    })
    .returning();

  console.log("✅ Created 5 users");

  // ==================== TAGS ====================
  console.log("🏷️  Creating tags...");
  const tag1 = await db
    .insert(tags)
    .values({ name: "React", slug: "react", color: "#61dafb" })
    .returning();
  const tag2 = await db
    .insert(tags)
    .values({ name: "Next.js", slug: "nextjs", color: "#000000" })
    .returning();
  const tag3 = await db
    .insert(tags)
    .values({ name: "TypeScript", slug: "typescript", color: "#3178c6" })
    .returning();
  const tag4 = await db
    .insert(tags)
    .values({ name: "PostgreSQL", slug: "postgresql", color: "#336791" })
    .returning();
  const tag5 = await db
    .insert(tags)
    .values({ name: "Drizzle ORM", slug: "drizzle-orm", color: "#c5f74f" })
    .returning();
  const tag6 = await db
    .insert(tags)
    .values({ name: "Tailwind CSS", slug: "tailwind-css", color: "#06b6d4" })
    .returning();
  const tag7 = await db
    .insert(tags)
    .values({ name: "Node.js", slug: "nodejs", color: "#339933" })
    .returning();

  console.log("✅ Created 7 tags");

  // ==================== POSTS ====================
  console.log("📝 Creating posts...");
  const post1 = await db
    .insert(posts)
    .values({
      title: "Getting Started with Next.js 14",
      slug: "getting-started-with-nextjs-14",
      content: `
# Getting Started with Next.js 14

Next.js 14 brings exciting new features including Server Actions, improved performance, and better developer experience.

## Key Features

- **Server Components**: Render components on the server for better performance
- **Server Actions**: Handle form submissions and data mutations directly in your components
- **Partial Prerendering**: Combine static and dynamic content seamlessly

## Getting Started

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

This is a comprehensive guide to building modern web applications with Next.js.
    `.trim(),
      excerpt:
        "Learn how to build modern web applications with Next.js 14 and its new features.",
      coverImage:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      status: "published",
      authorId: user1[0].id,
      likeCount: 42,
      commentCount: 8,
      viewCount: 1250,
      publishedAt: new Date("2024-01-15"),
    })
    .returning();

  const post2 = await db
    .insert(posts)
    .values({
      title: "Mastering TypeScript: Advanced Patterns",
      slug: "mastering-typescript-advanced-patterns",
      content: `
# Mastering TypeScript: Advanced Patterns

TypeScript is more than just type annotations. Let's explore advanced patterns that will make your code more robust.

## Generics

Generics allow you to write flexible, reusable code:

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

## Utility Types

TypeScript provides powerful utility types like \`Partial\`, \`Pick\`, and \`Omit\`.

## Best Practices

- Use strict mode
- Leverage type inference
- Create custom type guards
    `.trim(),
      excerpt:
        "Explore advanced TypeScript patterns including generics, utility types, and best practices.",
      coverImage:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
      status: "published",
      authorId: user2[0].id,
      likeCount: 38,
      commentCount: 5,
      viewCount: 980,
      publishedAt: new Date("2024-01-20"),
    })
    .returning();

  const post3 = await db
    .insert(posts)
    .values({
      title: "Building Scalable APIs with PostgreSQL",
      slug: "building-scalable-apis-with-postgresql",
      content: `
# Building Scalable APIs with PostgreSQL

PostgreSQL is a powerful relational database. Here's how to build scalable APIs with it.

## Database Design

- Normalize your data
- Use appropriate indexes
- Design for scalability from the start

## Query Optimization

Learn to write efficient queries and use EXPLAIN ANALYZE to optimize them.

## Connection Pooling

Use connection pooling to manage database connections efficiently.
    `.trim(),
      excerpt:
        "Learn how to design and build scalable APIs using PostgreSQL database.",
      coverImage:
        "https://images.unsplash.com/photo-1544383835-bda2bc0a529d?w=800",
      status: "published",
      authorId: user2[0].id,
      likeCount: 56,
      commentCount: 12,
      viewCount: 2100,
      publishedAt: new Date("2024-02-01"),
    })
    .returning();

  const post4 = await db
    .insert(posts)
    .values({
      title: "Modern CSS with Tailwind",
      slug: "modern-css-with-tailwind",
      content: `
# Modern CSS with Tailwind

Tailwind CSS has revolutionized how we write CSS. Let's explore its features.

## Utility-First Approach

Instead of writing custom CSS, use pre-built utility classes.

## Responsive Design

Tailwind makes responsive design intuitive with mobile-first breakpoints.

## Customization

Extend Tailwind with your own design system.
    `.trim(),
      excerpt:
        "Discover how Tailwind CSS can speed up your development workflow.",
      coverImage:
        "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800",
      status: "published",
      authorId: user3[0].id,
      likeCount: 29,
      commentCount: 3,
      viewCount: 750,
      publishedAt: new Date("2024-02-10"),
    })
    .returning();

  const post5 = await db
    .insert(posts)
    .values({
      title: "Drizzle ORM vs Prisma: A Comparison",
      slug: "drizzle-orm-vs-prisma-comparison",
      content: `
# Drizzle ORM vs Prisma: A Comparison

Both are excellent TypeScript ORMs, but they have different philosophies.

## Drizzle ORM

- SQL-like syntax
- Lightweight and fast
- More control over queries

## Prisma

- Declarative schema
- Great developer experience
- Built-in migration tool

## Which to Choose?

It depends on your project needs and preferences.
    `.trim(),
      excerpt:
        "Compare Drizzle ORM and Prisma to choose the right ORM for your project.",
      coverImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      status: "draft",
      authorId: user1[0].id,
      likeCount: 0,
      commentCount: 0,
      viewCount: 0,
    })
    .returning();

  const post6 = await db
    .insert(posts)
    .values({
      title: "Deploying Node.js Apps to Production",
      slug: "deploying-nodejs-apps-to-production",
      content: `
# Deploying Node.js Apps to Production

Learn best practices for deploying Node.js applications.

## Environment Configuration

- Use environment variables
- Never commit secrets
- Use different configs for different environments

## Process Management

Use PM2 or similar tools to manage your Node.js processes.

## Monitoring

Set up logging and monitoring to track your application's health.
    `.trim(),
      excerpt:
        "Best practices for deploying and maintaining Node.js applications in production.",
      coverImage:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
      status: "published",
      authorId: user4[0].id,
      likeCount: 45,
      commentCount: 7,
      viewCount: 1800,
      publishedAt: new Date("2024-02-20"),
    })
    .returning();

  console.log("✅ Created 6 posts");

  // ==================== POST_TAGS ====================
  console.log("🔗 Creating post-tag relationships...");
  await db.insert(postTags).values([
    { postId: post1[0].id, tagId: tag1[0].id },
    { postId: post1[0].id, tagId: tag2[0].id },
    { postId: post1[0].id, tagId: tag3[0].id },
    { postId: post2[0].id, tagId: tag3[0].id },
    { postId: post3[0].id, tagId: tag4[0].id },
    { postId: post3[0].id, tagId: tag7[0].id },
    { postId: post4[0].id, tagId: tag6[0].id },
    { postId: post5[0].id, tagId: tag4[0].id },
    { postId: post5[0].id, tagId: tag5[0].id },
    { postId: post6[0].id, tagId: tag7[0].id },
  ]);

  console.log("✅ Created post-tag relationships");

  // ==================== COMMENTS ====================
  console.log("💬 Creating comments...");
  await db.insert(comments).values([
    {
      content: "Great article! Really helped me understand Next.js 14 better.",
      postId: post1[0].id,
      authorId: user2[0].id,
      likeCount: 5,
    },
    {
      content: "Thanks for sharing this. Server Actions are game changers!",
      postId: post1[0].id,
      authorId: user3[0].id,
      likeCount: 3,
    },
    {
      content:
        "Very comprehensive guide. Would love to see more on TypeScript patterns.",
      postId: post2[0].id,
      authorId: user1[0].id,
      likeCount: 7,
    },
    {
      content:
        "This is exactly what I needed. PostgreSQL indexing tips are gold!",
      postId: post3[0].id,
      authorId: user4[0].id,
      likeCount: 12,
    },
    {
      content: "Tailwind has completely changed how I write CSS. Great post!",
      postId: post4[0].id,
      authorId: user5[0].id,
      likeCount: 4,
    },
    {
      content: "Good comparison. I prefer Drizzle for its SQL-like syntax.",
      postId: post5[0].id,
      authorId: user2[0].id,
      likeCount: 8,
    },
    {
      content: "Production deployment tips are very useful. Bookmarked!",
      postId: post6[0].id,
      authorId: user3[0].id,
      likeCount: 6,
    },
  ]);

  console.log("✅ Created comments");

  // ==================== LIKES ====================
  console.log("❤️  Creating likes...");
  await db.insert(likes).values([
    { userId: user2[0].id, postId: post1[0].id },
    { userId: user3[0].id, postId: post1[0].id },
    { userId: user4[0].id, postId: post1[0].id },
    { userId: user1[0].id, postId: post2[0].id },
    { userId: user3[0].id, postId: post2[0].id },
    { userId: user1[0].id, postId: post3[0].id },
    { userId: user4[0].id, postId: post3[0].id },
    { userId: user5[0].id, postId: post3[0].id },
    { userId: user1[0].id, postId: post4[0].id },
    { userId: user2[0].id, postId: post6[0].id },
    { userId: user3[0].id, postId: post6[0].id },
    { userId: user4[0].id, postId: post6[0].id },
  ]);

  console.log("✅ Created likes");

  // ==================== BOOKMARKS ====================
  console.log("🔖 Creating bookmarks...");
  await db.insert(bookmarks).values([
    { userId: user1[0].id, postId: post3[0].id },
    { userId: user1[0].id, postId: post6[0].id },
    { userId: user2[0].id, postId: post1[0].id },
    { userId: user3[0].id, postId: post2[0].id },
    { userId: user4[0].id, postId: post4[0].id },
  ]);

  console.log("✅ Created bookmarks");

  // ==================== FOLLOWS ====================
  console.log("👥 Creating follows...");
  await db.insert(follows).values([
    { followerId: user2[0].id, followingId: user1[0].id },
    { followerId: user3[0].id, followingId: user1[0].id },
    { followerId: user4[0].id, followingId: user1[0].id },
    { followerId: user1[0].id, followingId: user2[0].id },
    { followerId: user5[0].id, followingId: user2[0].id },
    { followerId: user1[0].id, followingId: user3[0].id },
    { followerId: user2[0].id, followingId: user4[0].id },
    { followerId: user3[0].id, followingId: user4[0].id },
    { followerId: user4[0].id, followingId: user5[0].id },
  ]);

  console.log("✅ Created follows");

  // ==================== NOTIFICATIONS ====================
  console.log("🔔 Creating notifications...");
  await db.insert(notifications).values([
    {
      userId: user1[0].id,
      type: "comment",
      title: "New Comment",
      message: "Bob Smith commented on your post",
      actorId: user2[0].id,
      postId: post1[0].id,
      isRead: false,
    },
    {
      userId: user1[0].id,
      type: "like",
      title: "New Like",
      message: "Charlie Brown liked your post",
      actorId: user3[0].id,
      postId: post1[0].id,
      isRead: false,
    },
    {
      userId: user2[0].id,
      type: "follow",
      title: "New Follower",
      message: "Alice Johnson started following you",
      actorId: user1[0].id,
      isRead: true,
    },
    {
      userId: user3[0].id,
      type: "comment",
      title: "New Comment",
      message: "Alice Johnson replied to your comment",
      actorId: user1[0].id,
      postId: post2[0].id,
      isRead: false,
    },
  ]);

  console.log("✅ Created notifications");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📊 Summary:");
  console.log("   - 5 users created");
  console.log("   - 7 tags created");
  console.log("   - 6 posts created");
  console.log("   - Post-tag relationships created");
  console.log(
    "   - Comments, likes, bookmarks, follows, and notifications created",
  );
  console.log("\n🔑 Demo credentials:");
  console.log("   Email: alice@example.com");
  console.log("   Password: password123");
}

seed().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});
