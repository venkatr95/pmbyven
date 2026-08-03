/**
 * Central SEO & crawl-control configuration.
 *
 * ALLOW_SEARCH_INDEXING=true  → public indexing (production publish)
 * ALLOW_SEARCH_INDEXING=false → block crawlers/bots (default for private/staging)
 */

export function getSiteConfig() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "pmbyven";
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://pmbyven.com").replace(
    /\/$/,
    ""
  );
  const siteDesc =
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "A premium publication platform — if Apple designed Medium.";
  const copyrightHolder =
    process.env.NEXT_PUBLIC_COPYRIGHT_HOLDER || siteName;
  const copyrightYear = process.env.NEXT_PUBLIC_COPYRIGHT_YEAR || String(new Date().getFullYear());
  const licenseName = process.env.NEXT_PUBLIC_LICENSE_NAME || "All Rights Reserved";
  const licenseUrl = process.env.NEXT_PUBLIC_LICENSE_URL || "/license";
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@pmbyven.com";
  const allowIndexing = process.env.ALLOW_SEARCH_INDEXING === "true";

  return {
    siteName,
    siteUrl,
    siteDesc,
    copyrightHolder,
    copyrightYear,
    licenseName,
    licenseUrl,
    contactEmail,
    allowIndexing,
    copyrightNotice: `© ${copyrightYear} ${copyrightHolder}. ${licenseName}.`,
  };
}

/** Meta robots for Next.js Metadata API */
export function getRobotsMetadata() {
  const { allowIndexing } = getSiteConfig();
  if (allowIndexing) {
    return {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    };
  }
  return {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      noarchive: true,
      nosnippet: true,
    },
  };
}

/** X-Robots-Tag HTTP header value */
export function getXRobotsTag(): string {
  const { allowIndexing } = getSiteConfig();
  if (allowIndexing) {
    return "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  }
  return "noindex, nofollow, noarchive, nosnippet, noimageindex, nocache";
}

/** Known aggressive scrapers / AI training bots */
export const BLOCKED_BOT_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "CCBot",
  "anthropic-ai",
  "Claude-Web",
  "ClaudeBot",
  "Google-Extended",
  "Bytespider",
  "PetalBot",
  "PerplexityBot",
  "Applebot-Extended",
  "cohere-ai",
  "Diffbot",
  "FacebookBot",
  "meta-externalagent",
  "ImagesiftBot",
  "Omgilibot",
  "Omgili",
  "Diffbot",
  "YouBot",
  "Timpibot",
  "Webzio-Extended",
  "Amazonbot",
  "AI2Bot",
  "FriendlyCrawler",
  "img2dataset",
  "Scrapy",
  "magpie-crawler",
  "DataForSeoBot",
  "SemrushBot",
  "AhrefsBot",
  "MJ12bot",
  "DotBot",
  "BLEXBot",
  "MauiBot",
];
