# University Library JSM — Research Report

**Project:** university-libary-jsm
**Stack:** Next.js 15, Drizzle ORM, Neon (serverless PostgreSQL), Upstash Redis, NextAuth v5, ImageKit, Nodemailer, Upstash QStash
**Report Date:** 2026-07-16
**Mode:** UPDATE (trimmed to size gate)

---

## Similar Projects

| Project | URL | Why Relevant |
|---------|-----|--------------|
| Banking | `projects/Banking` | Shared Next.js + Drizzle ORM + Neon patterns |
| comicwise | `projects/comicwise` | Shared Next.js + Drizzle + Upstack Redis |
| rhixe_scans | `projects/rhixe_scans` | Shared Next.js + Prisma + auth patterns |
| university-libary-jsm | `projects/university-libary-jsm` | Self (Next.js + Drizzle reference) |

---

## Key Findings

### Next.js 15 + Drizzle ORM + Neon Serverless
- Use `@neondatabase/serverless` with `drizzle-orm/neon-http` for HTTP-based serverless connections
- `drizzle-orm/neon-serverless` for WebSocket connections in long-running processes (QStash workers)
- Drizzle + Neon HTTP driver avoids cold-start tax of TCP drivers — ideal for Vercel Edge
- Neon database branching for preview deployments (copy-on-write branches in seconds)
- Enable connection pooling via `?pooler=true` in connection string for high-concurrency operations

### Upstash Redis Caching & Rate Limiting
- `@upstash/ratelimit` — HTTP-based, connectionless, works on Vercel Edge
- Rate limit `/api/books/search` at 60 req/min per IP; member tier at 500 req/min
- Cache book search results (TTL 5min), popular books (TTL 1hr), member profiles (TTL 15min)
- Sliding window algorithm: `Ratelimit.slidingWindow(100, "60 s")` for smooth enforcement

### NextAuth v5 + Drizzle Adapter
- Official `@auth/drizzle-adapter` package for schema integration
- Database sessions recommended for library systems (revocable, auditable) vs JWT
- Pass `schema` object to `DrizzleAdapter(db, schema)` with custom table references

---

## Cheatsheets & Quick Reference

| Topic | Resource | Type |
|-------|----------|------|
| Drizzle + Neon | <https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon> | Tutorial |
| Upstash Ratelimit | <https://upstash.com/docs/redis/sdks/ratelimit-ts/overview> | Docs |
| Neon Serverless | <https://neon.tech/docs/serverless/serverless-driver> | Docs |

---

## Best Practices

1. **Drizzle + Neon HTTP driver** — connectionless, zero cold start, ideal for serverless
2. **Rate-limited API endpoints** — Upstash Redis for catalog search and auth
3. **Database sessions for library auth** — revocable, auditable; not JWT
4. **Neon branching for preview** — copy-on-write branches per deployment
5. **TanStack Query for catalog caching** — client-side cache with proper invalidation

---

## Common Pitfalls

| Pitfall | Impact | Avoidance |
|---------|--------|-----------|
| TCP driver cold start | Slow first request | `neon-http` driver for HTTP connections |
| Missing rate limiting | API abuse | Upstash ratelimit on search/auth endpoints |
| JWT sessions for library | Irrevocable tokens | Database sessions with revocation |
| Cached stale catalog | Users see outdated data | TanStack Query `staleTime` + invalidation |

---

## Performance

1. **Neon HTTP driver** — zero cold start for serverless Edge Functions
2. **Upstash Redis caching** — sub-ms lookup for catalog and session data
3. **Neon connection pooling** — handle high-concurrency loan operations
4. **TanStack Query prefetch** — prefetch next search results in background
5. **ImageKit CDN** — optimized book cover image delivery

---

## Security

1. **Rate limit search endpoints** — prevent API abuse; sliding window per IP
2. **Database sessions** — revocable, auditable library member authentication
3. **Signed media URLs** — ImageKit secure URL tokens for member-only content
4. **Input validation** — Zod schemas for all API inputs
5. **Environment-specific secrets** — separate keys for dev/staging/production

---

## Related Projects (in workspace)

- **Banking** — shared Next.js + Drizzle ORM + Neon patterns
- **comicwise** — shared Next.js + Drizzle + Upstash Redis patterns
- **rhixe_scans** — shared Next.js + Prisma + auth patterns

---

## Resources

| Resource | URL | Description |
|----------|-----|-------------|
| Drizzle + Next.js | <https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon> | Integration tutorial |
| Upstash Redis | <https://upstash.com/docs/redis/overall/getstarted> | Serverless Redis |
| Neon Serverless | <https://neon.tech/docs> | Serverless PostgreSQL |
| Auth.js Drizzle | <https://authjs.dev/reference/drizzle-adapter> | Auth adapter |

### Research Methodology
- **Web search:** web_search (2026 Drizzle + Neon patterns)
- **Documentation:** web_extract (Upstash, Neon, Drizzle docs)
- **Database research:** serverless PostgreSQL connection patterns
- **Last verified:** 2026-07-16
