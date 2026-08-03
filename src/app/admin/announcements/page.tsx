"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveAnnouncement } from "@/lib/actions/cms";

export default function AdminAnnouncementsPage() {
  const [message, setMessage] = useState("");
  const [href, setHref] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Announcements</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Site-wide banner at the top of the public site.
        </p>
      </div>
      <form
        className="glass rounded-2xl p-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            await saveAnnouncement({ message, href: href || undefined, active: true });
            toast.success("Announcement saved");
            setMessage("");
            setHref("");
          });
        }}
      >
        <div className="space-y-2">
          <Label>Message</Label>
          <Input value={message} onChange={(e) => setMessage(e.target.value)} required className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>Link (optional)</Label>
          <Input value={href} onChange={(e) => setHref(e.target.value)} placeholder="/blog" className="rounded-xl" />
        </div>
        <Button type="submit" variant="cta" disabled={pending}>
          Publish banner
        </Button>
      </form>
    </div>
  );
}
