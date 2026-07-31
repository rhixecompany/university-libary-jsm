# 🏗 Technology Stack Blueprint - university-libary-jsm

**Project Path:** `projects/university-libary-jsm`
**Generated:** 2026-07-28
**Status:** Active — Library Management System

---

## Core Technologies

| Category | Technology | Version | License |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 15.4.2 | MIT |
| **Language** | TypeScript (strict) | ^5 | Apache 2.0 |
| **UI Library** | React | 19.1.0 | MIT |
| **Package Manager** | npm | Latest | - |
| **ORM** | Drizzle ORM | ^0.44.3 | Apache 2.0 |
| **Database** | PostgreSQL (Neon Serverless) | Latest | PostgreSQL |
| **Cache** | Upstash Redis | ^1.35.1 | MIT |
| **Auth** | NextAuth.js v5 (beta) | ^5.0.0-beta.25 | ISC |
| **Styling** | Tailwind CSS v4 | ^4.1.11 | MIT |
| **UI Components** | Radix UI / shadcn/ui | Latest | MIT |
| **Charts** | Recharts | ^2.15.4 | MIT |
| **Email** | Nodemailer | ^7.0.5 | MIT |
| **Image** | ImageKit / imagekitio-next | ^6.0 / ^1.0 | MIT |
| **Rate Limiting** | Upstash Ratelimit | ^2.0.5 | MIT |
| **Workflow** | Upstash Workflow | ^0.2.16 | MIT |
| **Validation** | Zod | ^4.0.5 | MIT |
| **Forms** | React Hook Form | ^7.60.0 | MIT |
| **Icons** | Lucide React + Tabler Icons | ^0.525 / ^3.34 | MIT |
| **Testing** | ESLint 9 + Prettier 3 | ^9 / ^3.6 | MIT |

---

## Architecture

**Pattern:** Next.js 15 App Router with Drizzle ORM + Neon + Redis

```
Client (Browser)
    │
    ▼
Next.js 15 (App Router)
    ├─▶ Server Components (default)
    ├─▶ Client Components (interactivity)
    ├─▶ Server Actions (mutations)
    └─▶ API Routes (webhooks, auth callbacks)
         │
         ▼
┌──────────────────┐    ┌──────────────────┐
│  Drizzle ORM     │    │  Upstash Redis   │
│  (Neon PG)       │    │  (Sessions,      │
│  - Books         │    │   Rate Limiting, │
│  - Users         │    │   QStash)        │
│  - Loans         │    └──────────────────┘
│  - Sessions      │
└──────────────────┘
```

---

## Dependencies

### Production (~45 packages)

| Category | Key Packages |
|----------|-------------|
| **Framework** | `next@15.4.2`, `react@19.1.0`, `react-dom@19.1.0` |
| **Auth** | `next-auth@^5.0.0-beta.25`, `next-themes@^0.4.6` |
| **Database** | `drizzle-orm@^0.44.3`, `@neondatabase/serverless@^1.0.1`, `postgres@^3.4.9` |
| **Cache/Queue** | `@upstash/redis@^1.35.1`, `@upstash/ratelimit@^2.0.5`, `@upstash/workflow@^0.2.16`, `@upstash/qstash@^2.0.8` |
| **Validation** | `zod@^4.0.5` |
| **Forms** | `react-hook-form@^7.60.0`, `@hookform/resolvers@^3.9.1` |
| **UI** | `@radix-ui/*` (10+ packages), `class-variance-authority@^0.7.1`, `clsx@^2.1.1`, `tailwind-merge@^3.3.1`, `vaul@^1.1.2` |
| **Charts** | `recharts@^2.15.4` |
| **Email** | `nodemailer@^7.0.5` |
| **Media** | `imagekit@^6.0.0`, `imagekitio-next@^1.0.1` |
| **Utils** | `lucide-react@^0.525.0`, `@tabler/icons-react@^3.34.0`, `dayjs@^1.11.13`, `slugify@^1.6.6`, `sonner@^2.0.6`, `date-fns@^4.1.0`, `dotenv@^17.2.0` |

### Development (~15 packages)

| Category | Key Packages |
|----------|-------------|
| **TypeScript** | `typescript@^5`, `@types/node@^24`, `@types/react@^19`, `@types/react-dom@^19` |
| **ESLint** | `eslint@^9`, `eslint-config-next@15.4.2`, `eslint-config-prettier@^10.1.8`, `eslint-plugin-drizzle@^0.2.3`, `eslint-plugin-jsx-a11y@^6.10.2`, `eslint-plugin-prettier@^5.5.3`, `eslint-plugin-react@^7.37.5`, `eslint-plugin-zod@^1.4.0` |
| **Prettier** | `prettier@^3.6.2`, `prettier-plugin-tailwindcss@^0.6.14` |
| **Database** | `drizzle-kit@^0.31.4`, `tsx@^4.20.3` |
| **Email Dev** | `@react-email/preview-server@^4.2.3`, `react-email@4.2.3` |

