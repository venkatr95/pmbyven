# SEO, crawl control, copyright & license

## Crawl / bot prevention (default)

By default the site **blocks search engines and scrapers**:

| Layer | Behavior when `ALLOW_SEARCH_INDEXING` is not `true` |
|-------|-----------------------------------------------------|
| `robots.txt` | `Disallow: /` for `*` |
| Named AI bots | Always `Disallow: /` (GPTBot, ClaudeBot, Bytespider, …) |
| Meta robots | `noindex, nofollow, noarchive, nosnippet` |
| `X-Robots-Tag` | Same via middleware + `next.config` headers |
| Sitemap | Empty list (nothing useful to crawl) |

### Enable public SEO (production launch)

```env
ALLOW_SEARCH_INDEXING=true
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Then robots.txt allows `/` (except `/admin`, `/api`, etc.), meta becomes `index, follow`, and sitemap lists pages.

---

## SEO features (Next.js App Router)

### 1. Metadata API
- **Static:** `export const metadata` on layouts/list pages  
- **Dynamic:** `generateMetadata` on `/blog/[slug]`, categories, topics, series, authors, collections  
- Title, description, Open Graph (`images` with width/height), Twitter, canonical, authors  

### 2. Core Web Vitals
- **`next/image`** via `OptimizedImage` — resize, AVIF/WebP, lazy load, LCP `priority` on hero/cover  
- **`next/font`** — Inter + Instrument Serif self-hosted (no layout shift)  
- **`next/link`** — client navigation + prefetch for crawlable internal structure  

### 3. Automated routing files
- `app/sitemap.ts` — all public URLs when indexing enabled  
- `app/robots.ts` — crawl policy + AI bot blocks  
- Domain defaults to **https://pmbyven.com**  

### 4. Rendering strategy
- **Server Components** for article HTML (zero JS for body text)  
- **`generateStaticParams`** pre-renders published post/category/tag/series/author/collection slugs  
- **`revalidate = 60`** (ISR) keeps pages fast and fresh  
- **`dynamicParams = true`** serves new slugs without rebuild  
- View counts via client `ViewTracker` → `/api/analytics/view` (does not force `force-dynamic`)  

### 5. Structured data
- Per-article JSON-LD (`Article`)  
- Site Organization + WebSite schema in root layout  
- Auto OG images via `/api/og`  
- RSS (`/rss.xml`)

---

## Copyright & license

| Resource | Purpose |
|----------|---------|
| `/copyright` | Content ownership, fair use, DMCA, permissions |
| `/license` | Content = All Rights Reserved; software = MIT |
| `LICENSE` | MIT for repository software only |
| Footer | Full copyright notice + legal links |

### Env vars

```env
NEXT_PUBLIC_SITE_NAME="pmbyven"
NEXT_PUBLIC_SITE_URL="https://pmbyven.com"
NEXT_PUBLIC_COPYRIGHT_HOLDER="pmbyven"
NEXT_PUBLIC_COPYRIGHT_YEAR="2026"
NEXT_PUBLIC_LICENSE_NAME="All Rights Reserved"
NEXT_PUBLIC_LICENSE_URL="/license"
NEXT_PUBLIC_CONTACT_EMAIL="hello@pmbyven.com"
```

**Important:** MIT covers the *codebase*, not published essays or brand assets.
