# University Library JSM — Research Report

**Project:** university-libary-jsm  
**Stack:** Next.js 15, Drizzle ORM, Neon (serverless PostgreSQL), Upstash Redis, NextAuth v5, ImageKit, Nodemailer, Upstash QStash  
**Report Date:** 2025-07-10  
**Mode:** UPDATE (appending new findings from Section 11 queries)  

---

## Section 11 — Web Research Queries (2026 Patterns)

### 1. Next.js 15 + Drizzle ORM + Neon Serverless Patterns 2026

**Key Findings (2026):**

| Pattern | Details |
|---------|---------|
| **Driver** | Use `@neondatabase/serverless` with `drizzle-orm/neon-http` for HTTP-based serverless connections; `drizzle-orm/neon-serverless` for WebSocket connections |
| **Connection** | `const sql = neon(process.env.DATABASE_URL); const db = drizzle(sql);` — no connection pool needed; Neon scales to zero |
| **Cold Start** | Drizzle + Neon HTTP driver avoids cold-start tax of TCP drivers; ideal for Vercel Edge / serverless |
| **Migrations** | `drizzle-kit` with `drizzle.config.ts` pointing to `src/db/schema.ts`; use `db:push` for prototyping, `db:migrate` for production |
| **Branching** | Neon database branching for preview deployments (copy-on-write branches in seconds) |
| **Type Safety** | Full end-to-end type safety: DB schema → Drizzle schema → Zod validation → tRPC/Server Actions → UI |
| **Reference** | [Drizzle + Neon Tutorial 2026](https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon), [Neon Serverless Guide 2026](https://encore.dev/articles/neon-serverless-postgres) |

**Library-Specific Patterns:**
- Use `drizzle-orm/neon-http` for App Router Server Components (no persistent connections)
- `drizzle-orm/neon-serverless` for WebSocket connections in long-running processes (e.g., QStash workers)
- Enable Neon connection pooling via `?pooler=true` in connection string for high-concurrency loan operations

---

### 2. Upstash Redis Caching & Rate Limiting for Library Systems

**Key Findings (2026):**

| Pattern | Details |
|---------|---------|
| **Rate Limiting** | `@upstash/ratelimit` — HTTP-based, connectionless, works on Vercel Edge; `ratelimit.limit(key)` returns `{ success, limit, remaining, reset }` |
| **Caching** | `@upstash/redis` — REST API, no persistent connections; `redis.get(key)`, `redis.setex(key, ttl, value)` |
| **Library Catalog Caching** | Cache book search results (TTL 5min), popular books (TTL 1hr), member profiles (TTL 15min) |
| **Rate Limit Tiers** | Free tier: 100 req/min/IP; Member tier: 500 req/min; Admin: unlimited |
| **Sliding Window** | `Ratelimit.slidingWindow(100, "60 s")` for smooth rate limiting |
| **Edge Compatible** | Works in Vercel Edge Functions, Cloudflare Workers, Next.js Middleware |
| **Reference** | [Upstash Rate Limit Docs](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview), [Upstash + Next.js 2026](https://noqta.tn/en/tutorials/upstash-redis-nextjs-rate-limiting-caching-2026) |

**Library-Specific Patterns:**
- Rate-limit `/api/books/search` at 60 req/min per IP
- Rate-limit `/api/loans/create` at 10 req/min per member (prevent loan spam)
- Cache book cover images via ImageKit + Redis (cache ImageKit transformation URLs)
- Use Redis sorted sets for "most borrowed books" leaderboard (`ZINCRBY`)

---

### 3. NextAuth v5 (Auth.js) + Drizzle Adapter Authentication Patterns

**Key Findings (2026):**

| Pattern | Details |
|---------|---------|
| **Adapter** | `@auth/drizzle-adapter` — official Drizzle adapter for Auth.js v5 |
| **Schema** | Use Auth.js Drizzle schema: `users`, `accounts`, `sessions`, `verificationTokens`, `authenticators` |
| **Install** | `pnpm add next-auth@beta @auth/drizzle-adapter drizzle-orm` |
| **Config** | `import { DrizzleAdapter } from "@auth/drizzle-adapter"; export const { handlers, auth, signIn, signOut } = NextAuth({ adapter: DrizzleAdapter(db), providers: [...] })` |
| **Neon Compatibility** | Use `@neondatabase/serverless` Pool inside request handler (not global) — Neon cannot keep pool alive between requests |
| **Drizzle Schema** | Extend Auth.js schema with library fields: `members` table with `memberId`, `role` (MEMBER, LIBRARIAN, ADMIN), `maxLoans`, `loanPeriodDays` |
| **Session** | Extend session with `memberId`, `role` via `callbacks.session` |
| **Reference** | [Auth.js Drizzle Adapter](https://authjs.dev/getting-started/adapters/drizzle), [NextAuth v5 + Drizzle + Neon Tutorial](https://www.youtube.com/watch?v=i6xOD_OqEdI) |

**Library-Specific Auth Patterns:**
- Role-based access: `MEMBER` (borrow/return), `LIBRARIAN` (manage books, approve loans), `ADMIN` (manage members, system config)
- Email/password with Nodemailer for verification/reset (credentials provider)
- OAuth: Google, GitHub for member self-registration
- Session stored in Neon via Drizzle adapter; Redis caches session lookups for middleware

---

### 4. QStash Async Workflows for Library Notifications

**Key Findings (2026):**

| Pattern | Details |
|---------|---------|
| **QStash Client** | `@upstash/qstash` — `import { Client } from "@upstash/qstash"; const qstash = new Client({ token: process.env.QSTASH_TOKEN });` |
| **Publish** | `await qstash.publishJSON({ url: "https://api.lib.vercel.app/api/qstash/loan-reminder", body: { memberId, bookId, dueDate }, delay: "24h" });` |
| **Workflow** | `@upstash/workflow` — durable functions with retries, timeouts, `context.sleep()`, `context.run()` |
| **Verify Signature** | `@upstash/qstash/nextjs` — `verifySignatureAppRouter(req)` middleware for webhook security |
| **Library Workflows** | Loan due reminders (24h, 1h before), overdue notices (daily), reservation ready notifications, welcome emails |
| **Retry Policy** | Exponential backoff: 1min, 5min, 15min, 1hr, 6hr (max 5 retries) |
| **Reference** | [Upstash Workflow](https://github.com/upstash/workflow-js), [QStash + Novu Notifications](https://upstash.com/blog/qstash-with-novu) |

**Library Notification Patterns:**
```typescript
// Loan due reminder workflow
export const loanReminderWorkflow = createWorkflow({
  steps: [
    async (ctx) => {
      const loan = await ctx.run("fetch-loan", () => db.query.loans.findFirst(...));
      if (!loan || loan.returnedAt) return ctx.stop();
      await ctx.run("send-email", () => sendLoanReminderEmail(loan.memberEmail, loan.bookTitle, loan.dueDate));
    }
  ]
});
```

---

### 5. Neon Serverless PostgreSQL Connection Pooling with Drizzle

**Key Findings (2026):**

| Pattern | Details |
|---------|---------|
| **Pooling** | Neon built-in pooler: append `?pooler=true` to connection string; uses PgBouncer in transaction mode |
| **HTTP Driver** | `@neondatabase/serverless` with `drizzle-orm/neon-http` — no pooling needed (stateless HTTP) |
| **WebSocket Driver** | `drizzle-orm/neon-serverless` — maintains persistent connections; use for long-running workers |
| **Connection String** | `postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?pooler=true&sslmode=require` |
| **Edge Runtime** | HTTP driver required for Vercel Edge / Cloudflare Workers (no TCP sockets) |
| **Pool Size** | Neon pooler manages pool size automatically; no `max` config needed |
| **Reference** | [Neon Drizzle Integration](https://github.com/neondatabase/ai-rules/blob/main/neon-drizzle.mdc), [Neon Serverless Guide](https://encore.dev/articles/neon-serverless-postgres) |

**Library Pooling Strategy:**
- API routes (App Router): HTTP driver (`neon-http`) — stateless, scales to zero
- QStash workers: WebSocket driver (`neon-serverless`) — persistent for workflow steps
- Background jobs (cron): HTTP driver with `pooler=true`
- Avoid global Pool instances in serverless — create per-request or use HTTP driver

---

### 6. Drizzle ORM Schema for Library Management (Books, Members, Loans)

**Recommended Schema Structure (2026):**

```typescript
// src/db/schema.ts
import { pgTable, serial, varchar, text, integer, timestamp, boolean, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["MEMBER", "LIBRARIAN", "ADMIN"]);
export const loanStatusEnum = pgEnum("loan_status", ["ACTIVE", "RETURNED", "OVERDUE", "LOST"]);
export const reservationStatusEnum = pgEnum("reservation_status", ["PENDING", "READY", "EXPIRED", "CANCELLED"]);

// Auth.js tables (required by @auth/drizzle-adapter)
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: varchar("image", { length: 255 }),
  role: roleEnum("role").default("MEMBER").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
}, (table) => [primaryKey({ columns: [table.provider, table.providerAccountId] })]);

export const sessions = pgTable("sessions", {
  sessionToken: varchar("session_token", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (table) => [primaryKey({ columns: [table.identifier, table.token] })]);

// Library-specific tables
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  memberId: varchar("member_id", { length: 50 }).notNull().unique(), // Human-readable: LIB-2024-001
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  dateOfBirth: timestamp("date_of_birth", { mode: "date" }),
  maxLoans: integer("max_loans").default(5).notNull(),
  loanPeriodDays: integer("loan_period_days").default(14).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  biography: text("biography"),
  birthDate: timestamp("birth_date", { mode: "date" }),
  deathDate: timestamp("death_date", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  isbn: varchar("isbn", { length: 13 }).unique(),
  title: varchar("title", { length: 500 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  description: text("description"),
  categoryId: integer("category_id").references(() => categories.id),
  authorId: integer("author_id").references(() => authors.id),
  publisher: varchar("publisher", { length: 255 }),
  publishedYear: integer("published_year"),
  pages: integer("pages"),
  language: varchar("language", { length: 50 }).default("English"),
  coverImageUrl: varchar("cover_image_url", { length: 500 }), // ImageKit URL
  totalCopies: integer("total_copies").default(1).notNull(),
  availableCopies: integer("available_copies").default(1).notNull(),
  location: varchar("location", { length: 100 }), // Shelf location
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("books_isbn_unique").on(table.isbn),
  index("books_title_idx").on(table.title),
  index("books_author_idx").on(table.authorId),
  index("books_category_idx").on(table.categoryId),
]);

export const bookCopies = pgTable("book_copies", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  copyNumber: integer("copy_number").notNull(),
  barcode: varchar("barcode", { length: 50 }).unique(),
  condition: varchar("condition", { length: 50 }).default("GOOD"), // GOOD, FAIR, POOR, DAMAGED
  status: varchar("status", { length: 50 }).default("AVAILABLE"), // AVAILABLE, ON_LOAN, LOST, MAINTENANCE
  acquiredAt: timestamp("acquired_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("book_copies_book_copy_unique").on(table.bookId, table.copyNumber),
]);

export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull().references(() => members.id),
  bookCopyId: integer("book_copy_id").notNull().references(() => bookCopies.id),
  loanDate: timestamp("loan_date", { mode: "date" }).defaultNow().notNull(),
  dueDate: timestamp("due_date", { mode: "date" }).notNull(),
  returnedDate: timestamp("returned_date", { mode: "date" }),
  status: loanStatusEnum("status").default("ACTIVE").notNull(),
  renewalCount: integer("renewal_count").default(0).notNull(),
  maxRenewals: integer("max_renewals").default(2).notNull(),
  fineAmount: integer("fine_amount").default(0).notNull(), // In cents
  finePaid: boolean("fine_paid").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  index("loans_member_idx").on(table.memberId),
  index("loans_book_copy_idx").on(table.bookCopyId),
  index("loans_status_idx").on(table.status),
  index("loans_due_date_idx").on(table.dueDate),
]);

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull().references(() => members.id),
  bookId: integer("book_id").notNull().references(() => books.id),
  status: reservationStatusEnum("status").default("PENDING").notNull(),
  reservedAt: timestamp("reserved_at", { mode: "date" }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  notifiedAt: timestamp("notified_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  index("reservations_member_idx").on(table.memberId),
  index("reservations_book_idx").on(table.bookId),
  index("reservations_status_idx").on(table.status),
]);

export const fines = pgTable("fines", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull().references(() => members.id),
  loanId: integer("loan_id").references(() => loans.id),
  amount: integer("amount").notNull(), // In cents
  reason: varchar("reason", { length: 255 }).notNull(), // OVERDUE, LOST, DAMAGE
  status: varchar("status", { length: 50 }).default("PENDING").notNull(), // PENDING, PAID, WAIVED
  paidAt: timestamp("paid_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  index("fines_member_idx").on(table.memberId),
  index("fines_status_idx").on(table.status),
]);

// Relations
export const membersRelations = relations(members, ({ one, many }) => ({
  user: one(users, { fields: [members.userId], references: [users.id] }),
  loans: many(loans),
  reservations: many(reservations),
  fines: many(fines),
}));

export const booksRelations = relations(books, ({ one, many }) => ({
  category: one(categories, { fields: [books.categoryId], references: [categories.id] }),
  author: one(authors, { fields: [books.authorId], references: [authors.id] }),
  copies: many(bookCopies),
  reservations: many(reservations),
}));

export const loansRelations = relations(loans, ({ one }) => ({
  member: one(members, { fields: [loans.memberId], references: [members.id] }),
  bookCopy: one(bookCopies, { fields: [loans.bookCopyId], references: [bookCopies.id] }),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  member: one(members, { fields: [reservations.memberId], references: [members.id] }),
  book: one(books, { fields: [reservations.bookId], references: [books.id] }),
}));

export const finesRelations = relations(fines, ({ one }) => ({
  member: one(members, { fields: [fines.memberId], references: [members.id] }),
  loan: one(loans, { fields: [fines.loanId], references: [loans.id] }),
}));
```

**Schema Best Practices (2026):**
- Use `drizzle-zod` for Zod schema generation from Drizzle tables
- Add trigram indexes (`pg_trgm`) on `books.title`, `authors.name` for fuzzy search
- Use `integer` for monetary values (cents) to avoid floating-point issues
- Soft deletes via `isActive` / `deletedAt` instead of hard deletes
- `drizzle-kit` config: `schema: "./src/db/schema.ts", out: "./drizzle"`

---

### 7. ImageKit Media Handling for Book Covers & Assets

**Key Findings (2026):**

| Feature | Details |
|---------|---------|
| **Next.js Integration** | `import { ImageKit } from "imagekitio-next";` — wrapper around `next/image` |
| **Upload** | Server-side: `imagekit.upload({ file: buffer, fileName: "cover.jpg", folder: "/books/covers" })` |
| **Transformations** | URL-based: `ik-imagekit.io/endpt/tr:w-400,h-600,q-80,f-auto/book/covers/isbn123.jpg` |
| **AI Features** | Background removal (`bg-remove`), smart crop (`fo-auto`), generative fill (`gen-fill`) |
| **Book Cover Pipeline** | Upload original → Auto-generate thumbnails (150x200, 300x400, 600x800) → WebP/AVIF delivery |
| **CDN** | Global CDN included; custom CNAME support |
| **Cost** | Free tier: 20GB bandwidth, 20GB storage, unlimited transformations |
| **Reference** | [Next.js ImageKit Optimization](https://imagekit.io/blog/nextjs-image-optimization), [AI Transformations](https://www.youtube.com/watch?v=wcgtFHdonF4) |

**Library-Specific Implementation:**

```typescript
// lib/imagekit.ts
import { ImageKit } from "imagekit";

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

// Upload book cover with transformations
export async function uploadBookCover(file: Buffer, isbn: string) {
  const result = await imagekit.upload({
    file,
    fileName: `${isbn}.jpg`,
    folder: "/books/covers",
    tags: ["book-cover", isbn],
    transformations: [
      { width: "800", height: "1200", quality: "80", format: "webp" }, // Main
      { width: "300", height: "450", quality: "80", format: "webp" },  // Thumbnail
      { width: "150", height: "225", quality: "70", format: "webp" },  // Tiny
    ],
  });
  return result;
}

// Delete cover when book removed
export async function deleteBookCover(isbn: string) {
  const files = await imagekit.listFiles({ tags: isbn, path: "/books/covers" });
  await Promise.all(files.map(f => imagekit.deleteFile(f.fileId)));
}
```

**Next.js Image Component Usage:**
```tsx
import { ImageKitImage } from "imagekitio-next";

<ImageKitImage
  src={`${process.env.IMAGEKIT_URL_ENDPOINT}/books/covers/${book.isbn}.jpg`}
  alt={book.title}
  width={300}
  height={450}
  transformation={[{ quality: "80", format: "webp" }]}
  placeholder="blur"
  blurDataURL={book.blurDataUrl}
/>
```

---

## Summary of New 2026 Patterns Added

| Area | Key 2026 Update |
|------|-----------------|
| **Next.js 15 + Drizzle + Neon** | HTTP driver (`neon-http`) for serverless; Neon pooler for connection management; database branching for previews |
| **Upstash Redis** | HTTP-based rate limiting (`@upstash/ratelimit`) works on Edge; sliding window algorithm; tiered limits |
| **NextAuth v5 + Drizzle** | `@auth/drizzle-adapter` official; Neon requires per-request Pool; extend schema with library roles |
| **QStash Workflows** | Durable functions with `context.sleep()`, `context.run()`; exponential backoff retries; signature verification |
| **Neon Pooling** | `?pooler=true` for PgBouncer; HTTP driver for Edge; WebSocket for workers |
| **Drizzle Library Schema** | Complete schema with books, copies, members, loans, reservations, fines; trigram indexes for search |
| **ImageKit** | AI transformations (bg-remove, smart-crop); multi-size generation on upload; Next.js Image wrapper |

---

## Related Workspace Projects (Cross-Reference)

| Project | Shared Patterns |
|---------|-----------------|
| **banking** | Next.js + Drizzle + Neon; fintech security, audit logs |
| **rhixe_scans** | Next.js 15 catalog; search/filter UX for library |
| **comicwise** | Next.js 15 + NextAuth v5; Redis realtime |
| **rhixecompany-comics** | Serverless Postgres + Redis infrastructure |

---

## References

| Resource | URL |
|----------|-----|
| Drizzle + Neon Tutorial | https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon |
| Neon Serverless Guide 2026 | https://encore.dev/articles/neon-serverless-postgres |
| Upstash Rate Limit | https://upstash.com/docs/redis/sdks/ratelimit-ts/overview |
| Auth.js Drizzle Adapter | https://authjs.dev/getting-started/adapters/drizzle |
| Upstash Workflow | https://github.com/upstash/workflow-js |
| ImageKit Next.js | https://imagekit.io/blog/nextjs-image-optimization |
| Neon Drizzle AI Rules | https://github.com/neondatabase/ai-rules/blob/main/neon-drizzle.mdc |

---

*Report updated: 2025-07-10 — Section 11 web research queries integrated*