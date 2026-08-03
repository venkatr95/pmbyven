"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { saveTag, deleteTag } from "@/lib/actions/admin";

interface TagItem {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export default function AdminTagsPage() {
  const [items, setItems] = useState<TagItem[]>([]);
  const [name, setName] = useState("");
  const [pending, startTransition] = useTransition();

  async function load() {
    const res = await fetch("/api/admin/tags");
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl tracking-tight">Tags</h1>
      <form
        className="glass rounded-2xl p-5 flex flex-col sm:flex-row gap-3 items-end"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            await saveTag({ name });
            toast.success("Tag saved");
            setName("");
            load();
          });
        }}
      >
        <div className="flex-1 space-y-1.5 w-full">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required className="rounded-xl" />
        </div>
        <Button type="submit" variant="cta" disabled={pending}>
          Add tag
        </Button>
      </form>
      <div className="flex flex-wrap gap-2">
        {items.map((t) => (
          <div key={t.id} className="glass rounded-full pl-3 pr-1 py-1 flex items-center gap-1">
            <span className="text-sm">{t.name}</span>
            <Badge variant="secondary" className="text-[10px]">
              {t.count}
            </Badge>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive h-7 w-7"
              onClick={() =>
                startTransition(async () => {
                  await deleteTag(t.id);
                  load();
                })
              }
            >
              ×
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
