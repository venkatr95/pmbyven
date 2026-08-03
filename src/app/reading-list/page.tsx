"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useReaderStore } from "@/store/reader";
import { Bookmark, Clock } from "lucide-react";

interface PostMeta {
  slug: string;
  title: string;
  excerpt?: string;
  readingTime?: number;
}

export default function ReadingListPage() {
  const bookmarks = useReaderStore((s) => s.bookmarks);
  const recentlyViewed = useReaderStore((s) => s.recentlyViewed);
  const readingStreak = useReaderStore((s) => s.readingStreak);
  const toggleBookmark = useReaderStore((s) => s.toggleBookmark);
  const [posts, setPosts] = useState<PostMeta[]>([]);

  useEffect(() => {
    fetch("/api/search?q=")
      .then((r) => r.json())
      .then((data) => {
        setPosts(
          (data.results || [])
            .filter((r: { type: string }) => r.type === "post")
            .map((r: PostMeta & { id: string }) => ({
              slug: r.slug,
              title: r.title,
              excerpt: r.excerpt,
            }))
        );
      })
      .catch(() => setPosts([]));
  }, []);

  const bookmarked = bookmarks
    .map((slug) => posts.find((p) => p.slug === slug) || { slug, title: slug })
    .filter(Boolean);

  const history = recentlyViewed
    .map((slug) => posts.find((p) => p.slug === slug) || { slug, title: slug })
    .filter(Boolean);

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-serif text-4xl tracking-tight mb-2">Reading list</h1>
        <p className="text-muted-foreground mb-2">
          Bookmarks and history stored on this device.
        </p>
        {readingStreak > 0 && (
          <p className="text-sm text-primary mb-8">🔥 {readingStreak}-day reading streak</p>
        )}

        <section className="mb-12">
          <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
            <Bookmark className="h-5 w-5" /> Bookmarks
          </h2>
          {bookmarked.length === 0 ? (
            <p className="text-sm text-muted-foreground glass rounded-2xl p-8 text-center">
              No bookmarks yet. Save articles while reading.
            </p>
          ) : (
            <ul className="space-y-3">
              {bookmarked.map((p) => (
                <li key={p.slug} className="glass rounded-2xl p-4 flex items-start justify-between gap-3">
                  <Link href={`/blog/${p.slug}`} className="font-medium hover:text-primary">
                    {p.title}
                  </Link>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => toggleBookmark(p.slug)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" /> Reading history
          </h2>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground glass rounded-2xl p-8 text-center">
              Articles you open will appear here.
            </p>
          ) : (
            <ul className="space-y-3">
              {history.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="block glass rounded-2xl p-4 font-medium hover:text-primary transition-colors"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
