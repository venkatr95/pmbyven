import { describe, it, expect, afterEach } from "vitest";
import { buildPageMetadata } from "./page-metadata";

describe("buildPageMetadata", () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = { ...env };
  });

  it("builds title, description, canonical, and OG", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://pmbyven.com";
    process.env.NEXT_PUBLIC_SITE_NAME = "pmbyven";
    process.env.ALLOW_SEARCH_INDEXING = "true";

    const meta = buildPageMetadata({
      title: "Blog",
      description: "All articles",
      path: "/blog",
    });

    expect(meta.title).toBe("Blog");
    expect(meta.description).toBe("All articles");
    expect(meta.alternates?.canonical).toBe("https://pmbyven.com/blog");
    expect(meta.openGraph?.url).toBe("https://pmbyven.com/blog");
    expect(meta.openGraph?.siteName).toBe("pmbyven");
    const twitter = meta.twitter as { card?: string } | undefined;
    expect(twitter?.card).toBe("summary_large_image");
  });

  it("supports noIndex pages", () => {
    process.env.ALLOW_SEARCH_INDEXING = "true";
    const meta = buildPageMetadata({
      title: "Private",
      description: "x",
      path: "/private",
      noIndex: true,
    });
    expect(meta.robots).toMatchObject({ index: false, follow: false });
  });
});
