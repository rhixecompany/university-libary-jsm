# Copilot Instructions

Project-wide guidance for BookWise.

## Source of truth

- `projects/university-libary-jsm/AGENTS.md`
- `README.md`
- `src/`

## Commands

Run from the project root:

```bash
npm install
npm run dev
npm run lint
npm run format
npx tsc --noEmit
npm run db:push
npm run db:seed
npm run db:generate
npm run db:migrate
npm run db:studio
npm run build
npm start
```

## Architecture

- Next.js 15 App Router frontend with Drizzle + Neon PostgreSQL.
- Server Actions handle mutations; DAL classes handle reads.
- Upstash Redis/Workflows and ImageKit are part of the supporting platform.

## Conventions

- Keep server actions in the auth -> validate -> mutate -> revalidate pattern.
- Avoid N+1 queries by using Drizzle eager loading.
- Keep component and file naming aligned with shadcn/ui conventions.
- Use environment variables for auth, storage, and workflow credentials.

