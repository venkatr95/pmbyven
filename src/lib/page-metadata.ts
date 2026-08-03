import type { Metadata } from "next";
import { getRobotsMetadata, getSiteConfig } from "@/lib/seo";

/**
 * Standard static page metadata (Metadata API).
 * Ensures title, description, canonical, OG, Twitter, and robots on every public page.
 */
export function buildPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const site = getSiteConfig();
  const url = `${site.siteUrl}${opts.path.startsWith("/") ? opts.path : `/${opts.path}`}`;
  const fullTitle = opts.title;
  const image = opts.image || `${site.siteUrl}/api/og?title=${encodeURIComponent(opts.title)}`;

  return {
    title: fullTitle,
    description: opts.description,
    robots: opts.noIndex
      ? { index: false, follow: false, nocache: true }
      : getRobotsMetadata(),
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": `${site.siteUrl}/rss.xml`,
      },
    },
    openGraph: {
      title: fullTitle,
      description: opts.description,
      url,
      siteName: site.siteName,
      locale: "en_US",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: opts.description,
      images: [{ url: image, alt: fullTitle }],
    },
    other: {
      copyright: site.copyrightNotice,
    },
  };
}
