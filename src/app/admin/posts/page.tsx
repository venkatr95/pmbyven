import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PostRowActions } from "@/components/admin/post-row-actions";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = params.status;
  const q = params.q?.trim();

  const posts = await db.post.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { slug: { contains: q } },
              { excerpt: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: { author: true, category: true },
  });

  const statuses = ["all", "published", "draft", "scheduled", "archived", "trash"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl tracking-tight">Posts</h1>
          <p className="text-sm text-muted-foreground mt-1">{posts.length} results</p>
        </div>
        <Button asChild variant="cta">
          <Link href="/admin/posts/new">Create post</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Link
            key={s}
            href={s === "all" ? "/admin/posts" : `/admin/posts?status=${s}`}
            className={`px-3 py-1.5 rounded-full text-xs capitalize glass ${
              (s === "all" && !status) || status === s ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <form className="max-w-sm">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search posts…"
          className="w-full h-10 rounded-full border border-input bg-background px-4 text-sm"
        />
      </form>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left text-xs text-muted-foreground uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Views</th>
                <th className="px-4 py-3 font-medium">Updated</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-border/30 hover:bg-secondary/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/posts/${p.id}`} className="font-medium hover:text-primary">
                      {p.title}
                    </Link>
                    <div className="text-xs text-muted-foreground">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="capitalize">
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.author?.name || "—"}</td>
                  <td className="px-4 py-3 tabular-nums">{formatNumber(p.views)}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {formatDate(p.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <PostRowActions id={p.id} slug={p.slug} status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No posts found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
