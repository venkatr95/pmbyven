# Deployment guide — Vercel + CI/CD

This document covers deploying **pmbyven** ([pmbyven.com](https://pmbyven.com)) to [Vercel](https://vercel.com) and wiring a GitHub Actions quality + deploy pipeline.

---

## Architecture notes for serverless

| Concern | Local | Production (Vercel) |
|---------|--------|---------------------|
| Runtime | Node (Next.js) | Vercel Serverless / Fluid |
| Database | SQLite (`prisma/dev.db`) + `better-sqlite3` | **[Turso](https://turso.tech)** (serverless libSQL, SQLite-compatible) |
| Admin auth | Cookie + `ADMIN_SECRET` | Same — set strong secret in Vercel env |
| File uploads | URL-based media library | Use remote URLs (S3/Cloudinary) or Vercel Blob |

**Important:** `better-sqlite3` is a native module and **does not run on Vercel**. Production uses Turso instead — same Prisma schema (`provider = "sqlite"`), just a different adapter and connection URL. See [docs/TURSO.md](./TURSO.md) for full setup.

---

## 1. One-time Vercel project setup

### Option A — Dashboard (recommended for first deploy)

1. Push this repo to GitHub (if not already).
2. Go to [vercel.com/new](https://vercel.com/new) → **Import** the repository.
3. Configure the project:
   - **Framework Preset:** Next.js  
   - **Root Directory:** `web` if the monorepo root is `pmbyven`, otherwise leave blank when the repo *is* `web`.  
   - **Build Command:** `prisma generate && prisma db push && next build`  
   - **Install Command:** `npm ci`  
   - **Output:** default (Next.js)
4. Add environment variables (see below).
5. Deploy.

### Option B — Vercel CLI

```bash
cd web
npm i -g vercel
vercel login
vercel link          # creates .vercel/project.json
vercel env pull      # optional: pull envs locally
vercel               # preview
vercel --prod        # production
```

`vercel.json` in this repo already sets framework, build, install, security headers, and region.

---

## 2. Production database (Turso)

Full setup, migration workflow, and troubleshooting: **[docs/TURSO.md](./TURSO.md)**.

Quick version:

1. `turso db create pmbyven` and grab the URL + auth token.
2. Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` on Vercel (Production +
   Preview). Leave `DATABASE_URL` unset in production — it's only the local
   SQLite-file fallback.
3. The Prisma schema stays `provider = "sqlite"` — no schema changes needed.
   [src/lib/db.ts](../src/lib/db.ts) and [prisma.config.ts](../prisma.config.ts)
   both switch to the Turso adapter automatically whenever
   `TURSO_DATABASE_URL` is present.
4. The Vercel **buildCommand** (`prisma generate && prisma db push && next build`)
   pushes schema changes to Turso on every deploy, same as it did for the
   local SQLite file.

---

## 3. Environment variables (Vercel)

In **Project → Settings → Environment Variables**, set for Production + Preview:

| Name | Example | Required |
|------|---------|----------|
| `TURSO_DATABASE_URL` | `libsql://pmbyven-yourorg.turso.io` | Yes |
| `TURSO_AUTH_TOKEN` | (token from `turso db tokens create`) | Yes |
| `ADMIN_SECRET` | long random string | Yes |
| `NEXT_PUBLIC_SITE_NAME` | `pmbyven` | Yes |
| `NEXT_PUBLIC_SITE_URL` | `https://pmbyven.com` | Yes |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | tagline | Recommended |

Generate a secret:

```bash
openssl rand -base64 32
```

After first deploy, update `NEXT_PUBLIC_SITE_URL` to your custom domain.

---

## 4. GitHub Actions CI/CD

Workflows live under `.github/workflows/`:

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | push/PR to main | Lint, typecheck, unit tests, production build |
| `deploy.yml` | PR → preview; push to main → production | Quality gate then Vercel deploy via CLI |

### CI only (always free)

No secrets required for `ci.yml` beyond the repo. It uses a temporary SQLite file for Prisma generate + build.

### Deploy workflow secrets

If you enable `deploy.yml`, add these **GitHub repository secrets**:

| Secret | How to get it |
|--------|----------------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | `.vercel/project.json` → `orgId` after `vercel link` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` → `projectId` |

Also create GitHub **Environments** named `preview` and `production` (optional protection rules for production).

### Dual deploy modes

1. **Vercel Git integration** (default): every push auto-builds on Vercel. Use `ci.yml` as a required status check before merge.
2. **Actions-driven deploy**: disable Vercel auto-deploy for production and let `deploy.yml` ship only after tests pass.

In Vercel: **Project → Settings → Git → Ignored Build Step** or turn off automatic production deploys if you only want Actions.

---

## 5. Branch protection (recommended)

In GitHub → **Settings → Branches → Branch protection rules** for `main`:

- Require pull request reviews  
- Require status checks: `Lint · Typecheck · Test`, `Production build`  
- Do not allow bypassing  

---

## 6. Custom domain

1. Vercel → Project → **Domains** → add `www.example.com`  
2. Update DNS as instructed  
3. Set `NEXT_PUBLIC_SITE_URL=https://www.example.com`  
4. Redeploy  

---

## 7. Post-deploy checklist

- [ ] Homepage loads with seeded or real content  
- [ ] `/blog/[slug]` article + TOC works  
- [ ] `/admin` accepts `ADMIN_SECRET`  
- [ ] Newsletter subscribe writes to DB  
- [ ] `/rss.xml` and `/sitemap.xml` return 200  
- [ ] Theme switcher persists (localStorage)  
- [ ] Search `⌘K` returns results  
- [ ] Lighthouse / Core Web Vitals acceptable  

---

## 8. Rollback

- Vercel dashboard → **Deployments** → promote a previous production deployment  
- Or: `vercel rollback` (CLI)  

---

## 9. Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on `better-sqlite3` | It shouldn't run at all in prod — confirm `TURSO_DATABASE_URL` is set so `db.ts` picks the Turso adapter instead. See [docs/TURSO.md](./TURSO.md). |
| Prisma Client not found | Ensure `postinstall` / `prisma generate` runs in build |
| Admin always unauthorized | `ADMIN_SECRET` mismatch; cookies need HTTPS in production |
| Empty site | Run seed or create posts in admin |
| Preview env missing DB | Set `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` for the Preview environment in Vercel too, not just Production |

---

## 10. Minimal “happy path” commands

```bash
# Local
cd web
cp .env.example .env
npm ci
npm run db:setup
npm run dev

# Tests
npm run test
npm run test:ci

# Production-like build
npm run build
npm start

# Ship
git push origin main   # CI + Vercel
```
