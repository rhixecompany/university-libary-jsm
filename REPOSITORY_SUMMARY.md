# REPOSITORY_SUMMARY.md

# University Library JSM — Library Management System

**Generated:** 2026-07-25  
**Project:** `projects/university-libary-jsm/`  
**Type:** Next.js 15 Library Management  
**Status:** Active

---

## Architecture

| Property      | Value                                        |
| ------------- | -------------------------------------------- |
| **Framework** | Next.js 15 (App Router, Turbopack)           |
| **Language**  | TypeScript (strict)                          |
| **Database**  | PostgreSQL via Drizzle ORM / Neon            |
| **Cache**     | Redis (Upstash) for sessions + rate limiting |
| **Auth**      | NextAuth.js v5                               |
| **Deploy**    | Vercel + Neon                                |

---

## Technology Stack

| Layer           | Technology                                            |
| --------------- | ----------------------------------------------------- |
| Frontend        | Next.js 15, React 19, TypeScript strict, Tailwind CSS |
| UI Components   | @dnd-kit (drag-drop), Radix UI, shadcn/ui             |
| Forms           | React Hook Form + Zod validation                      |
| Database        | Drizzle ORM, Neon serverless PostgreSQL               |
| Cache/Auth      | Upstash Redis, NextAuth.js                            |
| Email           | Upstash QStash (dev)                                  |
| Quality         | ESLint, Prettier, TypeScript strict                   |
| Package Manager | npm                                                   |

---

## Project Structure

```
university-libary-jsm/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── api/               # API routes
│   │   ├── (auth)/            # Auth pages
│   │   ├── (dashboard)/       # Protected pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui base
│   │   ├── library/          # Domain components
│   │   └── forms/            # Form components
│   ├── db/                    # Drizzle schema + client
│   │   ├── schema.ts         # Table definitions
│   │   └── index.ts          # DB client
│   ├── lib/                   # Utilities
│   │   ├── auth.ts           # NextAuth config
│   │   ├── redis.ts          # Upstash client
│   │   └── validations/      # Zod schemas
│   └── hooks/                 # Custom React hooks
├── drizzle/                   # Migrations
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── drizzle.config.ts
└── .env.example
```

---

## Commands

```bash
# Install
bun install

# Database
bun run db:generate    # Generate Drizzle migrations
bun run db:push        # Push schema to DB
bun run db:studio      # Drizzle Studio
bun run db:migrate     # Run migrations
bun run db:seed        # Seed data

# Development
bun run dev            # Next.js + Turbopack

# Quality
bun run lint           # ESLint
bun run format         # Prettier write
bun run format:check   # Prettier check

# Email dev
bun run dev:email      # Email preview
bun run dev:upstash    # QStash dev
```

---

## Database Schema (Drizzle Highlights)

```typescript
// src/db/schema.ts
export const books = pgTable('books', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  author: varchar('author', { length: 200 }).notNull(),
  isbn: varchar('isbn', { length: 13 }).unique(),
  publishedYear: integer('published_year'),
  genre: varchar('genre', { length: 100 }),
  copiesTotal: integer('copies_total').default(1),
  copiesAvailable: integer('copies_available').default(1),
  createdAt: timestamp('created_at').defaultNow(),
})

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 100 }),
  role: varchar('role', { length: 20 }).default('member'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const loans = pgTable('loans', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookId: uuid('book_id').references(() => books.id),
  userId: uuid('user_id').references(() => users.id),
  loanDate: timestamp('loan_date').defaultNow(),
  dueDate: timestamp('due_date').notNull(),
  returnDate: timestamp('return_date'),
  status: varchar('status', { length: 20 }).default('active'),
})
```

---

## CI/CD

**Workflow:** `.github/workflows/university-libary-jsm-ci.yml`  
**Jobs:** Install → TypeScript check → ESLint → Next.js build → Tests

---

## Related Projects

- **Banking** — Shares Drizzle ORM patterns
- **rhixe_scans** — Shares Next.js 15 + Prisma/Drizzle patterns
- **comicwise** — Shares Prisma patterns (different ORM)

---

## Notes

- Serverless PostgreSQL via Neon (connection pooling)
- Upstash Redis for serverless-compatible caching
- Drizzle Studio for DB inspection
- Vercel + Neon for production deployment
