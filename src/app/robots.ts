import type { MetadataRoute } from "next";
import { BLOCKED_BOT_AGENTS, getSiteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const { siteUrl, allowIndexing } = getSiteConfig();

  // Always block admin, APIs, and internal paths
  const privatePaths = [
    "/admin/",
    "/api/",
    "/_next/",
    "/uploads/",
    "/reading-list",
    "/search",
  ];

  // Named AI / scraper bots — always disallowed
  const aiBotRules = BLOCKED_BOT_AGENTS.map((userAgent) => ({
    userAgent,
    disallow: ["/"],
  }));

  if (!allowIndexing) {
    // Full crawl block (default / private / staging)
    return {
      rules: [
        {
          userAgent: "*",
          disallow: ["/"],
        },
        ...aiBotRules,
      ],
      // Intentionally omit sitemap when not indexing
      host: siteUrl,
    };
  }

  // Public indexing mode
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
      ...aiBotRules,
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
