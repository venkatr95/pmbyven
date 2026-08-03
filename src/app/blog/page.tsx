import Link from "next/link";
import { PostCard } from "@/components/posts/post-card";
import { getPublishedPosts } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  title: "Blog",
  description: "All articles from pmbyven — product, design, engineering, and craft.",
  path: "/blog",
});

/** Listings stay fresh via ISR; filters use searchParams so remain dynamic on request */
export const revalidate = 60;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>;
}) {
  const params = await searchParams;
  const filter = params.filter;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const take = 12;
  const skip = (page - 1) * take;

  const posts = await getPublishedPosts({
    take,
    skip,
    editorsPick: filter === "editors" ? true : undefined,
    featured: filter === "featured" ? true : undefined,
    orderBy: filter === "popular" ? "popular" : filter === "trending" ? "trending" : "latest",
  });

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <h1 className="font-serif text-3xl sm:text-2xl tracking-tight mb-3">Blog</h1>
          <p className="text-muted-foreground text-lg">
            Essays on product, design, and craft. Premium reading, zero clutter.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { href: "/blog", label: "Latest" },
            { href: "/blog?filter=editors", label: "Editor's Picks" },
            { href: "/blog?filter=featured", label: "Featured" },
            { href: "/blog?filter=popular", label: "Most Read" },
            { href: "/blog?filter=trending", label: "Trending" },
          ].map((f) => (
            <Link
              key={f.href}
              href={f.href}
              prefetch
              className="px-4 py-2 rounded-full text-sm glass hover:bg-secondary transition-colors"
            >
              {f.label}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center text-muted-foreground">
            No articles yet. Check back soon.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}

        <div className="flex justify-center gap-3 mt-12">
          {page > 1 && (
            <Link
              href={`/blog?page=${page - 1}${filter ? `&filter=${filter}` : ""}`}
              prefetch
              className="px-5 py-2.5 rounded-full glass text-sm font-medium hover:shadow-md transition-all"
            >
              ← Previous
            </Link>
          )}
          {posts.length === take && (
            <Link
              href={`/blog?page=${page + 1}${filter ? `&filter=${filter}` : ""}`}
              prefetch
              className="px-5 py-2.5 rounded-full glass text-sm font-medium hover:shadow-md transition-all"
            >
              Next →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
