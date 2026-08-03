"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReaderStore } from "@/store/reader";
import { X } from "lucide-react";

export function ContinueReadingBanner({
  posts,
}: {
  posts: { slug: string; title: string }[];
}) {
  const recentlyViewed = useReaderStore((s) => s.recentlyViewed);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(sessionStorage.getItem("continue-dismissed") === "1");
  }, []);

  const next = recentlyViewed
    .map((slug) => posts.find((p) => p.slug === slug))
    .find(Boolean);

  if (dismissed || !next) return null;

  return (
    <div className="fixed bottom-6 left-4 z-40 max-w-sm glass-strong rounded-2xl p-4 shadow-xl animate-in slide-in-from-bottom-4">
      <button
        type="button"
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-secondary"
        aria-label="Dismiss"
        onClick={() => {
          sessionStorage.setItem("continue-dismissed", "1");
          setDismissed(true);
        }}
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        Continue reading
      </p>
      <Link href={`/blog/${next.slug}`} className="font-medium text-sm hover:text-primary line-clamp-2 pr-6">
        {next.title}
      </Link>
    </div>
  );
}
