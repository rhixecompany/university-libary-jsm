# University Library JSM - Library Management Context

Next.js 15 library management system with Drizzle, Neon, and Redis.

## Architecture
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Drizzle ORM + Neon (serverless Postgres)
- **Cache**: Redis
- **Auth**: NextAuth.js
- **Deployment**: Vercel + Neon

## Conventions
- TypeScript strict mode
- Server Components by default
- API routes in `src/app/api/`
- Drizzle schema in `src/db/schema.ts`
- Redis for session caching
- Environment variables in `.env.local`

## Commands
```bash
# Dev server
npm run dev

# Build
npm run build

# Database
npm run db:generate
npm run db:push
npm run db:studio

# Lint
npm run lint
```

## Important Notes
- Neon connection string in `.env.local` — never commit
- Redis for rate limiting and caching
- Drizzle migrations managed via `db:push`