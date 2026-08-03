import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminRevisionsPage() {
  const revisions = await db.revision.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { post: { select: { id: true, title: true, slug: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl tracking-tight">Version history</h1>
      <p className="text-sm text-muted-foreground">
        Autosaved revisions created whenever a post is saved.
      </p>
      <div className="space-y-2">
        {revisions.map((r) => (
          <div key={r.id} className="glass rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{r.title}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(r.createdAt)} · {r.content.length.toLocaleString()} chars
              </p>
            </div>
            <Link
              href={`/admin/posts/${r.post.id}`}
              className="text-xs text-primary shrink-0 hover:underline"
            >
              Open post
            </Link>
          </div>
        ))}
        {revisions.length === 0 && (
          <p className="text-muted-foreground text-center py-12">No revisions yet.</p>
        )}
      </div>
    </div>
  );
}
