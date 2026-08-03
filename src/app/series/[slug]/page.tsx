import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CheckCircle2, Circle } from "lucide-react";
import { getAllSeriesSlugs } from "@/lib/posts";
import { getRobotsMetadata, getSiteConfig } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 60;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSeriesSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const series = await db.series.findUnique({ where: { slug } });
  const site = getSiteConfig();
  if (!series) return { title: "Series", robots: { index: false, follow: false } };
  return {
    title: series.title,
    description: series.description || undefined,
    robots: getRobotsMetadata(),
    alternates: { canonical: absoluteUrl(`/series/${series.slug}`) },
    openGraph: {
      title: series.title,
      description: series.description || undefined,
      url: absoluteUrl(`/series/${series.slug}`),
      siteName: site.siteName,
      images: series.coverImage ? [{ url: series.coverImage }] : undefined,
    },
  };
}

export default async function SeriesDetailPage({ params }: Props) {
  const { slug } = await params;
  const series = await db.series.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { status: "published" },
        orderBy: { seriesOrder: "asc" },
        include: { author: true },
      },
    },
  });
  if (!series) notFound();

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-serif text-3xl sm:text-2xl tracking-tight mb-3">{series.title}</h1>
        {series.description && (
          <p className="text-muted-foreground text-lg mb-8">{series.description}</p>
        )}

        <div className="glass rounded-2xl p-2 mb-8">
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] rounded-full"
              style={{ width: "100%" }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center py-2">
            {series.posts.length} parts · Continue series
          </p>
        </div>

        <ol className="space-y-3">
          {series.posts.map((post, i) => (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="flex items-start gap-4 glass rounded-2xl p-5 hover:shadow-md transition-all group"
              >
                <span className="mt-0.5 text-primary">
                  {i === 0 ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </span>
                <div>
                  <span className="text-xs text-muted-foreground">Part {post.seriesOrder || i + 1}</span>
                  <h2 className="font-medium group-hover:text-primary transition-colors">{post.title}</h2>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
