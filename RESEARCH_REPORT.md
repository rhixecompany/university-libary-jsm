# RESEARCH_REPORT.md

## Project: university-libary-jsm

**Type:** University library management system
**Tech Stack:** Next.js 15, TypeScript strict, App Router, Drizzle ORM, Neon serverless PostgreSQL, NextAuth.js, Redis (Upstash), ImageKit, Vercel + Neon
**Status:** Active

---

## Similar Projects

| Project | URL | Why Relevant |
|---------|-----|--------------|
| Banking | `projects/Banking` | shared Next.js + Drizzle + Neon + NextAuth |
| rhixe_scans | `projects/rhixe_scans` | shared Next.js + Prisma + PostgreSQL catalog |
| comicwise | `projects/comicwise` | shared Next.js 15 + NextAuth v5; Redis realtime |
| rhixecompany-comics | `projects/rhixecompany-comics` | serverless Postgres + Redis infra |

---

## Key Findings

### Drizzle ORM + Neon
- Drizzle ~7KB bundle vs Prisma 7's ~1.6MB; SQL-like `select().from().where()`
- No `generate` step — schema is plain TypeScript with full autocomplete
- `@neondatabase/serverless` with `fetchConnectionCache = true` for connection reuse

### Drizzle Migrations (2026)
- `push` for dev (auto-ALTER); `generate` + `migrate` for production (versioned SQL)
- Team workflow: generate SQL, commit to git, apply via migrate in CI/CD

### Redis (2026)
- Upstash Redis: HTTP REST API, zero cold starts, global replication
- Sliding window rate limiting: 100 req/min per IP for catalog reads
- Cache summaries 60s with `SET NX/EX` — reduces Drizzle SELECTs ~80%

### NextAuth.js + Neon (2026)
- Official `@auth/neon-adapter`; Pool inside request handler (never global)
- Strategies: JWT (stateless) or database (persistent) via Neon adapter
- Rotate `NEXTAUTH_SECRET` every 90 days; Vercel encrypted env

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

1. **Pooled Neon connection** — `pooler.neon.tech` prevents exhaustion
2. **Trigram indexes** on lowercase title/author for fuzzy search
3. **Rate-limit catalog reads** — 100 req/min per IP via Upstash
4. **`generate` + `migrate` for production** — never `push` to production DB
5. **Cache summaries 60s** in Redis — reduces Drizzle SELECTs ~80%

---

## Common Pitfalls

| Pitfall | Impact | Avoidance |
|---------|--------|-----------|
| Neon connection exhaustion | Latency spikes, 500s | Pooled connection string; cache tags |
| `push` on production | Unversioned schema, no rollback | `generate` + `migrate` for prod |
| NextAuth Pool outside handler | Connection leaks | Create Pool inside request handler |
| Missing `NEXTAUTH_SECRET` rotation | Session forgery risk | Rotate every 90 days |

---

## Performance

1. **Cache summaries 60s** in Redis — reduces Drizzle SELECTs ~80%
2. **Prefetch related branches** with Drizzle relation queries
3. **Pooled Neon connection** prevents cold-start exhaustion in serverless
4. **Trigram indexes** on title/author for fast fuzzy search
5. **Drizzle projections** — only fetch needed columns; avoid `select *`

---

## Security

1. **Rotate `NEXTAUTH_SECRET` every 90 days** — never in client bundles
2. **Never trust query params** for borrow approvals — enforce server-side
3. **Rate-limit catalog reads** (100 req/min per IP) via Upstash Redis
4. **Validate all input with Zod** before Drizzle writes
5. **`@neondatabase/serverless` over raw TCP** — prevents log leaks

---

## Related Projects (in workspace)

- **Banking** — shared Next.js + Drizzle + Neon; fintech security patterns
- **rhixe_scans** — shared Next.js 15 catalog; search/filter UX for library
- **comicwise** — shared Next.js 15 + NextAuth v5; Redis realtime
- **rhixecompany-comics** — serverless Postgres + Redis infra

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
