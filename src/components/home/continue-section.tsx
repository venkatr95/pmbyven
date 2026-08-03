"use client";

import Link from "next/link";
import { useReaderStore } from "@/store/reader";
import { Section } from "@/components/home/section";

export function ContinueSection({
  posts,
}: {
  posts: { slug: string; title: string; excerpt?: string | null }[];
}) {
  const recentlyViewed = useReaderStore((s) => s.recentlyViewed);
  const bookmarks = useReaderStore((s) => s.bookmarks);

  const recent = recentlyViewed
    .map((slug) => posts.find((p) => p.slug === slug))
    .filter(Boolean)
    .slice(0, 4) as typeof posts;

  const pinned = bookmarks
    .map((slug) => posts.find((p) => p.slug === slug))
    .filter(Boolean)
    .slice(0, 4) as typeof posts;

  if (recent.length === 0 && pinned.length === 0) return null;

  return (
    <>
      {recent.length > 0 && (
        <Section title="Continue reading" description="Pick up where you left off.">
          <div className="grid sm:grid-cols-2 gap-3">
            {recent.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="glass rounded-2xl p-5 hover:shadow-md transition-all"
              >
                <h3 className="font-medium line-clamp-2">{p.title}</h3>
                {p.excerpt && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        </Section>
      )}
      {pinned.length > 0 && (
        <Section title="Your bookmarks" description="Saved for later." href="/reading-list">
          <div className="grid sm:grid-cols-2 gap-3">
            {pinned.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="glass rounded-2xl p-5 hover:shadow-md transition-all"
              >
                <h3 className="font-medium line-clamp-2">{p.title}</h3>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
