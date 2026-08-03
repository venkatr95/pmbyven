import { cn } from "@/lib/utils";

const colors: Record<string, string> = {
  amber: "bg-amber-500/10 border-amber-500/30",
  blue: "bg-blue-500/10 border-blue-500/30",
  green: "bg-emerald-500/10 border-emerald-500/30",
  purple: "bg-purple-500/10 border-purple-500/30",
  rose: "bg-rose-500/10 border-rose-500/30",
};

export function PinnedNotes({
  notes,
}: {
  notes: { id: string; title: string; body: string; color: string; global: boolean }[];
}) {
  if (!notes.length) return null;

  return (
    <div className="my-6 space-y-3">
      {notes.map((n) => (
        <aside
          key={n.id}
          className={cn(
            "rounded-2xl border px-5 py-4 shadow-sm",
            colors[n.color] || colors.amber
          )}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-foreground/70">
              {n.global ? "Pinned note" : "Editor note"}
            </span>
          </div>
          <h4 className="font-medium text-sm mb-1 text-foreground">{n.title}</h4>
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{n.body}</p>
        </aside>
      ))}
    </div>
  );
}
