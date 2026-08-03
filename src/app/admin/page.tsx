import Link from "next/link";
import { db } from "@/lib/db";
import { formatNumber, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    postCount,
    publishedCount,
    draftCount,
    trashCount,
    subscriberCount,
    mediaCount,
    totalViews,
    recentPosts,
    recentSubs,
    events,
  ] = await Promise.all([
    db.post.count(),
    db.post.count({ where: { status: "published" } }),
    db.post.count({ where: { status: "draft" } }),
    db.post.count({ where: { status: "trash" } }),
    db.subscriber.count({ where: { status: "active" } }),
    db.media.count(),
    db.post.aggregate({ _sum: { views: true } }),
    db.post.findMany({
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: { author: true },
    }),
    db.subscriber.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    db.analyticsEvent.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  const stats = [
    { label: "Published", value: publishedCount, href: "/admin/posts?status=published" },
    { label: "Drafts", value: draftCount, href: "/admin/posts?status=draft" },
    { label: "Subscribers", value: subscriberCount, href: "/admin/subscribers" },
    { label: "Total views", value: formatNumber(totalViews._sum.views || 0) },
    { label: "Media", value: mediaCount, href: "/admin/media" },
    { label: "Trash", value: trashCount, href: "/admin/posts?status=trash" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl tracking-tight">Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {postCount} total posts · Platform health at a glance
          </p>
        </div>
        <Button asChild variant="cta">
          <Link href="/admin/posts/new">Create post</Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="glass border-0">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {s.href ? (
                <Link href={s.href} className="text-2xl font-serif hover:text-primary transition-colors">
                  {s.value}
                </Link>
              ) : (
                <div className="text-2xl font-serif">{s.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent posts</CardTitle>
            <Link href="/admin/posts" className="text-xs text-primary">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPosts.map((p) => (
              <Link
                key={p.id}
                href={`/admin/posts/${p.id}`}
                className="flex items-center justify-between gap-3 py-2 border-b border-border/40 last:border-0 hover:opacity-80"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(p.updatedAt)} · {p.author?.name || "—"}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize shrink-0">
                  {p.status}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Latest subscribers</CardTitle>
            <Link href="/admin/subscribers" className="text-xs text-primary">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSubs.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{s.email}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(s.createdAt)}</p>
                </div>
                <Badge variant="secondary">{s.status}</Badge>
              </div>
            ))}
            {recentSubs.length === 0 && (
              <p className="text-sm text-muted-foreground">No subscribers yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="glass border-0">
        <CardHeader>
          <CardTitle className="text-lg">Recent events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No analytics events yet.</p>
          ) : (
            <ul className="space-y-2">
              {events.map((e) => (
                <li key={e.id} className="text-sm flex gap-3 text-muted-foreground">
                  <Badge variant="outline" className="capitalize shrink-0">
                    {e.type}
                  </Badge>
                  <span className="truncate">{e.path || e.meta || "—"}</span>
                  <span className="ml-auto text-xs shrink-0">{formatDate(e.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
