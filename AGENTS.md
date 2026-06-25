# University Library JSM

## Architecture
- **Type:** Next.js library management system
- **Pattern:** App Router with Drizzle ORM, Neon serverless PostgreSQL, Redis caching
- **Reference:** [Workflow Analysis](docs/Project_Architecture/Workflow_Analysis.md), [Exemplars](docs/Project_Architecture/exemplars.md)

Next.js 15 + Drizzle ORM + Neon (serverless PostgreSQL) + Redis (Upstash). Full-stack library management with book tracking, user management, and session caching.

## Stack
- **Frontend:** Next.js 15, TypeScript (strict), App Router
- **Database:** PostgreSQL via Drizzle ORM / Neon
- **Cache:** Redis (Upstash) for session caching and rate limiting
- **Auth:** NextAuth.js
- **Deploy:** Vercel + Neon

## Commands
```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:push
npm run db:studio
```

## Conventions
- Schema in Drizzle files under `src/db/`
- Redis for session caching and API rate limiting
- `.env.local` — never commit; Neon and Upstash credentials required
- Drizzle migrations via `db:push` for schema updates
- Node 18+ required

## Notes
- Serverless PostgreSQL via Neon (connection pooling)
- Upstash Redis for serverless-compatible caching
- Drizzle Studio for DB inspection
- Vercel + Neon for production deployment
