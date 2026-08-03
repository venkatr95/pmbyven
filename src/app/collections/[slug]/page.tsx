import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PostCard } from "@/components/posts/post-card";
import { getAllCollectionSlugs } from "@/lib/posts";
import { getRobotsMetadata, getSiteConfig } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 60;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllCollectionSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await db.collection.findUnique({ where: { slug } });
  const site = getSiteConfig();
  if (!c) return { title: "Collection", robots: { index: false, follow: false } };
  return {
    title: c.title,
    description: c.description || undefined,
    robots: getRobotsMetadata(),
    alternates: { canonical: absoluteUrl(`/collections/${c.slug}`) },
    openGraph: {
      title: c.title,
      description: c.description || undefined,
      url: absoluteUrl(`/collections/${c.slug}`),
      siteName: site.siteName,
      images: c.coverImage ? [{ url: c.coverImage }] : undefined,
    },
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const collection = await db.collection.findUnique({ where: { slug } });
  if (!collection) notFound();

  const ids = JSON.parse(collection.postIds || "[]") as string[];
  const posts = ids.length
    ? await db.post.findMany({
      where: { id: { in: ids }, status: "published" },
      include: { author: true, category: true },
    })
    : [];

  // preserve order
  const ordered = ids
    .map((id) => posts.find((p) => p.id === id))
    .filter(Boolean) as typeof posts;

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="font-serif text-3xl sm:text-2xl tracking-tight mb-3">{collection.title}</h1>
        {collection.description && (
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">{collection.description}</p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ordered.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
