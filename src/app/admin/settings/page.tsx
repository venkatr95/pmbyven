"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSetting } from "@/lib/actions/admin";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("pmbyven");
  const [tagline, setTagline] = useState("If Apple designed Medium");
  const [postsPerPage, setPostsPerPage] = useState("12");
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="font-serif text-3xl tracking-tight">Settings</h1>
      <form
        className="glass rounded-2xl p-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            await saveSetting("site_name", siteName);
            await saveSetting("site_tagline", tagline);
            await saveSetting("posts_per_page", postsPerPage);
            toast.success("Settings saved");
          });
        }}
      >
        <div className="space-y-2">
          <Label>Site name</Label>
          <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>Tagline</Label>
          <Input value={tagline} onChange={(e) => setTagline(e.target.value)} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>Posts per page</Label>
          <Input
            type="number"
            value={postsPerPage}
            onChange={(e) => setPostsPerPage(e.target.value)}
            className="rounded-xl"
          />
        </div>
        <div className="pt-2 border-t border-border/50 space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Admin secret:</strong> set via <code className="bg-muted px-1 rounded">ADMIN_SECRET</code> env var
          </p>
          <p>
            <strong>Database:</strong> SQLite at <code className="bg-muted px-1 rounded">prisma/dev.db</code>
          </p>
          <p>
            <strong>Backups:</strong> copy the database file periodically.
          </p>
        </div>
        <Button type="submit" variant="cta" disabled={pending}>
          {pending ? "Saving…" : "Save settings"}
        </Button>
      </form>
    </div>
  );
}
