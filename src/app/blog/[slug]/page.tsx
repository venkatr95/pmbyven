import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, BookOpen } from "lucide-react";
import {
  getPostBySlug,
  getAdjacentPosts,
  getRelatedPosts,
  getPublishedPosts,
  getAllPublishedPostSlugs,
} from "@/lib/posts";
import { MdxContent, extractHeadings } from "@/lib/mdx";
import { formatDate, readingTimeLabel, absoluteUrl } from "@/lib/utils";
import { getRobotsMetadata, getSiteConfig } from "@/lib/seo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TableOfContents } from "@/components/article/toc";
import {
  ReadingProgressBar,
  ArticleActions,
  ReaderWidthWrapper,
} from "@/components/article/reading-controls";
import { ArticleSidebar } from "@/components/article/article-sidebar";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { PostCard } from "@/components/posts/post-card";
import { Separator } from "@/components/ui/separator";
import { FloatingActions } from "@/components/article/floating-actions";
import {
  EstimatedFinish,
  ScrollPercentage,
  ReadingStreakBadge,
} from "@/components/article/reading-meta";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { AiSummary } from "@/components/article/ai-summary";
import { ShareImageButton } from "@/components/article/share-image";
import { PinnedNotes } from "@/components/article/pinned-notes";
import { ViewTracker } from "@/components/analytics/view-tracker";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { JsonLd } from "@/components/seo/json-ld";
import { db } from "@/lib/db";

/** ISR: pre-render at build, revalidate every 60s for fresh data */
export const revalidate = 60;
/** Allow new slugs not present at build time */
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

