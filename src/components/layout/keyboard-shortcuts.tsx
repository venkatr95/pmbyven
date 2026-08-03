"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const shortcuts = [
  { keys: "⌘ K", desc: "Open search / command palette" },
  { keys: "?", desc: "Show keyboard shortcuts" },
  { keys: "G then H", desc: "Go home" },
  { keys: "G then B", desc: "Go to blog" },
  { keys: "Esc", desc: "Close dialogs" },
];

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let gPending = false;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key.toLowerCase() === "g" && !e.metaKey && !e.ctrlKey) {
        gPending = true;
        setTimeout(() => {
          gPending = false;
        }, 800);
        return;
      }
      if (gPending) {
        if (e.key.toLowerCase() === "h") window.location.href = "/";
        if (e.key.toLowerCase() === "b") window.location.href = "/blog";
        gPending = false;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <ul className="space-y-3">
          {shortcuts.map((s) => (
            <li key={s.keys} className="flex items-center justify-between text-sm gap-4">
              <span className="text-muted-foreground">{s.desc}</span>
              <kbd className="px-2 py-1 rounded-md border border-border bg-muted text-xs font-mono whitespace-nowrap">
                {s.keys}
              </kbd>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
