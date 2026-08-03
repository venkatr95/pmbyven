import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().toLowerCase();

  if (!q) {
    const recent = await db.post.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 8,
      include: { category: true },
    });
    return NextResponse.json({
      results: recent.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        type: "post" as const,
        excerpt: p.excerpt || undefined,
        category: p.category?.name,
      })),
    });
  }

  const [posts, categories, tags, series, authors] = await Promise.all([
    db.post.findMany({
      where: {
        status: "published",
        OR: [
          { title: { contains: q } },
          { excerpt: { contains: q } },
          { content: { contains: q } },
        ],
      },
      take: 12,
      include: { category: true, author: true },
      orderBy: { views: "desc" },
    }),
    db.category.findMany({
      where: {
        OR: [{ name: { contains: q } }, { description: { contains: q } }],
      },
      take: 5,
    }),
    db.tag.findMany({
      where: { name: { contains: q } },
      take: 5,
    }),
    db.series.findMany({
      where: {
        OR: [{ title: { contains: q } }, { description: { contains: q } }],
      },
      take: 5,
    }),
    db.author.findMany({
      where: {
        OR: [{ name: { contains: q } }, { bio: { contains: q } }],
      },
      take: 5,
    }),
  ]);

  const results = [
    ...posts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      type: "post" as const,
      excerpt: p.excerpt || undefined,
      category: p.category?.name,
    })),
    ...categories.map((c) => ({
      id: c.id,
      title: c.name,
      slug: c.slug,
      type: "category" as const,
      excerpt: c.description || undefined,
    })),
    ...tags.map((t) => ({
      id: t.id,
      title: t.name,
      slug: t.slug,
      type: "tag" as const,
    })),
    ...series.map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      type: "series" as const,
      excerpt: s.description || undefined,
    })),
    ...authors.map((a) => ({
      id: a.id,
      title: a.name,
      slug: a.slug,
      type: "author" as const,
      excerpt: a.bio || undefined,
    })),
  ];

  return NextResponse.json({ results });
}
