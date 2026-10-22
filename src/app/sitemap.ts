import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { caseStudies, caseStudyPageUrl } from "@/lib/case-studies";
import { getAllBlogPosts } from "@/lib/posts";
import { getSiteConfig } from "@/lib/seo";

/**
 * Automated SEO routing — Next.js generates /sitemap.xml from this file.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl, allowIndexing } = getSiteConfig();

  // When crawl is disabled, return empty sitemap
  if (!allowIndexing) {
    return [];
  }

  const [posts, categories, tags, series, collections] = await Promise.all([
    getAllBlogPosts().catch(() => []),
    db.category.findMany({ select: { slug: true, updatedAt: true } }).catch(() => []),
    db.tag.findMany({ select: { slug: true } }).catch(() => []),
    db.series.findMany({ select: { slug: true, updatedAt: true } }).catch(() => []),
    db.collection.findMany({ select: { slug: true, updatedAt: true } }).catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/blog",
    "/categories",
    "/topics",
    "/series",
    "/collections",
    "/archive",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/copyright",
    "/license",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/blog" ? ("daily" as const) : ("weekly" as const),
    priority:
      path === ""
        ? 1
        : path === "/blog"
          ? 0.9
          : path === "/privacy" ||
              path === "/terms" ||
              path === "/copyright" ||
              path === "/license"
            ? 0.3
            : 0.7,
  }));

  const blogUrls = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...blogUrls,
    ...categories.map((c) => ({
      url: `${siteUrl}/categories/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...tags.map((t) => ({
      url: `${siteUrl}/topics/${t.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...series.map((s) => ({
      url: `${siteUrl}/series/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...collections.map((c) => ({
      url: `${siteUrl}/collections/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...caseStudies.map((study) => ({
      url: caseStudyPageUrl(study.slug),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
