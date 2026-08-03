"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";

interface Result {
  id: string;
  title: string;
  slug: string;
  type: string;
  excerpt?: string;
  category?: string;
}

function SearchInner() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") || "";
  const [q, setQ] = useState(initial);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const pathFor = (r: Result) => {
    if (r.type === "post") return `/blog/${r.slug}`;
    if (r.type === "category") return `/categories/${r.slug}`;
    if (r.type === "tag") return `/topics/${r.slug}`;
    if (r.type === "series") return `/series/${r.slug}`;
    if (r.type === "author") return `/authors/${r.slug}`;
    return `/${r.slug}`;
  };

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h1 className="font-serif text-3xl sm:text-2xl tracking-tight mb-6">Search</h1>
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles, topics, authors…"
            className="pl-11 h-12 rounded-full text-base"
            autoFocus
          />
        </div>
        {loading && <p className="text-sm text-muted-foreground">Searching…</p>}
        <ul className="space-y-3">
          {results.map((r) => (
            <li key={`${r.type}-${r.id}`}>
              <Link
                href={pathFor(r)}
                className="block glass rounded-2xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {r.type}
                  </Badge>
                  {r.category && (
                    <span className="text-xs text-muted-foreground">{r.category}</span>
                  )}
                </div>
                <h2 className="font-medium">{r.title}</h2>
                {r.excerpt && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.excerpt}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
        {!loading && q && results.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No results for “{q}”</p>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-28 text-center text-muted-foreground">Loading…</div>}>
      <SearchInner />
    </Suspense>
  );
}
