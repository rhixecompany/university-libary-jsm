# RESEARCH_REPORT.md

## Project: university-libary-jsm

**Type:** Library management system
**Tech Stack:** Next.js 15, TypeScript, React 19, Drizzle ORM 0.44, Neon (serverless PostgreSQL), Upstash Redis, NextAuth v5, ImageKit, Nodemailer, Upstash QStash
**Status:** Active

---

## Similar Projects

| Project | Relevance |
|---------|-----------|
| Banking | Shared Next.js + Drizzle ORM + Neon + auth patterns |
| comicwise | Shared Next.js + Drizzle ORM + Upstash Redis patterns |
| rhixe_scans | Shared Next.js + Prisma + auth + media patterns |

---

## Key Findings

### Next.js 15 + Drizzle ORM + Neon (2026)
- **Neon HTTP driver** — `@neondatabase/serverless` + `drizzle-orm/neon-http`; zero cold start
- **Neon WebSocket driver** — for long-running QStash workers via `drizzle-orm/neon-serverless`
- **Neon branching** — copy-on-write branches per preview deployment (seconds)
- **Connection pooling** — pooled strings (`?pooler=true`) for app; direct for migrations
- **Drizzle ~55KB bundle** — smallest serverless ORM; prepared statements for hot paths

### Upstash Redis Caching & Rate Limiting
- `@upstash/ratelimit` — HTTP-based, connectionless, works on Vercel Edge
- Rate limit catalog search: 60 req/min per IP; member tier 500 req/min
- **Sliding window** — `Ratelimit.slidingWindow(100, "60 s")` for smooth enforcement

### NextAuth v5 + Drizzle Adapter 2026
- Official `@auth/drizzle-adapter` — pass custom table references for full control
- **Database sessions** recommended for library systems — revocable, auditable
- **Auth.js v5 stable** (since 2025) — clean config split: server/client APIs
- **Credentials caveat** — known issue with database session strategy (orphaned tokens)

---

## Cheatsheets

| Topic | Resource |
|-------|----------|
| Drizzle + Next.js + Neon | <https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon> |
| Upstash Ratelimit | <https://upstash.com/docs/redis/sdks/ratelimit-ts/overview> |
| Neon Serverless | <https://neon.tech/docs/serverless/serverless-driver> |
| Auth.js Drizzle Adapter | <https://authjs.dev/reference/drizzle-adapter> |

---

## Best Practices

1. **Drizzle + Neon HTTP driver** — connectionless, zero cold start, ideal for Vercel Edge
2. **Rate-limited API endpoints** — Upstash Redis for catalog search and auth endpoints
3. **Database sessions for library auth** — revocable, auditable; not JWT for library systems
4. **Neon branching for preview** — copy-on-write branches per deployment
5. **TanStack Query for catalog caching** — client-side cache with `staleTime` and invalidation
6. **Separate connection strings** — pooled URL for app, direct URL for DB migrations

---

## Common Pitfalls

| Pitfall | Impact | Avoidance |
|---------|--------|-----------|
| TCP driver cold start | Slow first request | Use `neon-http` driver for HTTP connections |
| Missing rate limiting | API abuse | Upstash ratelimit on search/auth endpoints |
| JWT sessions for library | Irrevocable tokens | Database sessions with revocation |
| Cached stale catalog | Users see outdated data | TanStack Query `staleTime` + invalidation |
| `db push` in production | Lost migration audit | Use `generate` + `migrate` in production |

---

## Performance

1. **Neon HTTP driver** — zero cold start for serverless Edge Functions
2. **Upstash Redis caching** — sub-ms lookup for catalog and session data
3. **Neon connection pooling** — handle high-concurrency loan operations
4. **TanStack Query prefetch** — prefetch next search results in background
5. **ImageKit CDN** — optimized book cover image delivery with signed URLs
6. **Drizzle prepared statements** — precompile high-frequency queries

---

## Security

1. **Rate limit search endpoints** — sliding window per IP; prevent API abuse
2. **Database sessions** — revocable, auditable library member authentication
3. **Signed media URLs** — ImageKit secure URL tokens for member-only content
4. **Input validation** — Zod schemas for all API inputs
5. **Environment-specific secrets** — separate keys per environment; monitor May 2026 Next.js security release (13 patches)

---

## Related Projects (in workspace)

- **Banking** — shared Next.js + Drizzle ORM + Neon patterns; fintech security conventions
- **comicwise** — shared Next.js + Drizzle ORM + Upstash Redis patterns; Drizzle migration patterns
- **rhixe_scans** — shared Next.js + Prisma + auth patterns; media delivery reference

---

## Resources

| Resource | URL |
|----------|-----|
| Drizzle + Next.js Tutorial | <https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon> |
| Upstash Redis | <https://upstash.com/docs/redis/overall/getstarted> |
| Neon Serverless | <https://neon.tech/docs> |
| Auth.js Drizzle Adapter | <https://authjs.dev/reference/drizzle-adapter> |
| ImageKit | <https://docs.imagekit.io> |

### Research Methodology
- **Web search:** Tavily (2026 Drizzle+Neon, Upstash, Auth.js)
- **Last verified:** 2026-07-28
