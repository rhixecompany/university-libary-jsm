# Developer Guide

## Prerequisites

- Node.js 18 or higher
- npm or pnpm
- Git

## Setup

### 1. Clone and Install

```bash
git clone https://github.com/rhixecompany/university-libary-jsm.git
cd university-libary-jsm
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database (Neon)
DATABASE_URL=postgres://user:pass@host.neon.tech/db?sslmode=require

# NextAuth
NEXTAUTH_SECRET=your-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# ImageKit
NEXT_PUBLIC_IMAGEKIT_URL=https://xxxx.imagekit.io
IMAGEKIT_PUBLIC_KEY=xxx
IMAGEKIT_PRIVATE_KEY=xxx

# Email (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
```

### 3. Database Setup

```bash
# Push schema to database
npm run db:push

# Generate migration files
npm run db:generate

# Seed with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Drizzle Studio |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (sign-in, sign-up)
│   ├── (root)/            # Authenticated user routes
│   ├── admin/             # Admin panel
│   └── api/               # API endpoints
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── admin/            # Admin components
│   └── *.tsx             # Feature components
├── lib/
│   ├── actions/          # Server Actions
│   ├── queries/          # Database queries
│   └── utils.ts          # Utility functions
├── database/
│   ├── schema.ts         # Drizzle schema
│   └── seed.ts           # Database seeder
└── emails/               # React Email templates
```

## Code Style

- TypeScript strict mode enabled
- ESLint + Prettier for code quality
- Use Server Components by default
- Client components only with `'use client'`
- Follow shadcn/ui component patterns

## Database

### Schema

The database schema is defined in `database/schema.ts` using Drizzle ORM. Key tables:
- `users` - Library members
- `books` - Book catalog
- `borrowRecords` - Borrowing history

### Migrations

```bash
# Create new migration
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# Push schema (dev only)
npx drizzle-kit push
```

### Queries

Use functions from `lib/queries/` for database operations:
- `select.ts` - Read operations
- `insert.ts` - Create operations
- `update.ts` - Update operations
- `delete.ts` - Delete operations

## Server Actions

Use Server Actions in `lib/actions/` for mutations:
- Keep actions small and focused
- Validate input with Zod
- Return meaningful errors
- Use `useFormState` for form handling

## Testing

Run lint and type checks:

```bash
npm run lint
```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check Neon SSL configuration
- Ensure IP is allowlisted in Neon

### Rate Limiting Errors
- Verify Upstash credentials
- Check Redis quota in Upstash dashboard

### Email Not Sending
- Verify SMTP configuration
- Check app email settings
- Use Mailtrap for development