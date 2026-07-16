# University Library JSM — Research Report

**Type:** Next.js 15 library management system (full-stack)
**Tech Stack:** Next.js 15 (App Router, TS strict), Drizzle ORM, Neon serverless PostgreSQL, Upstash Redis, NextAuth/Auth.js v5, ImageKit, Tailwind/shadcn, Zod
**Status:** Active
**Updated:** 2026-07-16

---

## Similar Projects

| Project | Why Relevant |
|---------|--------------|
| `ChanMeng666/library-os` (LibraryOS) | Next.js + Drizzle multi-tenant library reference (swap Supabase → Drizzle+Neon) |
| Cal.com | Scheduling + RBAC architecture reference for auth/sessions |
| Rallly | Clean React/Next.js UX patterns for catalog UIs |
| Auth.js Drizzle Adapter (now Better Auth) | Official DB session adapter for NextAuth v5 |

## Key Findings
### Project Architecture
- `src/app/` routing-only; business logic in `src/features/` and `src/db/queries/`
- Schema files (books.ts, members.ts, loans.ts) colocated under `src/db/schema/`
- Server Actions in `src/actions/` — importable by Server and Client Components

### Drizzle ORM + Neon
- `@neondatabase/serverless` + `drizzle-orm/neon-http` — zero cold start, edge-ready
- **Drizzle 0.44.x/0.45.x** current; ~900K weekly downloads, runs on Edge/Bun/Deno
- Core entities: books (totalCopies/availableCopies), members (membershipType), loans (status/renewedCount), fines (cents)
- Indexes on ISBN, genre, author, title; `relations()` for books↔loans↔members
- Migrations via `drizzle-kit generate` + migrate; never edit `_journal.json`

### Next.js 15 App Router
- Server Components by default — fetch data directly, no `useEffect` for initial loads
- Server Actions (`"use server"`) — always `revalidatePath()` after mutations
- Parallel fetch: `Promise.all([getBooks(), getMembers()])` avoids waterfalls; Zod + `drizzle-zod` for DB-synced validation

### Redis Caching (Upstash)
- Cache-aside: catalog TTL 5min, search TTL 2min, profiles TTL 30min
- Write-through: active loans TTL 1min (consistency-critical)
- Sliding-window rate limiting (60 req/min search, 500 req/min members)

## Cheatsheets & Quick Reference

| Task | Command |
|------|---------|
| Generate migration | `drizzle-kit generate` |
| Apply to Neon | `drizzle-kit migrate` / `db:push` |
| Drizzle Studio | `npm run db:studio` |
| Type-safe query | `db.select().from(books).where(eq(books.isbn, x))` |
| Cache read | `await redis.get(\`catalog:\${id}\`)` |

## Best Practices
1. Use query builders (`eq()`, `gt()`) — injection-safe; avoid raw SQL string interpolation
2. Project specific columns (no `select().from()` without columns) to limit payload
3. `revalidatePath()`/`revalidateTag()` after every mutation
4. Use `-pooler` Neon hostname (PgBouncer); branch per feature (copy-on-write)
5. Keep Drizzle ≥0.45.2 (CVE fix) and pin via `bun.lock`/`package-lock`
6. Use DB sessions (Drizzle adapter) over JWT for revocable sessions

## Common Pitfalls

| Area | Pitfall | Fix |
|------|---------|-----|
| Drizzle | Editing `_journal.json` | Use `drizzle-kit generate` only |
| Drizzle | `select().from()` no columns | Always project specific columns |
| Next.js | Missing revalidation | `revalidatePath()` every mutation |
| Neon | Connection exhaustion | `neon-http` driver or pooler |
| Redis | No fallback | Implement direct DB fallback |
| Redis | Stale data | Appropriate TTLs; write-through for critical data |

## Performance
- DB indexes on filtered/sorted columns; prepared statements; paginate large lists
- Server Components eliminate client waterfalls; Suspense streaming for slow data
- ISR for static catalog pages; dynamic imports for heavy components
- `neon-http` mitigates 5min-idle cold start (~500ms) on free tier
- Upstash Redis hit-rate monitoring surfaces slow queries

## Security
1. **CVE-2026-39356** (Snyk SNYK-JS-DRIZZLEORM-16000009): SQL injection via `escapeName` in `sql.identifier()`/`sql.as()` — affects `>=0.37.0 <0.45.2`. **Upgrade to drizzle-orm ≥0.45.2** immediately.
2. Query builders are injection-safe; never pass untrusted input to `sql.identifier()`
3. NextAuth/Auth.js v5 + Drizzle adapter for revocable DB sessions (Auth.js now part of Better Auth)
4. Zod validation in Server Actions; Upstash ratelimit at edge middleware
5. `next/image` + `next/font` to avoid layout shift / external font leaks

## Related Projects (in workspace)
- See `projects/RESEARCH_INDEX.md` for cross-project references (Bash, xamehi, ecom share infra).

## Resources

| Resource | URL |
|----------|-----|
| Drizzle ORM docs | https://orm.drizzle.team/docs/overview |
| Drizzle + Neon guide | https://neon.com/blog/nextjs-authentication-using-clerk-drizzle-orm-and-neon |
| Auth.js Drizzle Adapter | https://authjs.dev/getting-started/adapters/drizzle |
| CVE-2026-39356 (Snyk) | https://security.snyk.io/vuln/SNYK-JS-DRIZZLEORM-16000009 |
| Next.js Server Actions | https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions |
| Upstash Redis | https://upstash.com/docs/redis |
