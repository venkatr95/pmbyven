import { db } from "@/lib/db";

/**
 * Trending / popular-this-week scoring.
 * score = views_weight * recency_decay + likes_boost + share_boost + event_boost
 */
export async function getPopularThisWeek(take = 5) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [posts, events] = await Promise.all([
    db.post.findMany({
      where: {
        status: "published",
        publishedAt: { not: null },
      },
      include: { author: true, category: true },
      take: 50,
      orderBy: { views: "desc" },
    }),
    db.analyticsEvent.findMany({
      where: {
        createdAt: { gte: weekAgo },
        type: { in: ["pageview", "like", "share", "subscribe"] },
      },
      select: { postId: true, type: true },
    }),
  ]);

  const eventBoost = new Map<string, number>();
  for (const e of events) {
    if (!e.postId) continue;
    const w = e.type === "share" ? 5 : e.type === "like" ? 3 : e.type === "subscribe" ? 4 : 1;
    eventBoost.set(e.postId, (eventBoost.get(e.postId) || 0) + w);
  }

  const now = Date.now();
  const scored = posts.map((p) => {
    const ageDays = p.publishedAt
      ? Math.max(0, (now - p.publishedAt.getTime()) / 86_400_000)
      : 30;
    // Half-life ~14 days
    const recency = Math.exp(-ageDays / 14);
    const recentPublish = p.publishedAt && p.publishedAt >= weekAgo ? 1.5 : 1;
    const score =
      (p.views * 0.01 + p.likes * 2 + p.shares * 3 + (eventBoost.get(p.id) || 0)) *
      recency *
      recentPublish;
    return { post: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, take).map((s) => s.post);
}

export async function getPinnedArticles(take = 4) {
  return db.post.findMany({
    where: { status: "published", pinned: true },
    include: { author: true, category: true },
    orderBy: { publishedAt: "desc" },
    take,
  });
}
