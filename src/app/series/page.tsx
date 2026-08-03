import type { Metadata } from "next";
import Link from "next/link";
import { getSeriesList } from "@/lib/posts";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { getRobotsMetadata, getSiteConfig } from "@/lib/seo";

const site = getSiteConfig();

export const metadata: Metadata = {
  title: "Series",
  description: `Multi-part deep dives from ${site.siteName}.`,
  robots: getRobotsMetadata(),
  alternates: { canonical: `${site.siteUrl}/series` },
};

export const revalidate = 60;

export default async function SeriesPage() {
  const series = await getSeriesList();

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="font-serif text-3xl sm:text-2xl tracking-tight mb-3">Series</h1>
        <p className="text-muted-foreground text-lg mb-12">Long-form journeys, part by part.</p>
        <div className="grid sm:grid-cols-2 gap-6">
          {series.map((s) => (
            <Link
              key={s.id}
              href={`/series/${s.slug}`}
              className="glass rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
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
                <h2 className="font-serif text-2xl group-hover:text-primary transition-colors">{s.title}</h2>
                {s.description && (
                  <p className="text-sm text-muted-foreground mt-2">{s.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-4">{s.posts.length} parts</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