---

## Database Schema (Drizzle)

```typescript
// src/db/schema.ts
import { pgTable, serial, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['student', 'librarian', 'admin']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  password: text('password'),
  role: roleEnum('role').default('student'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  isbn: text('isbn').unique(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  publisher: text('publisher'),
  year: integer('year'),
  genre: text('genre'),
  totalCopies: integer('total_copies').default(1),
  availableCopies: integer('available_copies').default(1),
  coverImage: text('cover_image'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const loans = pgTable('loans', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  bookId: integer('book_id').references(() => books.id),
  loanDate: timestamp('loan_date').defaultNow(),
  dueDate: timestamp('due_date').notNull(),
  returnDate: timestamp('return_date'),
  status: text('status').default('active'), // active, returned, overdue
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  expires: timestamp('expires').notNull(),
  data: text('data'), // encrypted session data
});
```

---

## Authentication Flow

```
1. User submits credentials → /api/auth/signin
2. NextAuth validates → creates JWT session
3. Session stored in Upstash Redis (fast, serverless)
4. Middleware checks session on protected routes
5. Role-based access (student/librarian/admin)
```

---

## Redis Usage (Upstash)

| Purpose | Key Pattern | TTL |
|---------|-------------|-----|
| **Sessions** | `session:{id}` | 30 days |
| **Rate Limiting** | `ratelimit:{ip}:{endpoint}` | 1 min |
| **QStash** | Managed by Upstash | - |

---

## Key Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev --turbopack` | Dev server with Turbopack |
| `build` | `next build` | Production build |
| `start` | `next start` | Production server |
| `lint` | `next lint` | ESLint check |
| `lint:fix` | `eslint . --fix` | Auto-fix lint |
| `format` | `prettier --write` | Format code |
| `db:seed` | `tsx database/seed.ts` | Seed database |
| `db:push` | `drizzle-kit push` | Push schema (dev) |
| `db:generate` | `drizzle-kit generate` | Generate migrations |
| `db:migrate` | `drizzle-kit migrate` | Run migrations |
| `db:studio` | `drizzle-kit studio` | Drizzle Studio UI |
| `dev:email` | `email dev` | React Email preview |
| `dev:upstash` | `npx @upstash/qstash-cli dev` | Local QStash |

---

## Project Structure

```
university-libary-jsm/
├── src/
│   ├── app/
│   │   ├── (auth)/           # Auth route group
│   │   ├── (dashboard)/      # Protected routes
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # NextAuth
│   │   │   ├── books/        # Book CRUD
│   │   │   ├── loans/        # Loan management
│   │   │   └── admin/        # Admin endpoints
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── books/            # Book components
│   │   ├── loans/            # Loan components
│   │   └── forms/            # Form components
│   ├── db/
│   │   ├── index.ts          # Drizzle client
│   │   ├── schema.ts         # Schema definitions
│   │   └── queries.ts        # Query helpers
│   ├── lib/
│   │   ├── auth.ts           # NextAuth config
│   │   ├── redis.ts          # Upstash Redis client
│   │   ├── ratelimit.ts      # Rate limiting
│   │   ├── email.ts          # Nodemailer config
│   │   ├── imagekit.ts       # ImageKit client
│   │   └── utils.ts          # cn(), formatters
│   ├── hooks/
│   │   └── use-*.ts
│   ├── types/
│   └── validations/
│       └── *.ts              # Zod schemas
├── database/
│   └── seed.ts
├── emails/                   # React Email templates
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc
├── package.json
├── package-lock.json
└── .env.local (gitignored)
```

---

## CI/CD

**Workflow:** `.github/workflows/university-libary-jsm-ci.yml`

1. **Install** → `npm ci`
2. **Type Check** → `npx tsc --noEmit`
3. **Lint** → `npm run lint`
4. **Format Check** → `npm run format:check`
5. **Build** → `npm run build`
6. **Deploy** → Vercel (on merge to `staged`)

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...
DATABASE_URL_UNPOOLED=postgresql://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://...

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
QSTASH_TOKEN=...
QSTASH_URL=...

# Email
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
EMAIL_FROM=...

# ImageKit
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=...
```

---

## License Summary

| License | Count |
|---------|-------|
| MIT | ~55 |
| Apache 2.0 | ~5 |
| ISC | ~2 |

---

*Generated by Hermes Agent Technology Stack Blueprint Generator*