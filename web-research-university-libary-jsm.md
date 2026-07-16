# Web Research: University Library Management System (JSM)

**Tech Stack:** PostgreSQL, Node, React, Next.js, Neon, Redis, TypeScript, Drizzle, Tailwind  
**Generated:** 2026-07-16  
**Project:** `university-libary-jsm`

---

## Table of Contents

1. [Project Structure & Architecture](#1-project-structure--architecture)
2. [Drizzle ORM Best Practices](#2-drizzle-orm-best-practices)
3. [Neon (Serverless PostgreSQL) Best Practices](#3-neon-serverless-postgresql-best-practices)
4. [Next.js 15+ App Router Patterns](#4-nextjs-15-app-router-patterns)
5. [Redis Caching with Next.js](#5-redis-caching-with-nextjs)
6. [TypeScript Patterns & Tips](#6-typescript-patterns--tips)
7. [Tailwind CSS & UI Patterns](#7-tailwind-css--ui-patterns)
8. [Library Management System — Schema Design](#8-library-management-system--schema-design)
9. [Security Considerations](#9-security-considerations)
10. [Performance Optimization](#10-performance-optimization)
11. [Common Pitfalls & How to Avoid Them](#11-common-pitfalls--how-to-avoid-them)
12. [Similar Open-Source Projects](#12-similar-open-source-projects)
13. [Deployment Checklist](#13-deployment-checklist)
14. [Sources](#14-sources)

---

## 1. Project Structure & Architecture

### Recommended Folder Layout (Next.js App Router + Drizzle)

```
university-libary-jsm/
├── .env.local                    # Environment variables (Neon URL, Redis URL, etc.)
├── .gitignore
├── drizzle.config.ts             # Drizzle Kit configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json
├── package.json
├── migrations/                   # Auto-generated Drizzle migration files
│   ├── meta/
│   │   └── _journal.json        # Migration journal (DO NOT manually edit)
│   └── 0000_*.sql               # Generated SQL migrations
├── public/                       # Static assets
├── src/
│   ├── app/                      # Next.js App Router (routes only — keep thin)
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   ├── (auth)/               # Auth route group
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/          # Dashboard route group
│   │   │   ├── layout.tsx        # Dashboard layout (sidebar, header)
│   │   │   ├── page.tsx          # Dashboard home
│   │   │   ├── books/
│   │   │   │   ├── page.tsx       # Book listing
│   │   │   │   ├── [id]/page.tsx  # Book detail
│   │   │   │   └── new/page.tsx   # Add book
│   │   │   ├── members/
│   │   │   └── loans/
│   │   ├── api/                   # Route Handlers (if needed)
│   │   ├── global-error.tsx
│   │   ├── global-not-found.tsx
│   │   └── favicon.ico
│   ├── components/                # Shared UI components
│   │   ├── ui/                    # shadcn/ui components or primitives
│   │   ├── layout/                # Header, Sidebar, Footer
│   │   └── forms/                 # Form components (react-hook-form wrappers)
│   ├── db/                        # Database layer
│   │   ├── index.ts               # Drizzle client initialization
│   │   ├── schema/                # Drizzle table definitions
│   │   │   ├── books.ts
│   │   │   ├── members.ts
│   │   │   ├── loans.ts
│   │   │   └── users.ts
│   │   └── queries/               # Reusable query functions
│   │       ├── books.queries.ts
│   │       ├── members.queries.ts
│   │       └── loans.queries.ts
│   ├── features/                  # Domain-specific feature modules
│   │   ├── auth/
│   │   ├── books/
│   │   ├── members/
│   │   └── loans/
│   ├── lib/                       # Utilities, helpers, config
│   │   ├── redis.ts               # Redis client (Upstash/node-redis)
│   │   ├── utils.ts               # Shared utilities
│   │   └── constants.ts
│   ├── types/                     # Shared TypeScript types
│   └── actions/                   # Next.js Server Actions
│       ├── books.actions.ts
│       ├── members.actions.ts
│       └── loans.actions.ts
└── __tests__/                     # Test files
```

**Key principles:**
- Keep `app/` directory **routing-only** — put business logic in `features/` or `db/queries/`
- Use `src/` directory for cleaner separation from config files
- Colocate related files (schema, queries, types) near feature modules
- Server Actions go in `actions/` — they can be imported by both Server and Client Components

### Reference
- [Next.js Official: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [DEV: Best Practices for Organizing Your Next.js 15](https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji)

---

## 2. Drizzle ORM Best Practices

### 2.1 Setup & Configuration

**Installation (for Neon):**
```bash
npm install drizzle-orm @neondatabase/serverless dotenv
npm install -D drizzle-kit tsx
```

**Drizzle config (`drizzle.config.ts`):**
```ts
import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema/*.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

**Database client (`src/db/index.ts`):**
```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

### 2.2 Schema Design

```ts
import { pgTable, serial, text, integer, timestamp, boolean, date, varchar } from "drizzle-orm/pg-core";

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  isbn: varchar("isbn", { length: 13 }).unique(),
  genre: text("genre"),
  publishedYear: integer("published_year"),
  totalCopies: integer("total_copies").notNull().default(1),
  availableCopies: integer("available_copies").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});
```

**Best practices:**
- Use `serial('id').primaryKey()` for auto-incrementing IDs (or UUID with `uuid()`)
- Always add `createdAt`/`updatedAt` timestamps
- Use `$onUpdate(() => new Date())` for auto-updating timestamps
- Define `Insert` and `Select` types at the bottom of each schema file:
  ```ts
  export type NewBook = typeof books.$inferInsert;
  export type Book = typeof books.$inferSelect;
  ```

### 2.3 Relations

```ts
import { relations } from "drizzle-orm";

export const booksRelations = relations(books, ({ many }) => ({
  loans: many(loans),
}));

export const loansRelations = relations(loans, ({ one }) => ({
  book: one(books, {
    fields: [loans.bookId],
    references: [books.id],
  }),
  member: one(members, {
    fields: [loans.memberId],
    references: [members.id],
  }),
}));
```

### 2.4 Query Patterns

**Select specific columns (avoid `select().from()` for performance):**
```ts
const result = await db
  .select({ id: books.id, title: books.title, author: books.author })
  .from(books)
  .where(eq(books.genre, "Fiction"));
```

**Use Drizzle operators for type safety:**
```ts
import { eq, gt, lt, like, and, or, between, count, asc, desc } from "drizzle-orm";

// Good
const result = await db.select().from(books).where(gt(books.publishedYear, 2000));
// Avoid raw SQL unless necessary
const result = await db.select().from(books).where(sql`published_year > 2000`);
```

**Prepared statements for performance:**
```ts
const getBookById = db.select().from(books).where(eq(books.id, sql.placeholder("id"))).prepare("getBookById");
const result = await getBookById.execute({ id: 1 });
```

### 2.5 Migrations

**Commands:**
```bash
npx drizzle-kit generate    # Generate SQL migration from schema changes
npx drizzle-kit migrate     # Apply migrations to database
npx drizzle-kit push        # Direct push (dev only — bypasses migration files)
npx drizzle-kit studio      # Drizzle Studio web UI for data browsing
```

**Migration DOs and DON'Ts:**
- ✅ Use `drizzle-kit generate` + `drizzle-kit migrate` for production
- ✅ Commit migration files and `_journal.json` to version control
- ❌ Never manually edit migration files or `_journal.json`
- ❌ Never change primary key types in production (requires full table rebuild)
- ✅ Use `drizzle-kit push` only in development for rapid prototyping
- ✅ Keep migrations reversible — add columns as nullable first, then populate, then add `NOT NULL`

### Sources
- [Drizzle ORM — Getting Started with Neon](https://orm.drizzle.team/docs/get-started/neon-new)
- [Drizzle ORM — Connect to Neon](https://orm.drizzle.team/docs/connect-neon)
- [Drizzle ORM — Performance Queries](https://orm.drizzle.team/docs/perf-queries)
- [Medium: 3 Biggest Mistakes with Drizzle ORM](https://medium.com/@lior_amsalem/3-biggest-mistakes-with-drizzle-orm-1327e2531aff)

---

## 3. Neon (Serverless PostgreSQL) Best Practices

### 3.1 Connection & Drivers

Neon offers two driver options for serverless:

| Driver | Package | Use Case |
|--------|---------|----------|
| HTTP (neon-http) | `@neondatabase/serverless` + `drizzle-orm/neon-http` | Serverless/edge functions (Vercel, Netlify) |
| WebSocket | `@neondatabase/serverless` (ws mode) | Long-lived connections, transactions |
| node-postgres | `pg` + `drizzle-orm/node-postgres` | Traditional Node.js server |

**For Next.js serverless:** Use `neon-http` driver — it speaks PostgreSQL over HTTP, requires no TCP connection pool, and has zero cold starts.

```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

### 3.2 Connection Pooling

- Neon runs PgBouncer internally — use the `-pooler` hostname in your connection string
- The pooler connection string looks like: `postgresql://user:password@[project]-pooler.neon.tech/dbname?sslmode=require`
- Without pooling, each serverless function invocation creates a new connection — pooler reuses existing ones

### 3.3 Neon Branching (Ephemeral Environments)

Neon supports database branching — create a branch per PR/feature for isolated development:

```bash
# Via Neon CLI
neon branches create --name feature/new-schema
```

- Each branch has its own connection string
- Use for preview deployments and testing schema changes
- Branches share storage — only data changes consume space

### 3.4 Cold Start & Scale-to-Zero

- Neon suspends compute after 5 minutes of inactivity (free tier)
- First request after idle triggers a ~500ms cold start
- **Mitigation:** Use the `neon-http` driver (no TCP handshake) + keep a warm connection via pings
- Paid plans allow configuring scale-to-zero behavior

### 3.5 Pricing Tips

- Free tier: 512 MB storage, 100 hours compute/month
- Monitor compute hours — suspend branches not in use
- Use Neon's autoscaling to handle traffic spikes without over-provisioning

### Sources
- [Neon Docs: Connect from Drizzle](https://neon.com/docs/guides/drizzle)
- [Neon Docs: Serverless Driver](https://neon.com/docs/serverless/serverless-driver)
- [Fullstack Recipes: Neon + Drizzle Setup](https://fullstackrecipes.com/recipes/neon-drizzle-setup)

---

## 4. Next.js 15+ App Router Patterns

### 4.1 Server Components by Default

- All components are Server Components unless marked with `"use client"`
- Fetch data directly in Server Components — no need for `useEffect` or SWR for initial data
- Keep Client Components minimal (interactivity only)

```tsx
// app/(dashboard)/books/page.tsx — Server Component
import { getBooks } from "@/db/queries/books.queries";

export default async function BooksPage() {
  const books = await getBooks();
  return <BookList books={books} />;
}
```

### 4.2 Server Actions for Mutations

```ts
// src/actions/books.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { books } from "@/db/schema/books";

export async function addBook(formData: FormData) {
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  // Validate with Zod...

  await db.insert(books).values({ title, author });
  revalidatePath("/books");
}
```

### 4.3 Data Fetching Patterns

- **Parallel fetching** to avoid waterfalls:
  ```tsx
  const [books, members] = await Promise.all([getBooks(), getMembers()]);
  ```
- **Streaming** with Suspense boundaries for progressive rendering
- **Static/Dynamic rendering:** Use `force-dynamic` or `revalidate` on routes with live data
- **Route Handlers** for external API consumption; avoid calling them from Server Components

### 4.4 Form Validation with Zod

```ts
import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().length(13).optional(),
  totalCopies: z.coerce.number().int().positive().default(1),
});

// Use with drizzle-zod for DB-validated forms
import { createInsertSchema } from "drizzle-zod";
import { books } from "@/db/schema/books";
export const insertBookSchema = createInsertSchema(books);
```

### 4.5 Production Checklist

From Next.js official production guide:
- Use layouts for shared UI and partial rendering
- Graceful error handling with `error.tsx` and `global-error.tsx`
- Global 404 with `not-found.tsx`
- Font optimization with `next/font`
- Image optimization with `next/image` (automatic WebP, lazy loading)
- Prefetching via `<Link>` component

### Sources
- [Next.js Official: Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Next.js Official: Data Fetching](https://nextjs.org/docs/app/getting-started/fetching-data)
- [Noqta: Full-Stack App with Drizzle ORM and Next.js 15](https://noqta.tn/en/tutorials/drizzle-orm-nextjs-fullstack-database-2026)

---

## 5. Redis Caching with Next.js

### 5.1 Why Redis for a Library System

| Use Case | Description | Cache Pattern |
|----------|-------------|---------------|
| Book catalog | Frequently browsed, rarely changes | Cache-aside with TTL |
| User sessions | Auth tokens, borrow history | Write-through with TTL |
| Rate limiting | Prevent API abuse | Sliding window counter |
| Search results | Cached book search queries | Cache-aside with invalidation on new books |
| Popular books | Aggregated or computed rankings | Scheduled refresh |

### 5.2 Upstash Redis Setup (Serverless-Optimized)

```bash
npm install @upstash/redis @upstash/ratelimit
```

```ts
// src/lib/redis.ts
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache-aside helper
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600 // 1 hour default
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached) return cached;
  const fresh = await fetcher();
  await redis.setex(key, ttl, fresh);
  return fresh;
}
```

### 5.3 Caching Patterns

**Cache-Aside (Lazy Loading):**
- Data fetched from cache first; on miss, fetch from DB and populate cache
- Best for read-heavy, write-light data (book catalog)

**Write-Through:**
- Update database, then immediately update/delete cache
- Best for data that must be consistent (loan status, member info)

**Cache Invalidation strategies:**
- **TTL-based:** Set expiration time — simplest, eventual consistency
- **Manual invalidation:** `await redis.del("books:all")` after a mutation
- **Tag-based:** Use `revalidateTag()` in Next.js alongside Redis

### 5.4 Rate Limiting with Upstash

```ts
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
});

export async function rateLimit(identifier: string) {
  const { success, limit, remaining } = await ratelimit.limit(identifier);
  return { success, limit, remaining };
}
```

### 5.5 Performance Impact

- Database query: 50–300ms
- Redis cache hit: **1–2ms** (100x+ faster)
- Ideal cache hit rate: 80%+

### Sources
- [Digital Applied: Redis Caching Strategies, Next.js Production Guide 2025](https://www.digitalapplied.com/blog/redis-caching-strategies-nextjs-production)
- [Upstash Redis Documentation](https://upstash.com/docs/redis/overall/getstarted)
- [AWS Whitepaper: Database Caching Strategies Using Redis](https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html)

---

## 6. TypeScript Patterns & Tips

### 6.1 Drizzle Type Inference

Always export inferred types from your schema:

```ts
// Good
export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;
```

Use `drizzle-zod` for runtime validation that stays in sync with your schema:

```ts
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const insertBookSchema = createInsertSchema(books);
export const selectBookSchema = createSelectSchema(books);
```

### 6.2 Strict TypeScript Config

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": false,
    "moduleResolution": "bundler",
    "module": "esnext",
    "target": "es2017",
    "jsx": "preserve",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 6.3 Action Return Types

```ts
// Define a Result type for Server Actions
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function addBook(formData: FormData): Promise<ActionResult<Book>> {
  // ...
}
```

---

## 7. Tailwind CSS & UI Patterns

### 7.1 Tailwind Setup

Tailwind is built into `create-next-app` — no additional setup needed beyond:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { /* library-brand colors */ },
        accent: { /* ... */ },
      },
    },
  },
  plugins: [],
};
export default config;
```

### 7.2 Recommended UI Libraries (for Library App)

| Library | Why | Notes |
|---------|-----|-------|
| **shadcn/ui** | Copy-paste components, Tailwind-native, accessible | Best for most projects |
| **Radix UI** | Headless, accessible primitives | Underpins shadcn/ui |
| **daisyUI** | Pre-built Tailwind components | Faster prototyping |
| **HeroUI (NextUI)** | Full component library | Beautiful defaults |

### 7.3 Responsive Layout Patterns for Library App

```tsx
// Admin layout with sidebar
<div className="min-h-screen grid grid-cols-1 md:grid-cols-[250px_1fr]">
  <aside className="hidden md:block bg-slate-100 p-4">
    {/* Sidebar */}
  </aside>
  <main className="p-4 md:p-8">
    {children}
  </main>
</div>
```

### 7.4 Table & List Patterns

For library management, tables are central:
- Use responsive tables with horizontal scroll on mobile
- Add search/filter controls above the table
- Use `shadcn/ui` Table component for consistency

---

## 8. Library Management System — Schema Design

### 8.1 Core Entities

```ts
// Members/Users
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  membershipType: text("membership_type").default("student"), // student, faculty, staff
  maxBooks: integer("max_books").default(5),
  joinDate: date("join_date").notNull().defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Books
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  isbn: varchar("isbn", { length: 13 }).unique(),
  genre: text("genre"),
  description: text("description"),
  publishedYear: integer("published_year"),
  publisher: text("publisher"),
  totalCopies: integer("total_copies").notNull().default(1),
  availableCopies: integer("available_copies").notNull().default(1),
  shelfLocation: text("shelf_location"),
  coverImageUrl: text("cover_image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
});

// Loans
export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  memberId: integer("member_id").notNull().references(() => members.id, { onDelete: "cascade" }),
  borrowedDate: timestamp("borrowed_date").notNull().defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  returnedDate: timestamp("returned_date"),
  status: text("status").default("active"), // active, returned, overdue, lost
  renewedCount: integer("renewed_count").default(0),
  notes: text("notes"),
});

// Fines (optional — if library charges late fees)
export const fines = pgTable("fines", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id").notNull().references(() => loans.id, { onDelete: "cascade" }),
  memberId: integer("member_id").notNull().references(() => members.id),
  amount: integer("amount").notNull(), // in cents
  reason: text("reason"),
  status: text("status").default("unpaid"), // unpaid, paid, waived
  createdAt: timestamp("created_at").notNull().defaultNow(),
  paidAt: timestamp("paid_at"),
});
```

### 8.2 Indexes for Performance

```ts
import { index } from "drizzle-orm/pg-core";

export const books = pgTable("books", {
  // ... columns
}, (table) => ({
  isbnIdx: index("isbn_idx").on(table.isbn),
  genreIdx: index("genre_idx").on(table.genre),
  authorIdx: index("author_idx").on(table.author),
  titleSearchIdx: index("title_search_idx").on(table.title), // consider gin/trgm for full-text
}));
```

### 8.3 Key Constraints

- `availableCopies <= totalCopies` — enforce at application level
- `dueDate > borrowedDate` — use Zod validation
- `returnedDate >= borrowedDate` — handle in business logic
- Unique ISBN unless multiple copies (then use separate barcodes per copy)
- Cascade delete from members/books should cascade to loans (or handle with soft-delete)

### Sources
- [PostgreSQL Library Management Schema Guide](https://medium.com/@vijaygadhave2014/library-management-a-postgresql-guide-84189297a984)
- [GitHub: Library Management System Database Project](https://github.com/RaghadHanon/Library-Management-System-Database-Project)

---

## 9. Security Considerations

### 9.1 SQL Injection

- Drizzle ORM's query builder uses parameterized queries by default — safe from injection
- **⚠️ CVE-2026-39356:** Versions prior to 0.45.2 / 1.0.0-beta.20 had SQL injection via improperly escaped identifiers in `sql.identifier()` and `.as()`. **Update to the latest version.**
- Avoid raw SQL with string interpolation — use `sql.placeholder()` for dynamic values
- Never pass user input directly to `sql.identifier()` without validation

### 9.2 Authentication

Recommended auth libraries for Next.js + Drizzle:
- **NextAuth.js (Auth.js):** Official Drizzle adapter — `@auth/drizzle-adapter`
- **Better Auth:** TypeScript-first, self-hosted, supports MFA and OAuth
- **Kinde:** Third-party auth service (works in the Dave Gray Next.js tutorial)

```bash
npm install next-auth @auth/drizzle-adapter
```

Auth.js Drizzle adapter handles sessions, verification tokens, and accounts automatically.

### 9.3 Input Validation

- Use **Zod** + **drizzle-zod** for runtime validation of all form inputs
- Validate in Server Actions before touching the database
- Never trust client-side validation alone

### 9.4 Environment Variables

- Store sensitive values in `.env.local` (never committed)
- Required variables:
  - `DATABASE_URL` (Neon connection string)
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
  - `AUTH_SECRET` (for NextAuth)
  - `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` (if using OAuth)

### 9.5 Rate Limiting

- Use Upstash Ratelimit to prevent brute force on login endpoints
- Implement in Next.js Middleware for edge-level protection
- Set different limits for auth vs. data endpoints

### Sources
- [GitHub Security Advisory: Drizzle ORM CVE-2026-39356](https://github.com/drizzle-team/drizzle-orm/security/advisories/GHSA-gpj5-g38j-94v9)
- [Auth.js: Drizzle Adapter](https://authjs.dev/getting-started/adapters/drizzle)
- [AFINE: SQL Injection in the Age of ORM](https://afine.com/sql-injection-in-the-age-of-orm-risks-mitigations-and-best-practices)

---

## 10. Performance Optimization

### 10.1 Database-Level

- **Indexes:** Add indexes on frequently queried columns (title, author, genre, ISBN, member email)
- **Select specific columns:** Always project only needed columns — `db.select({ title: books.title }).from(books)`
- **Prepared statements:** Use for frequently executed queries
- **Limit + Offset:** Always paginate list queries
- **Materialized views:** For complex aggregations (e.g., most borrowed books)

### 10.2 Application-Level

- **React Server Components:** Data fetching happens on the server — no client waterfalls
- **Streaming:** Wrap slow data fetches in Suspense boundaries
- **ISR (Incremental Static Regeneration):** For public catalog pages that don't change often
- **Dynamic imports:** Load heavy Client Components lazily
- **Bundle analysis:** Use `@next/bundle-analyzer` to find bloat

### 10.3 Redis Caching Strategy

| Data Type | Cache Key Pattern | TTL | Strategy |
|-----------|------------------|-----|----------|
| Book catalog | `books:all` | 5 min | Cache-aside |
| Single book | `book:${id}` | 10 min | Cache-aside |
| Member profile | `member:${id}` | 30 min | Cache-aside |
| Active loans | `loans:active:${memberId}` | 1 min | Write-through |
| Search results | `search:${query}` | 2 min | Cache-aside |
| Rate limit counters | `ratelimit:${ip}` | N/A (sliding window) | Atomic increment |

### 10.4 Next.js Caching

- **Data Cache:** `fetch()` results are cached by default — use `next: { revalidate }` or `cache: 'no-store'` for dynamic data
- **Full Route Cache:** Static routes are built at build time — use `dynamic = 'force-dynamic'` for real-time data
- **Router Cache:** Client-side cache for 30s — use `revalidatePath()` or `revalidateTag()` after mutations

### Sources
- [Drizzle ORM: Performance Queries](https://orm.drizzle.team/docs/perf-queries)
- [Next.js Official: Caching](https://nextjs.org/docs/app/getting-started/caching)
- [Digital Applied: Redis Caching Next.js](https://www.digitalapplied.com/blog/redis-caching-strategies-nextjs-production)

---

## 11. Common Pitfalls & How to Avoid Them

### 11.1 Drizzle ORM Pitfalls

| Pitfall | Solution |
|---------|----------|
| Manually editing migration history | Never touch `_journal.json` or generated SQL files — use `drizzle-kit generate` |
| Using `select().from()` everywhere | Always specify columns: `select({ id, name }).from(...)` |
| Forgetting indexes | Add `index()` on filtered/sorted columns in the table definition |
| Incorrect relation definitions | Always use `relations()` with proper `fields`/`references` |
| Not using `$inferSelect`/`$inferInsert` | Export types from each schema file for reuse |
| Mixing migration strategies | Pick `generate`+`migrate` (prod) or `push` (dev) — don't mix |
| Using raw SQL instead of operators | Use `eq()`, `gt()`, `like()` for type-safe, injection-proof queries |
| Changing primary key type in production | Requires full table rebuild — plan data migrations carefully |

### 11.2 Next.js Pitfalls

| Pitfall | Solution |
|---------|----------|
| Fetching in Client Components unnecessarily | Fetch in Server Components by default; use Client only for interactivity |
| Not handling loading states | Use `loading.tsx` and Suspense boundaries |
| Calling Route Handlers from Server Components | Import the query function directly instead |
| Over-fetching in Server Actions | Validate inputs, return only needed data |
| Forgetting `"use server"` directive in actions | Server Actions need `"use server"` at top of file or inline |
| Not revalidating after mutations | Always call `revalidatePath()` or `revalidateTag()` after insert/update/delete |

### 11.3 Neon/PostgreSQL Pitfalls

| Pitfall | Solution |
|---------|----------|
| Connection exhaustion in serverless | Use `neon-http` driver (HTTP-based, no TCP connections) or pooler |
| Cold starts after idle periods | Acceptable on free tier; upgrade for production SLAs |
| Forgetting `sslmode=require` in connection string | Always use SSL for Neon connections |
| Not using branching for dev/test | Create Neon branches per feature for isolated testing |

### 11.4 Redis Pitfalls

| Pitfall | Solution |
|---------|----------|
| Storing too much data per key | Keep values small; use compression for large objects |
| No fallback if Redis is down | Always implement fallback to direct DB query |
| Stale data serving | Set appropriate TTLs; use write-through for critical data |
| Using Redis for everything | Only cache read-heavy, write-light data |

### Sources
- [Medium: 3 Biggest Mistakes with Drizzle ORM](https://medium.com/@lior_amsalem/3-biggest-mistakes-with-drizzle-orm-1327e2531aff)
- [LobeHub: Drizzle ORM Pitfalls Skill](https://lobehub.com/zh/skills/aiskillstore-marketplace-pitfalls-drizzle-orm)

---

## 12. Similar Open-Source Projects

| Project | Stack | Features | Source |
|---------|-------|----------|--------|
| **LibraryOS** | Next.js 16, React 19, TypeScript, Supabase, TailwindCSS 4, Stripe | Multi-tenant, role-based access, book tracking, loans, reservations, subscription billing | [GitHub: ChanMeng666/library-os](https://github.com/ChanMeng666/library-os) |
| **Library Management System (GitLab)** | Next.js | Basic book/member management | [GitLab: personal-projects-nextjs](https://gitlab.com/personal-projects-nextjs/library-management-system) |
| **Simple LMS** | Next.js, SQL | Basic CRUD — books, members, borrowing history | [GFG: Build LMS Using Next.js](https://www.geeksforgeeks.org/reactjs/build-a-library-management-system-using-nextjs) |
| **Cal.com** (inspiration) | Next.js, TypeScript, Prisma | Complex scheduling, RBAC — excellent architecture reference | [GitHub: calcom/cal.com](https://github.com/calcom/cal.com) |
| **Rallly** (inspiration) | Next.js, Prisma | Group scheduling — clean UX patterns | [GitHub: lukevella/rallly](https://github.com/lukevella/rallly) |

### Key Takeaways from Similar Projects

1. **LibraryOS** is the most relevant — modern stack (Next.js + TypeScript + Tailwind), multi-tenant, real-time. Replace Supabase with Drizzle + Neon.
2. Role-based access (admin, librarian, member) is a common pattern
3. Loan tracking, reservations, and fine management are core features
4. Clean separation of API/routes from UI components matters for maintainability

---

## 13. Deployment Checklist

### Pre-Deployment

- [ ] Run `drizzle-kit generate` and commit migrations
- [ ] Test migrations on a staging Neon branch
- [ ] Set `NODE_ENV=production`
- [ ] Ensure all environment variables are set in deployment platform
- [ ] Run `next build` locally to catch build errors
- [ ] Check bundle size with `@next/bundle-analyzer`
- [ ] Audit dependencies for vulnerabilities (`npm audit`)

### Security Checklist

- [ ] Drizzle ORM updated to >=0.45.2 (CVE-2026-39356 fix)
- [ ] Input validation with Zod on all Server Actions
- [ ] Rate limiting on auth endpoints
- [ ] HTTPS enforced
- [ ] No secrets in client-side code
- [ ] Proper CORS configuration if using API routes
- [ ] Session management with secure, HTTP-only cookies

### Performance Checklist

- [ ] Database indexes on commonly queried columns
- [ ] Redis cache for catalog and search results
- [ ] Images optimized with `next/image`
- [ ] Fonts optimized with `next/font`
- [ ] Bundle size optimized (dynamic imports, tree shaking)
- [ ] Streaming/Suspense for slow data sources
- [ ] ISR for public catalog pages

### Monitoring

- [ ] Set up error tracking (Sentry)
- [ ] Database query monitoring (Neon dashboard)
- [ ] Redis cache hit rate monitoring
- [ ] Vercel/Next.js analytics
- [ ] Custom health endpoint (`/api/health`)

---

## 14. Sources

| # | Title | URL |
|---|-------|-----|
| 1 | Drizzle ORM — Get Started with Neon | https://orm.drizzle.team/docs/get-started/neon-new |
| 2 | Drizzle ORM — Connect to Neon | https://orm.drizzle.team/docs/connect-neon |
| 3 | Drizzle ORM — Performance Queries | https://orm.drizzle.team/docs/perf-queries |
| 4 | Neon Docs — Connect from Drizzle | https://neon.com/docs/guides/drizzle |
| 5 | Drizzle ORM — Todo App with Neon Postgres | https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon |
| 6 | Drizzle ORM — Drizzle with Neon Postgres | https://orm.drizzle.team/docs/tutorials/drizzle-with-neon |
| 7 | Next.js — Production Checklist | https://nextjs.org/docs/app/guides/production-checklist |
| 8 | Next.js — Project Structure | https://nextjs.org/docs/app/getting-started/project-structure |
| 9 | Next.js — Data Fetching & Caching | https://nextjs.org/docs/app/getting-started/fetching-data |
| 10 | Digital Applied — Redis Caching Next.js 2025 | https://www.digitalapplied.com/blog/redis-caching-strategies-nextjs-production |
| 11 | AWS Whitepaper — Database Caching Strategies with Redis | https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html |
| 12 | Auth.js — Drizzle Adapter | https://authjs.dev/getting-started/adapters/drizzle |
| 13 | CVE-2026-39356 — Drizzle ORM SQL Injection | https://github.com/drizzle-team/drizzle-orm/security/advisories/GHSA-gpj5-g38j-94v9 |
| 14 | 3 Biggest Mistakes with Drizzle ORM (Medium) | https://medium.com/@lior_amsalem/3-biggest-mistakes-with-drizzle-orm-1327e2531aff |
| 15 | Noqta — Full-Stack App Drizzle + Next.js 15 | https://noqta.tn/en/tutorials/drizzle-orm-nextjs-fullstack-database-2026 |
| 16 | Strapi — How to Use Drizzle ORM with Next.js 15 | https://strapi.io/blog/how-to-use-drizzle-orm-with-postgresql-in-a-nextjs-15-project |
| 17 | Fullstack Recipes — Neon + Drizzle Setup | https://fullstackrecipes.com/recipes/neon-drizzle-setup |
| 18 | Neptune Docs — Drizzle ORM Performance | https://www.drizzle-cube.dev/advanced/performance |
| 19 | LibraryOS (GitHub) | https://github.com/ChanMeng666/library-os |
| 20 | PostgreSQL Library Management Schema (Medium) | https://medium.com/@vijaygadhave2014/library-management-a-postgresql-guide-84189297a984 |
| 21 | Library Management Database Project (GitHub) | https://github.com/RaghadHanon/Library-Management-System-Database-Project |
| 22 | Best Practices for Organizing Next.js 15 (DEV) | https://dev.to/bajrayejoon/best-practices-for-organizing-your-nextjs-15-2025-53ji |
| 23 | AFINE — SQL Injection in the Age of ORM | https://afine.com/sql-injection-in-the-age-of-orm-risks-mitigations-and-best-practices |
| 24 | DEV — Top 10 Open Source Next.js Projects | https://dev.to/codebucks/top-10-best-open-source-nextjs-projects-to-learn-from-217h |
| 25 | LibraryOS GitHub Description | Full-featured multi-tenant library management system |
| 26 | Neon FAQs — Best Postgres Services | https://neon.com/faqs/best-postgres-services-javascript-typescript-drizzle-prisma |
