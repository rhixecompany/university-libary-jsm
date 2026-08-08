# Copilot Instructions

Project-wide guidance for BookWise.

## Source of truth

- `projects/university-libary-jsm/AGENTS.md`
- `README.md`
- `src/`

## Commands

Run from the project root:

```bash
bun install
bun run dev
bun run lint
bun run format
bunx tsc --noEmit
bun run db:push
bun run db:seed
bun run db:generate
bun run db:migrate
bun run db:studio
bun run build
bun run start
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
