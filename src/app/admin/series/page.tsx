"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveSeries } from "@/lib/actions/admin";

interface SeriesItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
}

export default function AdminSeriesPage() {
  const [items, setItems] = useState<SeriesItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pending, startTransition] = useTransition();

  async function load() {
    const res = await fetch("/api/admin/series");
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl tracking-tight">Series</h1>
      <form
        className="glass rounded-2xl p-5 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            await saveSeries({ title, description });
            toast.success("Series created");
            setTitle("");
            setDescription("");
            load();
          });
        }}
      >
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl" />
        </div>
        <Button type="submit" variant="cta" disabled={pending}>
          Create series
        </Button>
      </form>
      <div className="space-y-2">
        {items.map((s) => (
          <div key={s.id} className="glass rounded-xl p-4">
            <p className="font-medium">{s.title}</p>
            <p className="text-xs text-muted-foreground">/{s.slug}</p>
            {s.description && (
              <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
