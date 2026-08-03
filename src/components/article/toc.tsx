"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, List } from "lucide-react";
import { cn } from "@/lib/utils";

export function TableOfContents({
  headings,
}: {
  headings: { level: number; text: string; id: string }[];
}) {
  const [activeId, setActiveId] = useState<string>("");
  const [collapsed, setCollapsed] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);

      const elements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean) as HTMLElement[];

      for (let i = elements.length - 1; i >= 0; i--) {
        if (elements[i].getBoundingClientRect().top <= 120) {
          setActiveId(elements[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block sticky top-28 w-56 shrink-0 self-start">
      <div className="glass rounded-2xl p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3"
        >
          <span className="flex items-center gap-1.5">
            <List className="h-3.5 w-3.5" />
            Contents
          </span>
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform", collapsed && "-rotate-90")}
          />
        </button>

        <div className="h-1 rounded-full bg-secondary mb-4 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {!collapsed && (
          <nav className="space-y-0.5 max-h-[60vh] overflow-y-auto">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={cn(
                  "block text-xs leading-snug py-1.5 rounded-md transition-colors relative",
                  h.level === 1 && "pl-2 font-medium",
                  h.level === 2 && "pl-2",
                  h.level === 3 && "pl-4",
                  h.level >= 4 && "pl-6",
                  activeId === h.id
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {activeId === h.id && (
                  <motion.span
                    layoutId="toc-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3.5 rounded-full bg-primary"
                  />
                )}
                {h.text}
              </a>
            ))}
          </nav>
        )}

        {activeId && !collapsed && (
          <p className="mt-3 pt-3 border-t border-border/50 text-[10px] text-muted-foreground line-clamp-2">
            Now: {headings.find((h) => h.id === activeId)?.text}
          </p>
        )}
      </div>
    </aside>
  );
}