/**
 * Static Generation — prebuild HTML for every published post.
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  return getAllPublishedPostSlugs();
}

/**
 * Dynamic Metadata API — title, description, Open Graph, Twitter, canonical.
 * Runs on the server before HTML is sent (search-bot friendly).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const site = getSiteConfig();

  if (!post) {
    return {
      title: "Not found",
      robots: { index: false, follow: false },
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || site.siteDesc;
  const canonical = post.canonicalUrl || absoluteUrl(`/blog/${post.slug}`);
  const ogImageUrl =
    post.ogImage ||
    post.coverImage ||
    absoluteUrl(
      `/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.excerpt || "")}`
    );

  return {
    title,
    description,
    authors: post.author
      ? [{ name: post.author.name, url: absoluteUrl(`/authors/${post.author.slug}`) }]
      : [{ name: site.copyrightHolder }],
    creator: post.author?.name || site.copyrightHolder,
    publisher: site.copyrightHolder,
    keywords: post.tags?.map((t) => t.tag.name) || undefined,
    robots: getRobotsMetadata(),
    openGraph: {
      title,
      description,
      type: "article",
      url: canonical,
      locale: "en_US",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: post.author ? [post.author.name] : undefined,
      section: post.category?.name,
      tags: post.tags?.map((t) => t.tag.name),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: site.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: ogImageUrl, alt: title }],
    },
    alternates: {
      canonical,
      types: {
        "application/rss+xml": absoluteUrl("/rss.xml"),
      },
    },
    other: {
      copyright: site.copyrightNotice,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || (post.status !== "published" && process.env.NODE_ENV === "production")) {
    notFound();
  }

  const headings = extractHeadings(post.content);
  const [{ prev, next }, related, popular, notes] = await Promise.all([
    getAdjacentPosts(post.slug, post.publishedAt),
    getRelatedPosts(post.id, post.categoryId, 3),
    getPublishedPosts({ orderBy: "popular", take: 4 }),
    db.pinnedNote.findMany({
      where: {
        pinned: true,
        OR: [{ postId: post.id }, { global: true }],
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  const site = getSiteConfig();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
          url: absoluteUrl(`/authors/${post.author.slug}`),
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: site.copyrightHolder,
      url: site.siteUrl,
    },
    wordCount: post.wordCount,
    timeRequired: `PT${post.readingTime}M`,
    isAccessibleForFree: true,
  };

  return (
    <>
      <ViewTracker postId={post.id} path={`/blog/${post.slug}`} />
      <ReadingProgressBar />
      <JsonLd data={jsonLd} />

      <article className="pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              ...(post.category
                ? [{ label: post.category.name, href: `/categories/${post.category.slug}` }]
                : []),
              { label: post.title },
            ]}
          />

          <div className="flex gap-10 xl:gap-14 justify-center">
            <TableOfContents headings={headings} />

            <div className="min-w-0 flex-1 max-w-3xl">
              <ReaderWidthWrapper>
                <header className="mb-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.category && (
                      <Link href={`/categories/${post.category.slug}`}>
                        <Badge variant="secondary">{post.category.name}</Badge>
                      </Link>
                    )}
                    {post.featured && <Badge>Featured</Badge>}
                    {post.editorsPick && <Badge variant="outline">Editor&apos;s Pick</Badge>}
                  </div>

                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-5">
                    {post.title}
                  </h1>

                  {post.excerpt && (
                    <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    {post.author && (
                      <Link
                        href={`/authors/${post.author.slug}`}
                        className="flex items-center gap-2.5 group"
                      >
                        <Avatar className="h-10 w-10 ring-2 ring-background">
                          <AvatarImage src={post.author.avatar || undefined} />
                          <AvatarFallback>
                            {post.author.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-semibold uppercase tracking-wide group-hover:text-primary transition-colors">
                            {post.author.name}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(post.publishedAt)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {readingTimeLabel(post.readingTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {post.wordCount.toLocaleString()} words
                      </span>
                      <EstimatedFinish readingTime={post.readingTime} />
                      <ScrollPercentage />
                      <ReadingStreakBadge />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <ArticleActions
                      slug={post.slug}
                      title={post.title}
                      likes={post.likes}
                      commentsCount={post.commentsCount}
                      shares={post.shares}
                    />
                    <ShareImageButton
                      title={post.title}
                      subtitle={post.excerpt}
                      author={post.author?.name}
                    />
                  </div>

                  <PinnedNotes notes={notes} />

                  <AiSummary slug={post.slug} initialSummary={post.aiSummary} />

                  {/* Author intro + inline subscribe — Lenny-style */}
                  {post.author?.bio && (
                    <div className="mt-4 mb-6 text-sm text-muted-foreground italic leading-relaxed">
                      👋 {post.author.bio}{" "}
                      {post.author.website && (
                        <a
                          href={post.author.website}
                          className="text-primary not-italic underline underline-offset-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          More
                        </a>
                      )}
                    </div>
                  )}

                  <div className="max-w-md mb-8">
                    <NewsletterForm />
                  </div>

                  <Separator className="mb-8" />

                  {post.coverImage && (
                    <figure className="mb-10 -mx-2 sm:mx-0 relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-lg">
                      <OptimizedImage
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 720px"
                        className="object-cover"
                      />
                    </figure>
                  )}
                </header>

                <div id="article-content">
                  <MdxContent source={post.content} dropCap={post.dropCap} />
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border/50">
                    {post.tags.map(({ tag }) => (
                      <Link key={tag.id} href={`/topics/${tag.slug}`}>
                        <Badge variant="outline" className="hover:bg-secondary">
                          #{tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Author card */}
                {post.author && (
                  <div className="mt-12 glass rounded-2xl p-6 flex gap-4">
                    <Avatar className="h-16 w-16 shrink-0">
                      <AvatarImage src={post.author.avatar || undefined} />
                      <AvatarFallback className="text-lg">
                        {post.author.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Written by
                      </p>
                      <Link
                        href={`/authors/${post.author.slug}`}
                        className="font-serif text-xl hover:text-primary transition-colors"
                      >
                        {post.author.name}
                      </Link>
                      {post.author.bio && (
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {post.author.bio}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Prev / Next */}
                <div className="mt-12 grid sm:grid-cols-2 gap-4">
                  {prev ? (
                    <Link
                      href={`/blog/${prev.slug}`}
                      className="glass rounded-2xl p-5 hover:shadow-md transition-all group"
                    >
                      <span className="text-xs text-muted-foreground">← Previous</span>
                      <p className="font-medium mt-1 group-hover:text-primary transition-colors line-clamp-2">
                        {prev.title}
                      </p>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {next && (
                    <Link
                      href={`/blog/${next.slug}`}
                      className="glass rounded-2xl p-5 hover:shadow-md transition-all group text-right sm:col-start-2"
                    >
                      <span className="text-xs text-muted-foreground">Next →</span>
                      <p className="font-medium mt-1 group-hover:text-primary transition-colors line-clamp-2">
                        {next.title}
                      </p>
                    </Link>
                  )}
                </div>

                {/* Comments placeholder */}
                <div className="mt-12 glass rounded-2xl p-8 text-center">
                  <h3 className="font-serif text-xl mb-2">Comments</h3>
                  <p className="text-sm text-muted-foreground">
                    Comments are coming soon. For now, reply on social or email the author.
                  </p>
                </div>

                {/* Newsletter */}
                <div className="mt-12 glass-strong rounded-2xl p-8">
                  <h3 className="font-serif text-2xl mb-2">Enjoyed this?</h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    Get the next essay in your inbox. Free, weekly, high-signal.
                  </p>
                  <NewsletterForm />
                </div>
              </ReaderWidthWrapper>
            </div>

            <ArticleSidebar
              author={post.author}
              related={related}
              popular={popular.filter((p) => p.id !== post.id).slice(0, 4)}
              tags={post.tags.map(({ tag }) => tag)}
              series={post.series}
            />
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-20">
              <h2 className="font-serif text-3xl tracking-tight mb-8">Related articles</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p, i) => (
                  <PostCard key={p.id} post={p} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
        <FloatingActions slug={post.slug} title={post.title} />
      </article>
    </>
  );
}
