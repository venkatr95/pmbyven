import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { CaseStudyCard } from "@/components/collections/case-study-card";
import { EmptyState } from "@/components/ui/empty-state";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { caseStudies } from "@/lib/case-studies";
import { getRobotsMetadata, getSiteConfig } from "@/lib/seo";

const site = getSiteConfig();

export const metadata: Metadata = {
  title: "Collections",
  description: `Featured reading collections from ${site.siteName}.`,
  robots: getRobotsMetadata(),
  alternates: { canonical: `${site.siteUrl}/collections` },
};

export const revalidate = 60;

export default async function CollectionsPage() {
  const collections = await db.collection.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="font-serif text-3xl sm:text-2xl tracking-tight mb-3">Collections</h1>
        <p className="text-muted-foreground text-lg mb-12">Curated sets of essays worth a deep dive.</p>
        <section aria-labelledby="case-studies-heading" className="mb-16">
          <h2 id="case-studies-heading" className="font-serif text-2xl tracking-tight mb-6">
            Case studies
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.slug} study={study} />
            ))}
          </div>
        </section>
        {collections.length === 0 ? (
          <EmptyState
            title="No collections yet"
            description="Featured collections will appear here when published from admin."
            actionLabel="Browse blog"
            actionHref="/blog"
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((c) => {
              const ids = JSON.parse(c.postIds || "[]") as string[];
              return (
                <Link
                  key={c.id}
                  href={`/collections/${c.slug}`}
                  className="glass rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                >
                  <div className="relative aspect-[16/9] bg-muted">
                    <OptimizedImage
                      src={c.coverImage}
                      alt={c.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    {c.featured && (
                      <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                        Featured
                      </span>
                    )}
                    <h2 className="font-serif text-2xl group-hover:text-primary transition-colors mt-1">
                      {c.title}
                    </h2>
                    {c.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{c.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-3">{ids.length} articles</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
