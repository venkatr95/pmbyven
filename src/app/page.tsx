import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/home/hero";
import { Section } from "@/components/home/section";
import { NewsletterCta } from "@/components/home/newsletter-cta";
import { ContinueSection } from "@/components/home/continue-section";
import { PostCard } from "@/components/posts/post-card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getHomepageData } from "@/lib/posts";
import { db } from "@/lib/db";
import { PageTransition } from "@/components/motion/page-transition";
import { getPopularThisWeek, getPinnedArticles } from "@/lib/trending";
import { PinnedNotes } from "@/components/article/pinned-notes";

/** ISR homepage — static shell, revalidate frequently */
export const revalidate = 60;

const DEFAULT_SECTIONS = [
  "featured",
  "editorsPicks",
  "continue",
  "latest",
  "trending",
  "mostRead",
  "popularWeek",
  "pinned",
  "categories",
  "topics",
  "collections",
  "series",
  "newsletter",
  "archive",
  "readingLists",
];

export default async function HomePage() {
  const data = await getHomepageData();
  const config = await db.themeConfig.findFirst();
  let sections = DEFAULT_SECTIONS;
  try {
    const parsed = JSON.parse(config?.homepageSections || "[]");
    if (Array.isArray(parsed) && parsed.length) sections = parsed;
  } catch {
    /* keep default */
  }

  const [collections, popularWeek, pinnedPosts, globalNotes] = await Promise.all([
    db.collection.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
      take: 4,
    }),
    getPopularThisWeek(5),
    getPinnedArticles(4),
    db.pinnedNote.findMany({
      where: { pinned: true, global: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: 3,
    }),
  ]);

  const allPostsMeta = data.latest.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
  }));

  const show = (id: string) => sections.includes(id);

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-24">
        <div className="relative w-full overflow-hidden rounded-2xl">
          <Image
            src="/images/pmbyven_banner.png"
            alt="PmByVen — Product Management: Strategic thinking. Seamless execution. Exceptional products."
            width={1942}
            height={809}
            priority
            className="w-full h-auto"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
      </div>

      {globalNotes.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6">
          <PinnedNotes notes={globalNotes} />
        </div>
      )}

      {show("featured") && <Hero post={data.featured} />}

      {show("editorsPicks") && data.editorsPicks.length > 0 && (
        <Section
          title="Editor's Picks"
          description="Hand-selected essays worth your undivided attention."
          href="/blog?filter=editors"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.editorsPicks.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </Section>
      )}

      {show("continue") && <ContinueSection posts={allPostsMeta} />}

      {show("latest") && (
        <Section
          title="Latest Articles"
          description="Fresh from the desk."
          href="/blog"
          className="bg-muted/30"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.latest.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </Section>
      )}

      {(show("trending") || show("mostRead") || show("popularWeek")) && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-10">
            {show("trending") && (
              <div>
                <h2 className="font-serif text-3xl sm:text-2xl tracking-tight mb-6">Trending</h2>
                <div className="space-y-5 glass rounded-2xl p-6">
                  {data.trending.map((post, i) => (
                    <PostCard key={post.id} post={post} variant="compact" index={i} />
                  ))}
                </div>
              </div>
            )}
            {show("mostRead") && (
              <div>
                <h2 className="font-serif text-3xl sm:text-2xl tracking-tight mb-6">Most Read</h2>
                <div className="space-y-5 glass rounded-2xl p-6">
                  {data.mostRead.map((post, i) => (
                    <PostCard key={post.id} post={post} variant="compact" index={i} />
                  ))}
                </div>
              </div>
            )}
            {show("popularWeek") && popularWeek.length > 0 && (
              <div className={show("trending") && show("mostRead") ? "lg:col-span-2" : ""}>
                <h2 className="font-serif text-4xl tracking-tight mb-2">Popular this week</h2>
                <p className="text-base text-muted-foreground mb-6">
                  Scored by views, likes, shares, and recency.
                </p>
                <div className="space-y-5 glass rounded-2xl p-6">
                  {popularWeek.map((post, i) => (
                    <PostCard key={post.id} post={post} variant="compact" index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {show("pinned") && pinnedPosts.length > 0 && (
        <Section title="Pinned articles" description="Editor-pinned essentials." href="/blog?filter=featured">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pinnedPosts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </Section>
      )}

      {show("categories") && (
        <Section title="Categories" description="Browse by discipline." href="/categories">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="glass rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
              >
                <span className="text-3xl mb-3 block">{cat.icon || "📁"}</span>
                <h3 className="font-serif text-2xl group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-base text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-3">{cat._count.posts} articles</p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {show("topics") && (
        <Section title="Topics" description="Explore by tag." href="/topics" className="bg-muted/30">
          <div className="flex flex-wrap gap-2.5 justify-center max-w-3xl mx-auto">
            {data.tags
              .filter((t) => t.count > 0)
              .map((tag) => {
                const size =
                  tag.count >= 3
                    ? "text-base px-4 py-2"
                    : tag.count >= 2
                      ? "text-sm px-3 py-1.5"
                      : "text-xs px-2.5 py-1";
                return (
                  <Link key={tag.id} href={`/topics/${tag.slug}`}>
                    <Badge
                      variant="glass"
                      className={`${size} hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer`}
                    >
                      {tag.name}
                      <span className="ml-1.5 opacity-50">{tag.count}</span>
                    </Badge>
                  </Link>
                );
              })}
          </div>
        </Section>
      )}

      {show("collections") && collections.length > 0 && (
        <Section title="Featured Collections" description="Curated reading sets." href="/collections">
          <div className="grid sm:grid-cols-2 gap-5">
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/collections/${c.slug}`}
                className="glass rounded-2xl p-6 hover:shadow-lg transition-all group"
              >
                <h3 className="font-serif text-3xl group-hover:text-primary">{c.title}</h3>
                {c.description && (
                  <p className="text-base text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">{c.description}</p>
                )}
              </Link>
            ))}
          </div>
        </Section>
      )}

      {show("series") && data.series.length > 0 && (
        <Section title="Latest Series" description="Multi-part deep dives." href="/series">
          <div className="grid sm:grid-cols-2 gap-5">
            {data.series.map((s) => (
              <Link
                key={s.id}
                href={`/series/${s.slug}`}
                className="glass rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group"
              >
                <div className="relative aspect-[21/9] bg-muted">
                  <OptimizedImage
                    src={s.coverImage}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-3xl group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                  {s.description && (
                    <p className="text-base text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">{s.description}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-3">
                    {s.posts.length} parts · Continue series
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {show("newsletter") && <NewsletterCta />}

      {show("archive") && (
        <Section title="Archive Timeline" description="Browse the full history." href="/archive">
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-muted-foreground mb-4">
              {data.latest.length > 0
                ? `From ${new Date(data.latest[data.latest.length - 1]?.publishedAt || Date.now()).getFullYear()} to present`
                : "Start publishing to build your archive."}
            </p>
            <Link href="/archive" className="text-sm font-medium text-primary hover:underline">
              Open archive →
            </Link>
          </div>
        </Section>
      )}

      {show("readingLists") && (
        <Section title="Reading Lists" description="Bookmarks & history on this device." href="/reading-list">
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Save articles while reading. Build your personal library.
            </p>
            <Link href="/reading-list" className="text-sm font-medium text-primary hover:underline">
              Open reading list →
            </Link>
          </div>
        </Section>
      )}
    </PageTransition>
  );
}
