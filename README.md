# pmbyven

> A premium publication platform at **[pmbyven.com](https://pmbyven.com)** — *if Apple designed Medium*.

World-class editorial site + secret-gated CMS. Inspired by newsletter reading experiences with Apple Vision Pro glass aesthetics, multi-theme design system, and full admin tooling.

**Package:** `pmbyven` · **Domain:** `https://pmbyven.com`

---

## Quick start

```bash
# Prerequisites: Node.js 20+ (22 recommended), npm 10+
cp .env.example .env
npm ci
npm run db:setup    # Prisma schema + demo seed
npm run dev         # http://localhost:3000
```

| Surface | URL | Notes |
|---------|-----|--------|
| Production | https://pmbyven.com | Live domain |
| Local | http://localhost:3000 | Dev server |
| Admin | /admin | Secret: `pmbyven-admin-2026` (default in `.env`) |
| Search | `⌘K` / `Ctrl+K` | Command palette |

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15+ (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, glass utilities, Framer Motion |
| UI | shadcn-style Radix primitives, Lucide icons |
| Data | Prisma 7, SQLite (local) / PostgreSQL (Vercel) |
| Content | MDX via `next-mdx-remote`, remark-gfm |
| Client state | Zustand (theme, reader prefs) |
| Forms / validation | React Hook Form patterns, Zod, Server Actions |
| Data fetching | TanStack Query (client), RSC + Server Actions |
| Tests | Vitest, Testing Library, jsdom |
| Deploy | Vercel + GitHub Actions CI/CD |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build (`prisma generate` + Next) |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm run test` | Vitest watch mode |
| `npm run test:run` | Vitest single run |
| `npm run test:ci` | CI tests with coverage |
| `npm run db:setup` | `db push` + seed |
| `npm run db:seed` | Re-seed demo data |
| `npm run ci` | Lint + typecheck + test + build |

---

## Environment

Copy `.env.example` → `.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
ADMIN_SECRET="change-me-to-a-strong-secret"
NEXT_PUBLIC_SITE_NAME="pmbyven"
NEXT_PUBLIC_SITE_URL="https://pmbyven.com"
NEXT_PUBLIC_SITE_DESCRIPTION="A premium publication platform"
NEXT_PUBLIC_CONTACT_EMAIL="hello@pmbyven.com"
NEXT_PUBLIC_COPYRIGHT_HOLDER="pmbyven"
ALLOW_SEARCH_INDEXING=false
```

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Prisma connection (SQLite file or Postgres URL) |
| `ADMIN_SECRET` | Cookie value that unlocks `/admin` |
| `NEXT_PUBLIC_SITE_*` | Branding + canonical URLs for SEO/RSS |
| `ALLOW_SEARCH_INDEXING` | `true` only when ready for public search |

For Production, Turso is used as the database. ( see docs/TURSO.md )

---

## Documentation

| Doc | Contents |
|-----|----------|
| [docs/PRD-COMPLETION.md](./docs/PRD-COMPLETION.md) | Full PRD checklist |
| [docs/SEO.md](./docs/SEO.md) | SEO, bot blocking, copyright & license |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Vercel deploy + CI/CD |
| [docs/TESTING.md](./docs/TESTING.md) | Vitest setup |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design |
| [docs/OPTIONAL.md](./docs/OPTIONAL.md) | AI, integrations, pins |
| [prd.txt](./prd.txt) | Original product requirements |

---

## Deploy to Vercel

1. Import this repo on Vercel  
2. Set env: `DATABASE_URL` (Postgres), `ADMIN_SECRET`, `NEXT_PUBLIC_SITE_URL=https://pmbyven.com`, etc.  
3. Attach custom domain **pmbyven.com**  
4. Push to `main`  

Full guide: **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)**.

---

## Admin access

1. Open `/admin`.  
2. Enter `ADMIN_SECRET` (default local: `pmbyven-admin-2026`).  
3. Cookie lasts 7 days (httpOnly).  

Never commit production secrets.

---

## License

Software: MIT (see [LICENSE](./LICENSE)).  
Content on pmbyven.com: All Rights Reserved (see [/copyright](/copyright) and [/license](/license)).
