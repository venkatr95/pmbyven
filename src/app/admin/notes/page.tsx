"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { savePinnedNote, deletePinnedNote } from "@/lib/actions/notes";

interface Note {
  id: string;
  title: string;
  body: string;
  color: string;
  global: boolean;
  postId?: string | null;
}

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [color, setColor] = useState("amber");
  const [global, setGlobal] = useState(true);
  const [pending, startTransition] = useTransition();

  async function load() {
    const res = await fetch("/api/admin/notes");
    if (res.ok) setNotes(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Pinned notes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Editor callouts on articles or site-wide.
        </p>
      </div>

      <form
        className="glass rounded-2xl p-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            await savePinnedNote({ title, body, color, global, pinned: true });
            toast.success("Note saved");
            setTitle("");
            setBody("");
            load();
          });
        }}
      >
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>Body</Label>
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} required rows={4} className="rounded-xl" />
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-1">
            <Label>Color</Label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
            >
              {["amber", "blue", "green", "purple", "rose"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 pt-5">
            <Switch checked={global} onCheckedChange={setGlobal} id="global" />
            <Label htmlFor="global">Show site-wide</Label>
          </div>
        </div>
        <Button type="submit" variant="cta" disabled={pending}>
          Save note
        </Button>
      </form>

      <div className="space-y-2">
        {notes.map((n) => (
          <div key={n.id} className="glass rounded-xl p-4 flex justify-between gap-3">
            <div>
              <p className="font-medium text-sm">{n.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{n.body}</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {n.color} · {n.global ? "global" : "post-specific"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive shrink-0"
              onClick={() =>
                startTransition(async () => {
                  await deletePinnedNote(n.id);
                  load();
                })
              }
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
