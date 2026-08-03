import { db } from "@/lib/db";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  const [posts, pages, settings] = await Promise.all([
    db.post.findMany({
      where: { status: "published" },
      select: { title: true, slug: true, seoTitle: true, seoDescription: true, excerpt: true },
      take: 20,
      orderBy: { publishedAt: "desc" },
    }),
    db.page.findMany({ select: { title: true, slug: true, seoTitle: true, seoDescription: true } }),
    db.setting.findMany(),
  ]);

  const siteName = settings.find((s) => s.key === "site_name")?.value || "pmbyven";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">SEO</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Meta coverage, OG images, sitemap & robots
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Published posts", value: posts.length },
          { label: "Pages", value: pages.length },
          { label: "Sitemap", value: "/sitemap.xml" },
          { label: "RSS", value: "/rss.xml" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="font-serif text-xl mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 space-y-3">
        <h2 className="font-medium">Automatic OG images</h2>
        <p className="text-sm text-muted-foreground">
          Use{" "}
          <code className="bg-muted px-1 rounded text-xs">
            {absoluteUrl("/api/og?title=Your+Title")}
          </code>
        </p>
        <p className="text-sm text-muted-foreground">
          Site: <strong>{siteName}</strong> · Robots disallow /admin and /api
        </p>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-medium mb-4">Recent posts SEO</h2>
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.slug} className="text-sm border-b border-border/40 pb-3">
              <p className="font-medium">{p.seoTitle || p.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {p.seoDescription || p.excerpt || "—"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">/blog/{p.slug}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
