# The Story of University Library JSM

_The library system that learned to scale_

---

## Prologue: The Card Catalog

Every university has a library. Every library has a system. Most are legacy — COBOL on mainframes, or PHP 5.6 on a server in a closet.

This one started as a class project. "Build a library management system in Next.js."

**The twist:** It actually got used.

---

## Chapter 1: The Stack Decision

**Next.js 15 + Drizzle ORM + Neon + Redis.**

Why not Prisma? Drizzle is SQL-first. Types are inferred from the schema. No generator step. Faster cold starts on serverless.

```typescript
// src/db/schema.ts — The constitution
export const books = pgTable('books', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  author: varchar('author', { length: 200 }).notNull(),
  isbn: varchar('isbn', { length: 13 }).unique(),
  copiesTotal: integer('copies_total').default(1),
  copiesAvailable: integer('copies_available').default(1),
})

export const loans = pgTable('loans', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookId: uuid('book_id').references(() => books.id),
  userId: uuid('user_id').references(() => users.id),
  dueDate: timestamp('due_date').notNull(),
  status: varchar('status', { length: 20 }).default('active'),
})
```

---

## Chapter 2: The Serverless Database Problem

Neon = serverless PostgreSQL. Connection pooling via PgBouncer. But serverless functions open many connections.

**Solution:** Drizzle's `neon-http` driver. HTTP-based, not TCP. Works with connection pooling. No connection limits.

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)
```

---

## Chapter 3: Redis for the Serverless World

Sessions. Rate limiting. Cache invalidation. All need Redis.

Upstash = serverless Redis. HTTP API. Works on Vercel Edge.

```typescript
// src/lib/redis.ts
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Session store for NextAuth
export async function getSession(token: string) {
  return redis.get(`session:${token}`)
}
```

---

## Chapter 4: Drag-and-Drop Shelving

The fun feature: librarians drag books between virtual shelves.

```tsx
// src/components/library/ShelfDnD.tsx
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

export function ShelfDnD({ books, onReorder }) {
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={books.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        {books.map((book) => (
          <SortableBook key={book.id} book={book} />
        ))}
      </SortableContext>
    </DndContext>
  )
}
```

Optimistic UI → API call → Drizzle update → Redis cache invalidation.

---

## Chapter 5: The Overdue Notice Pipeline

```typescript
// src/app/api/cron/overdue/route.ts
export async function GET() {
  const overdue = await db
    .select()
    .from(loans)
    .where(and(eq(loans.status, 'active'), lt(loans.dueDate, new Date())))

  for (const loan of overdue) {
    await sendOverdueEmail(loan)
    await redis.incr(`overdue:${loan.userId}`)
  }

  return Response.json({ notified: overdue.length })
}
```

Cron via Vercel Cron Jobs (daily 6 AM). Upstash QStash for reliability.

---

## Chapter 6: Drizzle Studio — The Librarian's Dashboard

```bash
npm run db:studio
```

Opens at `localhost:4983`. Visual table editor. Filter, sort, edit. Librarians use it directly for bulk imports, data fixes.

No admin panel needed. The ORM _is_ the admin panel.

---

## Chapter 7: Deployment Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Vercel    │────▶│    Neon     │     │   Upstash   │
│  (Next.js)  │     │ (PostgreSQL)│     │   (Redis)   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
  Edge Functions      Serverless PG       Serverless Redis
  ISR/SSR             Connection Pool     HTTP API
```

- **Vercel:** Next.js build, edge functions, ISR for book pages
- **Neon:** Auto-scaling, branching for preview deploys
- **Upstash:** Pay-per-request, global replication

---

## Epilogue: The System That Runs Itself

No servers to patch. No connection pools to tune. No Redis clusters to shard.

The database scales. The cache scales. The compute scales.

The librarian logs in, scans a barcode, the book is checked out. The student gets an email. The overdue notice fires at 6 AM.

**It just works.**

---

_Written by the workspace chronicler, July 25, 2025.  
Filed at `projects/university-libary-jsm/THE_STORY_OF_THIS_REPO.md`._
