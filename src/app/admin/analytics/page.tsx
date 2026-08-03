import { db } from "@/lib/db";
import { formatNumber, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [views, topPosts, subs, events] = await Promise.all([
    db.post.aggregate({ _sum: { views: true, likes: true, shares: true } }),
    db.post.findMany({
      where: { status: "published" },
      orderBy: { views: "desc" },
      take: 10,
      select: { id: true, title: true, slug: true, views: true, likes: true },
    }),
    db.subscriber.count({ where: { status: "active" } }),
    db.analyticsEvent.groupBy({
      by: ["type"],
      _count: true,
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl tracking-tight">Analytics</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total views", value: formatNumber(views._sum.views || 0) },
          { label: "Total likes", value: formatNumber(views._sum.likes || 0) },
          { label: "Shares", value: formatNumber(views._sum.shares || 0) },
          { label: "Subscribers", value: formatNumber(subs) },
        ].map((s) => (
          <Card key={s.label} className="glass border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-serif">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass border-0">
          <CardHeader>
            <CardTitle>Top posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPosts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground/50 font-serif w-6">{i + 1}</span>
                <span className="flex-1 truncate font-medium">{p.title}</span>
                <span className="tabular-nums text-muted-foreground">
                  {formatNumber(p.views)} views
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass border-0">
          <CardHeader>
            <CardTitle>Event breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.length === 0 && (
              <p className="text-sm text-muted-foreground">No events recorded yet.</p>
            )}
            {events.map((e) => (
              <div key={e.type} className="flex justify-between text-sm">
                <span className="capitalize">{e.type}</span>
                <span className="tabular-nums font-medium">{e._count}</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-4 border-t border-border/50">
              As of {formatDate(new Date())}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
