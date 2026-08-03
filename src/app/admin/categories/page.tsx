"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveCategory, deleteCategory } from "@/lib/actions/admin";

interface Cat {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  featured: boolean;
}

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Cat[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("📁");
  const [pending, startTransition] = useTransition();

  async function load() {
    const res = await fetch("/api/admin/categories");
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl tracking-tight">Categories</h1>

      <form
        className="glass rounded-2xl p-5 grid sm:grid-cols-4 gap-3 items-end"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            await saveCategory({ name, description, icon });
            toast.success("Category saved");
            setName("");
            setDescription("");
            load();
          });
        }}
      >
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label>Icon</Label>
          <Input value={icon} onChange={(e) => setIcon(e.target.value)} className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl" />
        </div>
        <Button type="submit" variant="cta" disabled={pending}>
          Add
        </Button>
      </form>

      <div className="space-y-2">
        {items.map((c) => (
          <div key={c.id} className="glass rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">{c.icon}</span>
              <div>
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">/{c.slug}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() =>
                startTransition(async () => {
                  await deleteCategory(c.id);
                  toast.success("Deleted");
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
