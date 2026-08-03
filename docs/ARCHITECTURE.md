# Architecture

## Overview

**pmbyven** ([pmbyven.com](https://pmbyven.com)) is a **Next.js App Router** publication platform: public editorial site + secret-gated admin CMS. Content lives in **Prisma** (SQLite locally, PostgreSQL on Vercel).

```
┌─────────────────────────────────────────────────────────────┐
│                        Clients                               │
│  Browser (public)          Browser (admin cookie)            │
└────────────┬──────────────────────────┬─────────────────────┘
             │                          │
             ▼                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js App Router                         │
│  RSC pages · Server Actions · Route Handlers · MDX           │
└────────────┬──────────────────────────┬─────────────────────┘
             │                          │
             ▼                          ▼
┌────────────────────┐      ┌──────────────────────────────┐
│  Prisma Client     │      │  Client state (Zustand)      │
│  posts, tags, …    │      │  theme, reader prefs         │
└─────────┬──────────┘      └──────────────────────────────┘
          ▼
┌────────────────────┐
│  SQLite / Postgres │
└────────────────────┘
```

## Directory map

```
web/
├── .github/workflows/     # CI + deploy
├── docs/                  # This documentation
├── prisma/                # Schema + seed
├── public/                # Static assets
├── src/
│   ├── app/               # Routes (pages, layouts, API)
│   │   ├── admin/         # CMS (secret-gated layout)
│   │   ├── api/           # Search + admin JSON endpoints
│   │   ├── blog/          # Listing + [slug] article
│   │   └── …              # categories, topics, series, etc.
│   ├── components/
│   │   ├── ui/            # Design system primitives
│   │   ├── article/       # TOC, reading controls, sidebar
│   │   ├── home/          # Hero, sections, newsletter CTA
│   │   ├── layout/        # Navbar, footer
│   │   ├── newsletter/    # Subscribe form
│   │   ├── posts/         # PostCard
│   │   ├── search/        # Command palette
│   │   └── admin/         # Login, editor, row actions
│   ├── lib/               # DB, actions, utils, themes, MDX
│   ├── store/             # Zustand (reader + theme)
│   ├── generated/prisma/  # Prisma client output
│   └── test/              # Vitest setup + helpers
├── vercel.json
└── vitest.config.ts
```

## Key flows

### Article read

1. `app/blog/[slug]/page.tsx` loads post via Prisma.  
2. Increments views.  
3. Extracts headings for TOC; renders MDX.  
4. Client widgets: progress bar, bookmark, font size (Zustand).  

### Newsletter

1. Client form → `subscribeNewsletter` Server Action.  
2. Zod validates email → upserts `Subscriber`.  
3. Optional analytics event.  

### Admin

1. No public login page brand — secret form only.  
2. `loginAdmin` sets httpOnly cookie `editorial_admin` = `ADMIN_SECRET`.  
3. Layout checks cookie; Server Actions call `requireAdmin()`.  

### Search

1. Command palette / `/search` → `GET /api/search?q=`.  
2. Filters posts, categories, tags, series, authors (SQL `contains`).  

## Themes

Eight theme packs in `src/lib/themes.ts`. Client store writes CSS variables on `<html>`. Admin can persist active theme id via `ThemeConfig`.

## Testing pyramid

```
        ╱ E2E (future) ╲
       ╱  Component     ╲
      ╱   Unit / store   ╲
```

Current suite: unit + component (see [TESTING.md](./TESTING.md)).

## Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md): Vercel + GitHub Actions, Postgres for production.
