# University Library JSM — Library Management System

> **Stack:** Next.js 15 + Drizzle ORM + Neon | **Type:** Full-Stack Library Management | **Status:** Active

A university library management system built with Next.js 15, using Drizzle ORM with Neon (serverless PostgreSQL), Upstash Redis for caching/rate limiting, and NextAuth for authentication.

---

## Technology Stack

| Category                    | Technology                                          |
| --------------------------- | --------------------------------------------------- |
| **Framework**               | Next.js 15.4.2 (App Router)                         |
| **Language**                | TypeScript ^5 (strict)                              |
| **UI**                      | React 19.1.0, Radix UI, shadcn/ui, Tailwind CSS 4.x |
| **Data Display**            | TanStack React Table, Recharts                      |
| **Database**                | PostgreSQL (Neon serverless) via Drizzle ORM 0.44.x |
| **Authentication**          | NextAuth v5 (beta) with Drizzle adapter             |
| **Caching / Rate Limiting** | Upstash Redis                                       |
| **Media**                   | ImageKit                                            |
| **Email**                   | Nodemailer, React Email                             |
| **Async Workflows**         | Upstash QStash                                      |

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│         university-libary-jsm (Next.js 15)               │
├──────────────────────────────────────────────────────────┤
│  App Router Pages                                        │
│  ├── /                    Library dashboard               │
│  ├── /books               Book catalog                    │
│  ├── /members             Member management               │
│  ├── /loans               Loan tracking                   │
│  └── /auth                Authentication                  │
├──────────────────────────────────────────────────────────┤
│  Database Layer                                           │
│  ├── Drizzle ORM → Neon (Serverless PostgreSQL)          │
│  └── Redis (Upstash) for caching                         │
├──────────────────────────────────────────────────────────┤
│  External Services                                        │
│  ├── NextAuth v5 (authentication)                        │
│  ├── ImageKit (media/images)                             │
│  ├── Upstash (Redis cache + QStash)                      │
│  └── Resend/Nodemailer (email)                           │
└──────────────────────────────────────────────────────────┘
```

## Project Structure

```
university-libary-jsm/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── books/           # Book catalog
│   │   ├── members/         # Member management
│   │   ├── loans/           # Loan tracking
│   │   ├── auth/            # Authentication
│   │   └── api/             # API routes
│   ├── components/          # React components
│   ├── database/            # Drizzle schema & queries
│   │   ├── schema.ts        # Database schema
│   │   └── seed.ts          # Database seeding
│   ├── lib/                 # Utility functions
│   └── styles/              # Global styles
├── public/                  # Static assets
└── docs/Project_Architecture/
```

## Getting Started

```bash
# Prerequisites: Node.js 18+, Neon PostgreSQL database

# Install dependencies
bun install

# Set up environment
cp .env.example .env.local
# Configure database URL, NextAuth secrets, Upstash Redis, etc.

# Database setup
bun run db:generate
bun run db:push         # or bun run db:migrate
bun run db:studio       # Optional: Drizzle Studio

# Start development server
bun run dev

# Run linting and formatting
bun run lint
bun run format
```

## Key Features

- **Book Catalog** — Browse, search, and manage book inventory
- **Member Management** — Track library members and their activity
- **Loan Tracking** — Manage book checkouts, returns, and due dates
- **Authentication** — NextAuth v5 with Drizzle adapter
- **Dashboard** — Library analytics and overview
- **Server Actions** — Dot-notation naming convention (`book.create.ts`)
- **Caching** — Upstash Redis for session caching and rate limiting

## Development Workflow

```bash
bun run dev              # Dev server with Turbopack
bun run build            # Production build
bun run lint             # ESLint
bun run format           # Prettier
bun run format:check     # Prettier check
bun run db:generate      # Generate Drizzle migrations
bun run db:push          # Push schema to database
bun run db:migrate       # Apply migrations
bun run db:studio        # Open Drizzle Studio
```

## Coding Standards

- **TypeScript strict**: Full type safety
- **App Router**: Next.js App Router patterns
- **Tailwind CSS 4**: Utility-first styling
- **Zod 4**: Schema validation for forms and APIs
- **shadcn/ui**: Radix-based component library
- **Server Actions**: Dot notation naming (e.g., `book.create.ts`)
- **`cn()` utility**: Tailwind class merging
- **Database**: Drizzle ORM with parameterized queries

## Security

- No `.env` files committed to VCS
- NextAuth v5 `auth()` for protected routes
- Zod validation on all inputs
- Upstash Ratelimit for rate limiting
- ImageKit signed uploads for media security

## External Integrations

| Service                 | Purpose                         |
| ----------------------- | ------------------------------- |
| **Neon**                | Serverless PostgreSQL database  |
| **Upstash Redis**       | Caching and rate limiting       |
| **Upstash QStash**      | Async workflows                 |
| **ImageKit**            | Media optimization and delivery |
| **Resend / Nodemailer** | Email delivery                  |

## License

Private
