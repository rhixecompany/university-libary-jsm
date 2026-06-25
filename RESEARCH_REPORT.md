# RESEARCH_REPORT.md

## Project: university-libary-jsm

**Type:** Library management system
**Tech Stack:** Next.js 15, TypeScript strict, App Router, Drizzle ORM, Neon serverless PostgreSQL, NextAuth.js, Redis (sessions/rate limiting), Vercel + Neon
**Status:** Active

---

## Similar Projects

| Project | URL | Why Relevant |
|---------|-----|--------------|
| Banking | `projects/Banking` | Shared Next.js 16 + Drizzle + Neon + NextAuth |
| rhixe_scans | `projects/rhixe_scans` | Shared Next.js 15 catalog + media flow; search UX |
| comicwise | `projects/comicwise` | Shared Next.js 15 + NextAuth v5; Redis realtime |
| rhixecompany-comics | `projects/rhixecompany-comics` | Serverless Postgres + Redis infra patterns |

---

## Key Findings

### Drizzle ORM + Neon
- Drizzle ~7KB bundle vs Prisma 7's ~1.6MB; SQL-like `select().from().where()`
- No `generate` step — schema is plain TypeScript with full autocomplete
- `@neondatabase/serverless` with `fetchConnectionCache = true` for connection reuse

### Drizzle Migrations (2026)
- `push` for dev (auto-ALTER); `generate`+`migrate` for production (versioned SQL)
- Team workflow: generate SQL, commit to git, apply via migrate in CI/CD

### Redis (2026)
- Upstash Redis: HTTP REST API, zero cold starts, global replication
- Sliding window rate limiting: 100 req/min per IP for catalog reads
- Cache summaries 60s with `SET NX/EX` — reduces Drizzle SELECTs ~80%

### NextAuth.js + Neon (2026)
- Official `@auth/neon-adapter`; Pool inside request handler (never global)
- Strategies: JWT (stateless) or database (persistent) via Neon adapter
- Rotate `NEXTAUTH_SECRET` every 90 days; Vercel encrypted env

### Vercel + Neon (2026)
- Vercel sunset Postgres (Q4 2024); auto-migrated to Neon
- First-party Marketplace integration; `VERCEL_POSTGRES_URL` auto-injected
- Neon branch-based preview deploys with isolated DBs

---

## Cheatsheets & Quick Reference

| Topic | Resource | Type |
|-------|----------|------|
| Next.js 15 | https://nextjs.org/docs | Docs |
| Drizzle ORM | https://orm.drizzle.dev | Docs |
| Neon | https://neon.com/docs | Docs |
| Upstash Redis | https://docs.upstash.com/redis | Docs |
| Auth.js Neon | https://authjs.dev/getting-started/adapters/neon | Docs |
| Drizzle Migrations | https://orm.drizzle.team/docs/migrations | Guide |

---

## Best Practices

1. **Pooled Neon connection** — `pooler.neon.tech` prevents connection exhaustion
2. **Trigram indexes** on lowercase title/author for fuzzy search
3. **Rate-limit catalog reads** — 100 req/min per IP via Upstash
4. **`generate`+`migrate` for production** — never `push` to production DB
5. **Cache summaries 60s** in Redis — reduces Drizzle SELECTs ~80%

---

## Common Pitfalls

| Pitfall | Impact | Avoidance |
|---------|--------|-----------|
| Neon connection exhaustion | Latency spikes, 500s during enrollment | Pooled connection string; cache tags for round trips |
| `drizzle-kit push` on production | Unversioned schema, no rollback | `generate`+`migrate` for prod; `push` for dev only |
| NextAuth Pool outside handler | Connection leaks, memory growth | Create Pool inside request handler per Neon adapter docs |
| Missing `NEXTAUTH_SECRET` rotation | Session forgery risk | Rotate every 90 days; store in Vercel encrypted env |

---

## Performance

1. **Cache summaries 60s** in Redis — reduces Drizzle SELECTs ~80%
2. **Prefetch related branches** with Drizzle relation queries
3. **Pooled Neon connection** prevents cold-start exhaustion in serverless
4. **Trigram indexes** on title/author for fast fuzzy search
5. **Drizzle projections** — only fetch needed columns; avoid `select *`

---

## Security

1. **Rotate `NEXTAUTH_SECRET` every 90 days** — never in client bundles; Vercel encrypted env
2. **Never trust query params** for borrow approvals — enforce eligibility server-side
3. **Rate-limit catalog reads** (100 req/min per IP) via Upstash Redis
4. **Validate all input with Zod** before Drizzle writes; parameterized queries
5. **`@neondatabase/serverless` over raw TCP** — prevents leaks in edge logs

---

## Related Projects (in workspace)

- **Banking** — Shared Next.js + Drizzle + Neon + NextAuth; fintech security
- **rhixe_scans** — Shared Next.js 15 catalog; search/filter UX for library
- **comicwise** — Shared Next.js 15 + NextAuth v5; Redis realtime patterns
- **rhixecompany-comics** — Serverless Postgres + Redis infra patterns

---

## Resources

| Resource | URL | Description |
|----------|-----|-------------|
| Next.js 15 | https://nextjs.org/docs | Framework docs |
| Drizzle ORM | https://orm.drizzle.dev | TypeScript ORM |
| Neon | https://neon.com/docs | Serverless Postgres |
| Upstash Redis | https://docs.upstash.com/redis | Serverless Redis |
| Auth.js Neon | https://authjs.dev/getting-started/adapters/neon | Neon auth adapter |
| Drizzle Migrations | https://orm.drizzle.team/docs/migrations | Migration guide |
