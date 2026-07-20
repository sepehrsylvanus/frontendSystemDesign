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
  const tag8 = await db
    .insert(tags)
    .values({ name: "JavaScript", slug: "javascript", color: "#f7df1e" })
    .returning();
  const tag9 = await db
    .insert(tags)
    .values({ name: "GraphQL", slug: "graphql", color: "#e535ab" })
    .returning();
  const tag10 = await db
    .insert(tags)
    .values({ name: "Docker", slug: "docker", color: "#2496ed" })
    .returning();
  const tag11 = await db
    .insert(tags)
    .values({ name: "CSS", slug: "css", color: "#1572b6" })
    .returning();
  const tag12 = await db
    .insert(tags)
    .values({ name: "Testing", slug: "testing", color: "#e6631a" })
    .returning();
  const tag13 = await db
    .insert(tags)
    .values({ name: "Performance", slug: "performance", color: "#4caf50" })
    .returning();
  const tag14 = await db
    .insert(tags)
    .values({ name: "Security", slug: "security", color: "#ff5722" })
    .returning();

  console.log("✅ Created 14 tags");

  const allTags = [
    tag1,
    tag2,
    tag3,
    tag4,
    tag5,
    tag6,
    tag7,
    tag8,
    tag9,
    tag10,
    tag11,
    tag12,
    tag13,
    tag14,
  ];
  const users_list = [user1, user2, user3, user4, user5];

  // ==================== POSTS ====================
  console.log("📝 Creating posts...");

  const postData = [
    {
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
      authorIdx: 0,
      likeCount: 42,
      commentCount: 8,
      viewCount: 1250,
      publishedAt: new Date("2024-01-15"),
      tagIdxs: [0, 1, 2],
    },
    {
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
      authorIdx: 1,
      likeCount: 38,
      commentCount: 5,
      viewCount: 980,
      publishedAt: new Date("2024-01-20"),
      tagIdxs: [2],
    },
    {
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
      authorIdx: 1,
      likeCount: 56,
      commentCount: 12,
      viewCount: 2100,
      publishedAt: new Date("2024-02-01"),
      tagIdxs: [3, 6],
    },
    {
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
      authorIdx: 2,
      likeCount: 29,
      commentCount: 3,
      viewCount: 750,
      publishedAt: new Date("2024-02-10"),
      tagIdxs: [5, 10],
    },
    {
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
      status: "published",
      authorIdx: 0,
      likeCount: 15,
      commentCount: 3,
      viewCount: 400,
      publishedAt: new Date("2024-02-15"),
      tagIdxs: [3, 4],
    },
    {
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
      authorIdx: 3,
      likeCount: 45,
      commentCount: 7,
      viewCount: 1800,
      publishedAt: new Date("2024-02-20"),
      tagIdxs: [6],
    },
    // ==================== 7 ====================
    {
      title: "React Server Components Explained",
      slug: "react-server-components-explained",
      content: `
# React Server Components Explained

React Server Components represent a paradigm shift in how we build React applications.

## What Are Server Components?

Server Components run exclusively on the server, reducing the JavaScript bundle sent to the client.

## Benefits

- Smaller bundle sizes
- Direct database access
- Automatic code splitting
- Better initial page load

## When to Use Server vs Client Components

Use Server Components for data fetching and static content. Use Client Components for interactivity.
    `.trim(),
      excerpt:
        "A deep dive into React Server Components and how they change the way we build React apps.",
      coverImage:
        "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800",
      status: "published",
      authorIdx: 0,
      likeCount: 62,
      commentCount: 15,
      viewCount: 2800,
      publishedAt: new Date("2024-02-25"),
      tagIdxs: [0, 1],
    },
    {
      title: "GraphQL API Design Best Practices",
      slug: "graphql-api-design-best-practices",
      content: `
# GraphQL API Design Best Practices

Learn how to design robust and scalable GraphQL APIs.

## Schema Design

- Use descriptive type names
- Implement proper pagination
- Design mutations thoughtfully

## Performance Optimization

- Implement dataloaders for batching
- Use query complexity analysis
- Cache effectively

## Security

- Validate input thoroughly
- Implement rate limiting
- Use persisted queries
    `.trim(),
      excerpt:
        "Best practices for designing, building, and securing GraphQL APIs in production.",
      coverImage:
        "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800",
      status: "published",
      authorIdx: 1,
      likeCount: 34,
      commentCount: 6,
      viewCount: 1100,
      publishedAt: new Date("2024-03-01"),
      tagIdxs: [8, 2],
    },
    {
      title: "Docker for Frontend Developers",
      slug: "docker-for-frontend-developers",
      content: `
# Docker for Frontend Developers

Docker isn't just for backend engineers. Here's how frontend developers can benefit from containerization.

## Why Docker?

- Consistent development environments
- Easy CI/CD integration
- Simplified deployment

## Creating a Dockerfile for a Next.js App

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
\`\`\`

## Docker Compose for Full-Stack Development

Set up your frontend, backend, and database with a single command.
    `.trim(),
      excerpt:
        "A practical guide to using Docker for frontend development and deployment.",
      coverImage:
        "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800",
      status: "published",
      authorIdx: 3,
      likeCount: 27,
      commentCount: 4,
      viewCount: 670,
      publishedAt: new Date("2024-03-05"),
      tagIdxs: [9],
    },
    {
      title: "Advanced React Hooks: Custom Hooks Deep Dive",
      slug: "advanced-react-hooks-custom-hooks",
      content: `
# Advanced React Hooks: Custom Hooks Deep Dive

Custom Hooks are the ultimate tool for logic reuse in React applications.

## Building a useDebounce Hook

\`\`\`typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}
\`\`\`

## Composing Hooks

Combine multiple hooks to create powerful abstractions.

## Testing Custom Hooks

Use renderHook from @testing-library/react to test your hooks.
    `.trim(),
      excerpt:
        "Master custom React Hooks with advanced patterns, composition techniques, and testing strategies.",
      coverImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      status: "published",
      authorIdx: 2,
      likeCount: 48,
      commentCount: 10,
      viewCount: 1600,
      publishedAt: new Date("2024-03-10"),
      tagIdxs: [0, 2, 11],
    },
    {
      title: "PostgreSQL Performance Tuning Guide",
      slug: "postgresql-performance-tuning-guide",
      content: `
# PostgreSQL Performance Tuning Guide

Optimize your PostgreSQL database for maximum performance.

## Indexing Strategies

- B-tree indexes for equality and range queries
- GIN indexes for full-text search
- Partial indexes for filtered queries

## Query Optimization

- Use EXPLAIN ANALYZE
- Avoid N+1 queries
- Leverage materialized views

## Configuration Tuning

Adjust shared_buffers, work_mem, and effective_cache_size for your workload.
    `.trim(),
      excerpt:
        "Comprehensive guide to tuning PostgreSQL for better query performance and scalability.",
      coverImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      status: "published",
      authorIdx: 1,
      likeCount: 51,
      commentCount: 9,
      viewCount: 1950,
      publishedAt: new Date("2024-03-15"),
      tagIdxs: [3, 12],
    },
    {
      title: "CSS Grid vs Flexbox: When to Use What",
      slug: "css-grid-vs-flexbox",
      content: `
# CSS Grid vs Flexbox: When to Use What

Both CSS Grid and Flexbox are powerful layout tools. Learn when to use each.

## Flexbox

Best for one-dimensional layouts (rows or columns).

- Navigation bars
- Centering content
- Form elements

## CSS Grid

Best for two-dimensional layouts (rows and columns simultaneously).

- Page layouts
- Image galleries
- Dashboard designs

## Combining Both

Use Grid for the overall page layout and Flexbox for components within grid cells.
    `.trim(),
      excerpt:
        "Learn the difference between CSS Grid and Flexbox and when to use each layout method.",
      coverImage:
        "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=800",
      status: "published",
      authorIdx: 2,
      likeCount: 33,
      commentCount: 7,
      viewCount: 890,
      publishedAt: new Date("2024-03-20"),
      tagIdxs: [10, 5],
    },
    {
      title: "Unit Testing React Components with Vitest",
      slug: "unit-testing-react-vitest",
      content: `
# Unit Testing React Components with Vitest

Vitest is a blazing-fast unit test framework powered by Vite.

## Setting Up Vitest

\`\`\`bash
npm install vitest @testing-library/react @testing-library/jest-dom -D
\`\`\`

## Testing Components

- Render components with render()
- Simulate user interactions with fireEvent
- Assert expected behavior

## Mocking API Calls

Use vi.mock() to mock fetch or axios calls in your tests.
    `.trim(),
      excerpt:
        "Get started with unit testing React components using Vitest and Testing Library.",
      coverImage:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
      status: "published",
      authorIdx: 0,
      likeCount: 22,
      commentCount: 4,
      viewCount: 540,
      publishedAt: new Date("2024-03-25"),
      tagIdxs: [0, 11, 7],
    },
    {
      title: "Web Security Essentials: XSS and CSRF Prevention",
      slug: "web-security-essentials-xss-csrf",
      content: `
# Web Security Essentials: XSS and CSRF Prevention

Protect your web applications from common security vulnerabilities.

## Cross-Site Scripting (XSS)

- Sanitize user input
- Use Content Security Policy (CSP)
- Escape output properly

## Cross-Site Request Forgery (CSRF)

- Use anti-CSRF tokens
- Implement SameSite cookies
- Validate request origins

## Additional Measures

- HTTPS everywhere
- Security headers
- Regular dependency updates
    `.trim(),
      excerpt:
        "Learn how to protect your web applications from XSS, CSRF, and other common security threats.",
      coverImage:
        "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800",
      status: "published",
      authorIdx: 3,
      likeCount: 39,
      commentCount: 8,
      viewCount: 1450,
      publishedAt: new Date("2024-04-01"),
      tagIdxs: [13, 7],
    },
    {
      title: "Building a REST API with Next.js Route Handlers",
      slug: "building-rest-api-nextjs-route-handlers",
      content: `
# Building a REST API with Next.js Route Handlers

Next.js Route Handlers provide a powerful way to build API endpoints.

## Basic Route Handler

\`\`\`typescript
// app/api/posts/route.ts
export async function GET(request: Request) {
  const posts = await db.query.posts.findMany();
  return Response.json(posts);
}
\`\`\`

## CRUD Operations

Implement Create, Read, Update, and Delete endpoints with proper validation.

## Middleware

Add authentication, rate limiting, and logging middleware to your API routes.
    `.trim(),
      excerpt:
        "Learn how to build a complete REST API using Next.js 14 Route Handlers and Drizzle ORM.",
      coverImage:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
      status: "published",
      authorIdx: 0,
      likeCount: 36,
      commentCount: 6,
      viewCount: 1200,
      publishedAt: new Date("2024-04-05"),
      tagIdxs: [1, 2, 4],
    },
    {
      title: "Introduction to WebSockets with Node.js",
      slug: "introduction-to-websockets-nodejs",
      content: `
# Introduction to WebSockets with Node.js

WebSockets enable real-time bidirectional communication between client and server.

## What are WebSockets?

Unlike HTTP, WebSockets maintain a persistent connection for real-time data exchange.

## Setting Up Socket.io

\`\`\`javascript
import { Server } from "socket.io";
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("Client connected");
});
\`\`\`

## Use Cases

- Chat applications
- Live notifications
- Real-time collaboration
- Live data feeds
    `.trim(),
      excerpt:
        "Build real-time applications with WebSockets and Socket.io in Node.js.",
      coverImage:
        "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
      status: "published",
      authorIdx: 4,
      likeCount: 31,
      commentCount: 5,
      viewCount: 920,
      publishedAt: new Date("2024-04-10"),
      tagIdxs: [6, 7],
    },
    {
      title: "State Management in React: Zustand vs Redux",
      slug: "state-management-zustand-vs-redux",
      content: `
# State Management in React: Zustand vs Redux

Compare two popular state management solutions for React applications.

## Zustand

- Minimal boilerplate
- Simple API
- Built-in TypeScript support
- No context provider needed

## Redux Toolkit

- Predictable state updates
- Middleware support
- DevTools integration
- Large ecosystem

## When to Use What

Choose Zustand for simpler apps and Redux for complex state requirements.
    `.trim(),
      excerpt:
        "A comparison of Zustand and Redux Toolkit for state management in modern React applications.",
      coverImage:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
      status: "published",
      authorIdx: 2,
      likeCount: 25,
      commentCount: 8,
      viewCount: 780,
      publishedAt: new Date("2024-04-15"),
      tagIdxs: [0, 7],
    },
    {
      title: "Database Migration Strategies for Production",
      slug: "database-migration-strategies-production",
      content: `
# Database Migration Strategies for Production

Running database migrations in production requires careful planning.

## Types of Migrations

- Schema changes (add/remove columns)
- Data migrations (transform existing data)
- Index changes

## Zero-Downtime Migrations

- Expand-contract pattern
- Backward-compatible changes
- Feature flags for rollouts

## Rollback Strategies

Always test your rollback plan before running migrations.
    `.trim(),
      excerpt:
        "Learn safe and reliable database migration strategies for production environments.",
      coverImage:
        "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800",
      status: "published",
      authorIdx: 1,
      likeCount: 44,
      commentCount: 11,
      viewCount: 1680,
      publishedAt: new Date("2024-04-20"),
      tagIdxs: [3, 4, 9],
    },
    {
      title: "Animating with Framer Motion: A Complete Guide",
      slug: "animating-with-framer-motion-guide",
      content: `
# Animating with Framer Motion: A Complete Guide

Framer Motion makes declarative animations in React simple and powerful.

## Basic Animations

\`\`\`tsx
<motion.div
  animate={{ x: 100 }}
  transition={{ duration: 0.5 }}
>
  Hello
</motion.div>
\`\`\`

## Gesture Animations

Add drag, hover, and tap interactions to your components.

## Layout Animations

Animate between different layouts with AnimatePresence.
    `.trim(),
      excerpt:
        "A comprehensive guide to creating smooth animations in React with Framer Motion.",
      coverImage:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
      status: "published",
      authorIdx: 2,
      likeCount: 53,
      commentCount: 12,
      viewCount: 2040,
      publishedAt: new Date("2024-04-25"),
      tagIdxs: [0, 7],
    },
    {
      title: "Microservices Architecture with Node.js",
      slug: "microservices-architecture-nodejs",
      content: `
# Microservices Architecture with Node.js

Break down your monolith into scalable microservices.

## Why Microservices?

- Independent deployment
- Scalability per service
- Technology diversity
- Team autonomy

## Communication Patterns

- REST APIs for synchronous communication
- Message queues for async communication
- Event-driven architecture

## Challenges

- Distributed tracing
- Data consistency
- Network latency
    `.trim(),
      excerpt:
        "Design and implement microservices architecture using Node.js and message queues.",
      coverImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      status: "published",
      authorIdx: 3,
      likeCount: 37,
      commentCount: 6,
      viewCount: 1340,
      publishedAt: new Date("2024-05-01"),
      tagIdxs: [6, 9],
    },
    {
      title: "TypeScript Utility Types You Should Know",
      slug: "typescript-utility-types-you-should-know",
      content: `
# TypeScript Utility Types You Should Know

TypeScript provides powerful built-in utility types that every developer should master.

## Partial<T>

Make all properties optional.

\`\`\`typescript
type PartialUser = Partial<User>;
\`\`\`

## Pick<T, K>

Select specific properties from a type.

## Omit<T, K>

Exclude specific properties from a type.

## Record<K, T>

Create an object type with specific keys and value types.
    `.trim(),
      excerpt:
        "Master essential TypeScript utility types like Partial, Pick, Omit, and Record.",
      coverImage:
        "https://images.unsplash.com/photo-1515879218367-8466d910auj9?w=800",
      status: "published",
      authorIdx: 0,
      likeCount: 41,
      commentCount: 7,
      viewCount: 1520,
      publishedAt: new Date("2024-05-05"),
      tagIdxs: [2],
    },
    {
      title: "CI/CD Pipelines with GitHub Actions",
      slug: "cicd-pipelines-github-actions",
      content: `
# CI/CD Pipelines with GitHub Actions

Automate your development workflow with GitHub Actions.

## Basic Workflow

\`\`\`yaml
name: CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
\`\`\`

## Advanced Features

- Matrix builds
- Caching dependencies
- Environment secrets
- Deployment workflows

## Best Practices

Keep workflows efficient and secure.
    `.trim(),
      excerpt:
        "Set up automated CI/CD pipelines for your projects using GitHub Actions.",
      coverImage:
        "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800",
      status: "published",
      authorIdx: 3,
      likeCount: 30,
      commentCount: 5,
      viewCount: 1050,
      publishedAt: new Date("2024-05-10"),
      tagIdxs: [9, 12],
    },
    {
      title: "Optimizing Next.js Bundle Size",
      slug: "optimizing-nextjs-bundle-size",
      content: `
# Optimizing Next.js Bundle Size

Reduce your Next.js application bundle size for better performance.

## Bundle Analysis

Use @next/bundle-analyzer to understand what's in your bundles.

## Code Splitting

- Dynamic imports for large components
- Lazy loading routes
- Splitting vendor chunks

## Image Optimization

- Use next/image for automatic optimization
- Properly size images
- Use WebP format

## Tree Shaking

Remove unused exports from your bundle.
    `.trim(),
      excerpt:
        "Techniques and tools to optimize your Next.js application bundle size for faster loads.",
      coverImage:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      status: "published",
      authorIdx: 0,
      likeCount: 47,
      commentCount: 9,
      viewCount: 1750,
      publishedAt: new Date("2024-05-15"),
      tagIdxs: [1, 12, 2],
    },
    {
      title: "JWT Authentication: Complete Implementation Guide",
      slug: "jwt-authentication-complete-guide",
      content: `
# JWT Authentication: Complete Implementation Guide

Implement secure JWT-based authentication in your web applications.

## How JWT Works

JSON Web Tokens consist of a header, payload, and signature.

## Implementation

\`\`\`typescript
import jwt from "jsonwebtoken";
const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "7d" });
\`\`\`

## Best Practices

- Store tokens securely (httpOnly cookies)
- Implement refresh tokens
- Validate tokens on every request
- Use short expiration times
    `.trim(),
      excerpt:
        "Complete guide to implementing secure JWT authentication in Next.js applications.",
      coverImage:
        "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800",
      status: "published",
      authorIdx: 1,
      likeCount: 58,
      commentCount: 14,
      viewCount: 2300,
      publishedAt: new Date("2024-05-20"),
      tagIdxs: [13, 6],
    },
    {
      title: "Accessibility in React: A Practical Guide",
      slug: "accessibility-in-react-practical-guide",
      content: `
# Accessibility in React: A Practical Guide

Make your React applications accessible to everyone.

## Semantic HTML

Use proper HTML elements: nav, main, aside, button, etc.

## ARIA Attributes

Add ARIA labels and roles when necessary.

## Keyboard Navigation

Ensure all interactive elements are keyboard accessible.

## Testing Accessibility

- Use axe-core for automated testing
- Manual testing with screen readers
- Color contrast validation
    `.trim(),
      excerpt:
        "Practical techniques for building accessible React applications that work for everyone.",
      coverImage:
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800",
      status: "published",
      authorIdx: 2,
      likeCount: 35,
      commentCount: 6,
      viewCount: 980,
      publishedAt: new Date("2024-05-25"),
      tagIdxs: [0, 11, 7],
    },
    {
      title: "Redis Caching Strategies for Node.js",
      slug: "redis-caching-strategies-nodejs",
      content: `
# Redis Caching Strategies for Node.js

Improve your application performance with Redis caching.

## Why Redis?

- In-memory data store
- Sub-millisecond latency
- Rich data structures

## Caching Patterns

- Cache-aside (lazy loading)
- Write-through cache
- Cache invalidation strategies

## Implementation

\`\`\`typescript
const cache = await redis.get(\`post:\${id}\`);
if (cache) return JSON.parse(cache);
const post = await db.query.posts.findFirst();
await redis.set(\`post:\${id}\`, JSON.stringify(post));
\`\`\`
    `.trim(),
      excerpt:
        "Learn Redis caching strategies to supercharge your Node.js application performance.",
      coverImage:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
      status: "published",
      authorIdx: 4,
      likeCount: 40,
      commentCount: 7,
      viewCount: 1380,
      publishedAt: new Date("2024-06-01"),
      tagIdxs: [6, 12],
    },
    {
      title: "Responsive Design Patterns in 2024",
      slug: "responsive-design-patterns-2024",
      content: `
# Responsive Design Patterns in 2024

Modern responsive design goes beyond media queries.

## Container Queries

Style elements based on their container's size, not the viewport.

\`\`\`css
@container (min-width: 400px) {
  .card { flex-direction: row; }
}
\`\`\`

## Modern CSS Features

- clamp() for fluid typography
- Grid for flexible layouts
- aspect-ratio for consistent media

## Mobile-First Approach

Start with mobile styles and progressively enhance.
    `.trim(),
      excerpt:
        "Modern responsive design patterns using container queries, CSS Grid, and fluid typography.",
      coverImage:
        "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=800",
      status: "published",
      authorIdx: 2,
      likeCount: 28,
      commentCount: 5,
      viewCount: 820,
      publishedAt: new Date("2024-06-05"),
      tagIdxs: [10, 5],
    },
    {
      title: "Error Handling Patterns in Node.js",
      slug: "error-handling-patterns-nodejs",
      content: `
# Error Handling Patterns in Node.js

Robust error handling is crucial for production Node.js applications.

## Try-Catch with Async/Await

\`\`\`typescript
try {
  const data = await riskyOperation();
} catch (error) {
  console.error("Operation failed:", error);
}
\`\`\`

## Custom Error Classes

Create meaningful error types for different scenarios.

## Global Error Handlers

Implement Express error middleware and process-level handlers.

## Logging and Monitoring

Use structured logging to track errors in production.
    `.trim(),
      excerpt:
        "Error handling patterns and best practices for building robust Node.js applications.",
      coverImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      status: "published",
      authorIdx: 4,
      likeCount: 32,
      commentCount: 6,
      viewCount: 1100,
      publishedAt: new Date("2024-06-10"),
      tagIdxs: [6],
    },
    {
      title: "Shadcn UI: Building Beautiful Components",
      slug: "shadcn-ui-building-beautiful-components",
      content: `
# Shadcn UI: Building Beautiful Components

Shadcn UI is a collection of beautifully designed React components.

## What Makes Shadcn Different?

- Not a component library — it's copy-paste
- Fully customizable with Tailwind
- Radix UI primitives for accessibility

## Getting Started

\`\`\`bash
npx shadcn-ui@latest init
\`\`\`

## Customization

Every component can be modified to match your design system.
    `.trim(),
      excerpt:
        "Discover how to build beautiful, accessible UI components with Shadcn UI and Radix.",
      coverImage:
        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800",
      status: "published",
      authorIdx: 0,
      likeCount: 55,
      commentCount: 13,
      viewCount: 2150,
      publishedAt: new Date("2024-06-15"),
      tagIdxs: [0, 5, 2],
    },
    {
      title: "Monitoring and Observability with OpenTelemetry",
      slug: "monitoring-observability-opentelemetry",
      content: `
# Monitoring and Observability with OpenTelemetry

Implement observability in your Node.js applications with OpenTelemetry.

## The Three Pillars

- Tracing: Track request flow across services
- Metrics: Measure application performance
- Logging: Record events and errors

## Getting Started

\`\`\`typescript
import { NodeSDK } from "@opentelemetry/sdk-node";
const sdk = new NodeSDK({ /* config */ });
sdk.start();
\`\`\`

## Best Practices

- Add context to spans
- Export to your observability backend
- Monitor key business metrics
    `.trim(),
      excerpt:
        "Implement monitoring and observability in your applications using OpenTelemetry.",
      coverImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      status: "published",
      authorIdx: 3,
      likeCount: 26,
      commentCount: 4,
      viewCount: 720,
      publishedAt: new Date("2024-06-20"),
      tagIdxs: [6, 9],
    },
  ];

  // Insert all posts
  const insertedPosts = await db
    .insert(posts)
    .values(
      postData.map((p) => ({
        title: p.title,
        slug: p.slug,
        content: p.content,
        excerpt: p.excerpt,
        coverImage: p.coverImage,
        status: p.status,
        authorId: users_list[p.authorIdx][0].id,
        likeCount: p.likeCount,
        commentCount: p.commentCount,
        viewCount: p.viewCount,
        createdAt: p.publishedAt,
        publishedAt: p.publishedAt,
      })),
    )
    .returning();

  console.log(`✅ Created ${insertedPosts.length} posts`);

  // ==================== POST_TAGS ====================
  console.log("🔗 Creating post-tag relationships...");
  const postTagValues: { postId: string; tagId: string }[] = [];
  postData.forEach((p, i) => {
    p.tagIdxs.forEach((tIdx) => {
      postTagValues.push({
        postId: insertedPosts[i].id,
        tagId: allTags[tIdx][0].id,
      });
    });
  });
  await db.insert(postTags).values(postTagValues);

  console.log("✅ Created post-tag relationships");

  // ==================== COMMENTS ====================
  console.log("💬 Creating comments...");
  const commentData = [
    // Post 1
    {
      content: "Great article! Really helped me understand Next.js 14 better.",
      postIdx: 0,
      authorIdx: 1,
      likeCount: 5,
    },
    {
      content: "Thanks for sharing this. Server Actions are game changers!",
      postIdx: 0,
      authorIdx: 2,
      likeCount: 3,
    },
    {
      content: "Excellent explanation of the new features!",
      postIdx: 0,
      authorIdx: 3,
      likeCount: 4,
    },
    // Post 2
    {
      content:
        "Very comprehensive guide. Would love to see more on TypeScript patterns.",
      postIdx: 1,
      authorIdx: 0,
      likeCount: 7,
    },
    {
      content: "The generics section was exactly what I needed.",
      postIdx: 1,
      authorIdx: 4,
      likeCount: 2,
    },
    // Post 3
    {
      content:
        "This is exactly what I needed. PostgreSQL indexing tips are gold!",
      postIdx: 2,
      authorIdx: 3,
      likeCount: 12,
    },
    {
      content: "Great write-up on connection pooling!",
      postIdx: 2,
      authorIdx: 0,
      likeCount: 6,
    },
    // Post 4
    {
      content: "Tailwind has completely changed how I write CSS. Great post!",
      postIdx: 3,
      authorIdx: 4,
      likeCount: 4,
    },
    // Post 5
    {
      content: "Good comparison. I prefer Drizzle for its SQL-like syntax.",
      postIdx: 4,
      authorIdx: 1,
      likeCount: 8,
    },
    // Post 6
    {
      content: "Production deployment tips are very useful. Bookmarked!",
      postIdx: 5,
      authorIdx: 2,
      likeCount: 6,
    },
    // Post 7
    {
      content: "Server Components are the future of React!",
      postIdx: 6,
      authorIdx: 1,
      likeCount: 9,
    },
    {
      content: "Finally a clear explanation. Thank you!",
      postIdx: 6,
      authorIdx: 3,
      likeCount: 5,
    },
    // Post 8
    {
      content: "GraphQL has been a game changer for our API.",
      postIdx: 7,
      authorIdx: 0,
      likeCount: 4,
    },
    // Post 9
    {
      content: "Docker made our deployment so much easier.",
      postIdx: 8,
      authorIdx: 2,
      likeCount: 3,
    },
    // Post 10
    {
      content: "Custom hooks are incredibly powerful. Great examples!",
      postIdx: 9,
      authorIdx: 0,
      likeCount: 7,
    },
    {
      content: "The useDebounce hook is a must-have.",
      postIdx: 9,
      authorIdx: 1,
      likeCount: 5,
    },
    // Post 11
    {
      content: "Performance tuning saved us thousands in infrastructure costs.",
      postIdx: 10,
      authorIdx: 3,
      likeCount: 11,
    },
    // Post 12
    {
      content: "This clarified the grid vs flexbox debate for me!",
      postIdx: 11,
      authorIdx: 0,
      likeCount: 6,
    },
    // Post 13
    {
      content: "Vitest is so fast compared to Jest!",
      postIdx: 12,
      authorIdx: 4,
      likeCount: 4,
    },
    // Post 14
    {
      content: "Security should always be a top priority. Great tips!",
      postIdx: 13,
      authorIdx: 0,
      likeCount: 8,
    },
    // Post 15
    {
      content: "Next.js route handlers are incredibly clean.",
      postIdx: 14,
      authorIdx: 1,
      likeCount: 5,
    },
    // Post 16
    {
      content: "WebSockets opened up so many possibilities for our app.",
      postIdx: 15,
      authorIdx: 3,
      likeCount: 3,
    },
    // Post 17
    {
      content: "Zustand's simplicity is unbeatable for most projects.",
      postIdx: 16,
      authorIdx: 0,
      likeCount: 6,
    },
    // Post 18
    {
      content: "Expand-contract pattern saved us during a complex migration.",
      postIdx: 17,
      authorIdx: 2,
      likeCount: 7,
    },
    // Post 19
    {
      content: "Framer Motion makes animations so declarative and fun!",
      postIdx: 18,
      authorIdx: 0,
      likeCount: 9,
    },
    {
      content: "The layout animations section was super helpful.",
      postIdx: 18,
      authorIdx: 4,
      likeCount: 4,
    },
    // Post 20
    {
      content: "Microservices are not for every project, but when needed...",
      postIdx: 19,
      authorIdx: 1,
      likeCount: 5,
    },
    // Post 21
    {
      content: "I use Pick and Omit daily. Essential utility types!",
      postIdx: 20,
      authorIdx: 1,
      likeCount: 6,
    },
    // Post 22
    {
      content: "GitHub Actions simplified our CI/CD immensely.",
      postIdx: 21,
      authorIdx: 0,
      likeCount: 4,
    },
    // Post 23
    {
      content: "Bundle size optimization is crucial for Core Web Vitals.",
      postIdx: 22,
      authorIdx: 2,
      likeCount: 7,
    },
    // Post 24
    {
      content: "JWT with httpOnly cookies is the way to go.",
      postIdx: 23,
      authorIdx: 0,
      likeCount: 10,
    },
    {
      content: "Refresh token implementation was exactly what I needed.",
      postIdx: 23,
      authorIdx: 3,
      likeCount: 6,
    },
    // Post 25
    {
      content: "Accessibility is not optional. Great practical guide!",
      postIdx: 24,
      authorIdx: 1,
      likeCount: 5,
    },
    // Post 26
    {
      content: "Redis caching reduced our API response times significantly.",
      postIdx: 25,
      authorIdx: 0,
      likeCount: 8,
    },
    // Post 27
    {
      content: "Container queries are finally here! Great overview.",
      postIdx: 26,
      authorIdx: 1,
      likeCount: 4,
    },
    // Post 28
    {
      content: "Structured error logging saved us hours of debugging.",
      postIdx: 27,
      authorIdx: 2,
      likeCount: 3,
    },
    // Post 29
    {
      content: "Shadcn UI is my go-to for new projects now.",
      postIdx: 28,
      authorIdx: 2,
      likeCount: 9,
    },
    {
      content: "The customization is unmatched compared to other libraries.",
      postIdx: 28,
      authorIdx: 4,
      likeCount: 5,
    },
    // Post 30
    {
      content: "OpenTelemetry made our microservices observable.",
      postIdx: 29,
      authorIdx: 0,
      likeCount: 4,
    },
  ];

  await db.insert(comments).values(
    commentData.map((c) => ({
      content: c.content,
      postId: insertedPosts[c.postIdx].id,
      authorId: users_list[c.authorIdx][0].id,
      likeCount: c.likeCount,
    })),
  );

  console.log("✅ Created comments");

  // ==================== LIKES ====================
  console.log("❤️  Creating likes...");
  const likeValues: { userId: string; postId: string }[] = [];
  // Generate likes: each user likes random posts
  const likedPairs = new Set<string>();
  for (let pi = 0; pi < insertedPosts.length; pi++) {
    const numLikes = Math.min(3, Math.floor(Math.random() * 3) + 1);
    const shuffled = [...users_list]
      .sort(() => Math.random() - 0.5)
      .slice(0, numLikes);
    for (const u of shuffled) {
      const key = `${u[0].id}-${insertedPosts[pi].id}`;
      if (!likedPairs.has(key)) {
        likedPairs.add(key);
        likeValues.push({ userId: u[0].id, postId: insertedPosts[pi].id });
      }
    }
  }
  await db.insert(likes).values(likeValues);

  console.log("✅ Created likes");

  // ==================== BOOKMARKS ====================
  console.log("🔖 Creating bookmarks...");
  const bookmarkValues: { userId: string; postId: string }[] = [];
  const bookmarkedPairs = new Set<string>();
  for (let pi = 0; pi < Math.min(15, insertedPosts.length); pi++) {
    const user = users_list[pi % users_list.length];
    const key = `${user[0].id}-${insertedPosts[pi].id}`;
    if (!bookmarkedPairs.has(key)) {
      bookmarkedPairs.add(key);
      bookmarkValues.push({ userId: user[0].id, postId: insertedPosts[pi].id });
    }
  }
  await db.insert(bookmarks).values(bookmarkValues);

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
      postId: insertedPosts[0].id,
      isRead: false,
    },
    {
      userId: user1[0].id,
      type: "like",
      title: "New Like",
      message: "Charlie Brown liked your post",
      actorId: user3[0].id,
      postId: insertedPosts[0].id,
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
      postId: insertedPosts[1].id,
      isRead: false,
    },
  ]);

  console.log("✅ Created notifications");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📊 Summary:");
  console.log("   - 5 users created");
  console.log("   - 14 tags created");
  console.log("   - 30 posts created");
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
