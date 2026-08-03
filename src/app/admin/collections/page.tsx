"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveCollection } from "@/lib/actions/cms";

interface Col {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  featured: boolean;
}

export default function AdminCollectionsPage() {
  const [items, setItems] = useState<Col[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pending, startTransition] = useTransition();

  async function load() {
    const res = await fetch("/api/admin/collections");
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl tracking-tight">Collections</h1>
      <form
        className="glass rounded-2xl p-5 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            await saveCollection({ title, description, featured: true });
            toast.success("Collection created");
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
          Create collection
        </Button>
      </form>
      <div className="space-y-2">
        {items.map((c) => (
          <div key={c.id} className="glass rounded-xl p-4">
            <p className="font-medium">{c.title}</p>
            <p className="text-xs text-muted-foreground">/{c.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
