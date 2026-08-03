import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ExportSubscribersButton } from "@/components/admin/export-subscribers";
import { DeleteSubscriberButton } from "@/components/admin/delete-subscriber";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const subs = await db.subscriber.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl tracking-tight">Subscribers</h1>
          <p className="text-sm text-muted-foreground mt-1">{subs.length} total</p>
        </div>
        <ExportSubscribersButton />
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-left text-xs text-muted-foreground uppercase tracking-wider">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id} className="border-b border-border/30">
                <td className="px-4 py-3 font-medium">{s.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.name || "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{s.status}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.source || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(s.createdAt)}</td>
                <td className="px-4 py-3">
                  <DeleteSubscriberButton id={s.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
