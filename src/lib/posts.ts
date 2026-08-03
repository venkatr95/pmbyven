import { db } from "@/lib/db";

export async function getPublishedPosts(opts?: {
  take?: number;
  skip?: number;
  categorySlug?: string;
  tagSlug?: string;
  seriesSlug?: string;
  authorSlug?: string;
  featured?: boolean;
  editorsPick?: boolean;
  orderBy?: "latest" | "popular" | "trending";
}) {
  const {
    take = 12,
    skip = 0,
    categorySlug,
    tagSlug,
    seriesSlug,
    authorSlug,
    featured,
    editorsPick,
    orderBy = "latest",
  } = opts || {};

  const order =
    orderBy === "popular"
      ? { views: "desc" as const }
      : orderBy === "trending"
        ? { likes: "desc" as const }
        : { publishedAt: "desc" as const };

  return db.post.findMany({
    where: {
      status: "published",
      ...(featured !== undefined ? { featured } : {}),
      ...(editorsPick !== undefined ? { editorsPick } : {}),
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(seriesSlug ? { series: { slug: seriesSlug } } : {}),
      ...(authorSlug ? { author: { slug: authorSlug } } : {}),
      ...(tagSlug ? { tags: { some: { tag: { slug: tagSlug } } } } : {}),
    },
    include: {
      author: true,
      category: true,
      series: true,
      tags: { include: { tag: true } },
    },
    orderBy: order,
    take,
    skip,
  });
}

export async function getPostBySlug(slug: string) {
  return db.post.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
      series: true,
      tags: { include: { tag: true } },
    },
  });
}

/** All published posts for SSG / sitemaps (getAllBlogPosts) */
export async function getAllBlogPosts() {
  return db.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    include: {
      author: true,
      category: true,
      series: true,
      tags: { include: { tag: true } },
    },
  });
}

/** Params for generateStaticParams on /blog/[slug] */
export async function getAllPublishedPostSlugs() {
  try {
    const posts = await db.post.findMany({
      where: { status: "published" },
      select: { slug: true },
    });
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    // Build environments without a DB return empty (dynamicParams still works)
    return [] as { slug: string }[];
  }
}

export async function getAllCategorySlugs() {
  try {
    const rows = await db.category.findMany({ select: { slug: true } });
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return [] as { slug: string }[];
  }
}

export async function getAllTagSlugs() {
  try {
    const rows = await db.tag.findMany({ select: { slug: true } });
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return [] as { slug: string }[];
  }
}

export async function getAllSeriesSlugs() {
  try {
    const rows = await db.series.findMany({ select: { slug: true } });
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return [] as { slug: string }[];
  }
}

export async function getAllAuthorSlugs() {
  try {
    const rows = await db.author.findMany({ select: { slug: true } });
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return [] as { slug: string }[];
  }
}

export async function getAllCollectionSlugs() {
  try {
    const rows = await db.collection.findMany({ select: { slug: true } });
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return [] as { slug: string }[];
  }
}

export async function getAdjacentPosts(slug: string, publishedAt: Date | null) {
  if (!publishedAt) return { prev: null, next: null };

  const [prev, next] = await Promise.all([
    db.post.findFirst({
      where: { status: "published", publishedAt: { lt: publishedAt } },
      orderBy: { publishedAt: "desc" },
      select: { title: true, slug: true },
    }),
    db.post.findFirst({
      where: { status: "published", publishedAt: { gt: publishedAt } },
      orderBy: { publishedAt: "asc" },
      select: { title: true, slug: true },
    }),
  ]);

  return { prev, next };
}

export async function getRelatedPosts(
  postId: string,
  categoryId?: string | null,
  take = 3
) {
  return db.post.findMany({
    where: {
      status: "published",
      id: { not: postId },
      ...(categoryId ? { categoryId } : {}),
    },
    include: { author: true, category: true },
    orderBy: { views: "desc" },
    take,
  });
}

export async function incrementViews(id: string) {
  return db.post.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
}

export async function getCategories() {
  return db.category.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { name: "asc" }],
    include: { _count: { select: { posts: true } } },
  });
}

export async function getTags() {
  return db.tag.findMany({ orderBy: { count: "desc" } });
}

export async function getSeriesList() {
  return db.series.findMany({
    orderBy: { order: "asc" },
    include: {
      posts: {
        where: { status: "published" },
        orderBy: { seriesOrder: "asc" },
        select: { id: true, title: true, slug: true, seriesOrder: true },
      },
    },
  });
}

export async function getHomepageData() {
  const [
    featured,
    editorsPicks,
    latest,
    trending,
    mostRead,
    categories,
    tags,
    series,
  ] = await Promise.all([
    getPublishedPosts({ featured: true, take: 1 }),
    getPublishedPosts({ editorsPick: true, take: 4 }),
    getPublishedPosts({ take: 6 }),
    getPublishedPosts({ orderBy: "trending", take: 5 }),
    getPublishedPosts({ orderBy: "popular", take: 5 }),
    getCategories(),
    getTags(),
    getSeriesList(),
  ]);

  return {
    featured: featured[0] || null,
    editorsPicks,
    latest,
    trending,
    mostRead,
    categories,
    tags,
    series,
  };
}
