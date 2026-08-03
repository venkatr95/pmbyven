"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Search,
  FileText,
  Tag,
  Layers,
  User,
  BookOpen,
  Archive,
  Flame,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SearchItem {
  id: string;
  title: string;
  slug: string;
  type: "post" | "category" | "tag" | "series" | "author" | "page";
  excerpt?: string;
  category?: string;
}

export function CommandMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }
    const t = setTimeout(() => search(query), 200);
    return () => clearTimeout(t);
  }, [query, open, search]);

  function go(item: SearchItem) {
    const paths: Record<string, string> = {
      post: `/blog/${item.slug}`,
      category: `/categories/${item.slug}`,
      tag: `/topics/${item.slug}`,
      series: `/series/${item.slug}`,
      author: `/authors/${item.slug}`,
      page: `/${item.slug}`,
    };
    onOpenChange(false);
    router.push(paths[item.type] || "/");
  }

  const icons = {
    post: FileText,
    category: Layers,
    tag: Tag,
    series: BookOpen,
    author: User,
    page: Archive,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 max-w-xl gap-0">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
          <div className="flex items-center border-b border-border/50 px-4">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search articles, topics, authors…"
              className="flex h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden sm:inline-flex h-6 items-center rounded-md border border-border px-1.5 text-[10px] text-muted-foreground">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[360px] overflow-y-auto p-2">
            {loading && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Searching…
              </div>
            )}
            {!loading && results.length === 0 && (
              <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
                {query ? "No results found." : "Type to search the publication…"}
              </Command.Empty>
            )}
            {results.length > 0 && (
              <Command.Group heading="Results">
                {results.map((item) => {
                  const Icon = icons[item.type] || Flame;
                  return (
                    <Command.Item
                      key={`${item.type}-${item.id}`}
                      value={`${item.title} ${item.excerpt || ""}`}
                      onSelect={() => go(item)}
                      className={cn(
                        "flex items-start gap-3 rounded-xl px-3 py-3 cursor-pointer aria-selected:bg-secondary transition-colors"
                      )}
                    >
                      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{item.title}</div>
                        {item.excerpt && (
                          <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {item.excerpt}
                          </div>
                        )}
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mt-1">
                          {item.type}
                          {item.category ? ` · ${item.category}` : ""}
                        </div>
                      </div>
                    </Command.Item>
                  );
                })}
              </Command.Group>
            )}
          </Command.List>
          <div className="flex items-center justify-between border-t border-border/50 px-4 py-2 text-[11px] text-muted-foreground">
            <span>Filter by title, category, tag, author, content</span>
            <span className="hidden sm:inline">⌘K to open</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
