"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { exportBackup } from "@/lib/actions/cms";

export default function AdminBackupsPage() {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Backups</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Export full content JSON. For SQLite, also copy <code className="bg-muted px-1 rounded">prisma/dev.db</code>.
        </p>
      </div>
      <div className="glass rounded-2xl p-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Includes posts, categories, tags, authors, series, pages, subscribers, media metadata, and settings.
        </p>
        <Button
          variant="cta"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const json = await exportBackup();
              const blob = new Blob([json], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `editorial-backup-${new Date().toISOString().slice(0, 10)}.json`;
              a.click();
              URL.revokeObjectURL(url);
              toast.success("Backup downloaded");
            })
          }
        >
          {pending ? "Exporting…" : "Download JSON backup"}
        </Button>
      </div>
    </div>
  );
}
