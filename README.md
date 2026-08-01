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
npm install

# Set up environment
cp .env.example .env.local
# Configure database URL, NextAuth secrets, Upstash Redis, etc.

# Database setup
npm run db:generate
npm run db:push         # or npm run db:migrate
npm run db:studio       # Optional: Drizzle Studio

# Start development server
npm run dev

# Run linting and formatting
npm run lint
npm run format
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
npm run dev              # Dev server with Turbopack
npm run build            # Production build
npm run lint             # ESLint
npm run format           # Prettier
npm run format:check     # Prettier check
npm run db:generate      # Generate Drizzle migrations
npm run db:push          # Push schema to database
npm run db:migrate       # Apply migrations
npm run db:studio        # Open Drizzle Studio
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
