"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveMenuItems } from "@/lib/actions/cms";

interface MenuItem {
  id?: string;
  label: string;
  href: string;
  order: number;
}

interface Menu {
  id: string;
  name: string;
  location: string;
  items: MenuItem[];
}

export default function AdminMenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/admin/menus")
      .then((r) => r.json())
      .then(setMenus)
      .catch(() => setMenus([]));
  }, []);

  function updateItem(menuIdx: number, itemIdx: number, patch: Partial<MenuItem>) {
    setMenus((prev) => {
      const next = structuredClone(prev);
      next[menuIdx].items[itemIdx] = { ...next[menuIdx].items[itemIdx], ...patch };
      return next;
    });
  }

  function addItem(menuIdx: number) {
    setMenus((prev) => {
      const next = structuredClone(prev);
      next[menuIdx].items.push({
        label: "New item",
        href: "/",
        order: next[menuIdx].items.length,
      });
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl tracking-tight">Menus</h1>
      <p className="text-sm text-muted-foreground">
        Edit navigation labels and hrefs. Drag order via up/down buttons.
      </p>
      {menus.map((menu, mi) => (
        <div key={menu.id} className="glass rounded-2xl p-6 space-y-3">
          <h2 className="font-medium">
            {menu.name}{" "}
            <span className="text-xs text-muted-foreground capitalize">({menu.location})</span>
          </h2>
          {menu.items.map((item, ii) => (
            <div key={ii} className="flex flex-col sm:flex-row gap-2 items-center">
              <Input
                value={item.label}
                onChange={(e) => updateItem(mi, ii, { label: e.target.value })}
                className="rounded-xl"
                placeholder="Label"
              />
              <Input
                value={item.href}
                onChange={(e) => updateItem(mi, ii, { href: e.target.value })}
                className="rounded-xl"
                placeholder="/path"
              />
              <div className="flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (ii === 0) return;
                    setMenus((prev) => {
                      const next = structuredClone(prev);
                      const arr = next[mi].items;
                      [arr[ii - 1], arr[ii]] = [arr[ii], arr[ii - 1]];
                      return next;
                    });
                  }}
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setMenus((prev) => {
                      const next = structuredClone(prev);
                      const arr = next[mi].items;
                      if (ii >= arr.length - 1) return prev;
                      [arr[ii + 1], arr[ii]] = [arr[ii], arr[ii + 1]];
                      return next;
                    });
                  }}
                >
                  ↓
                </Button>
              </div>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => addItem(mi)}>
              Add item
            </Button>
            <Button
              type="button"
              variant="cta"
              size="sm"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await saveMenuItems(
                    menu.id,
                    menu.items.map((it, order) => ({ ...it, order }))
                  );
                  toast.success("Menu saved");
                })
              }
            >
              Save menu
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
