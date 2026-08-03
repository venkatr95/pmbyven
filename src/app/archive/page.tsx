import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  title: "Archive",
  description: "Full archive timeline of pmbyven articles.",
  path: "/archive",
});

export const revalidate = 60;

export default async function ArchivePage() {
  const posts = await getPublishedPosts({ take: 100 });

  const byYear = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = post.publishedAt
      ? new Date(post.publishedAt).getFullYear().toString()
      : "Draft";
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a));

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-serif text-3xl sm:text-2xl tracking-tight mb-3">Archive</h1>
        <p className="text-muted-foreground text-lg mb-12">
          {posts.length} articles across {years.length} year{years.length !== 1 ? "s" : ""}.
        </p>

        <div className="relative">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
          {years.map((year) => (
            <div key={year} className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {year.slice(2)}
                </span>
                <h2 className="font-serif text-2xl">{year}</h2>
              </div>
              <ul className="space-y-3 ml-12">
                {byYear[year].map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      prefetch
                      className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 group"
                    >
                      <time className="text-xs text-muted-foreground tabular-nums w-24 shrink-0">
                        {formatDate(post.publishedAt)}
                      </time>
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {post.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
