import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/posts/post-card";
import {
  getPublishedPosts,
  getAllCategorySlugs,
} from "@/lib/posts";
import { db } from "@/lib/db";
import { getRobotsMetadata, getSiteConfig } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 60;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllCategorySlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await db.category.findUnique({ where: { slug } });
  const site = getSiteConfig();
  if (!cat) return { title: "Category", robots: { index: false, follow: false } };

  return {
    title: cat.name,
    description: cat.description || `Articles in ${cat.name} on ${site.siteName}`,
    robots: getRobotsMetadata(),
    alternates: { canonical: absoluteUrl(`/categories/${cat.slug}`) },
    openGraph: {
      title: cat.name,
      description: cat.description || undefined,
      url: absoluteUrl(`/categories/${cat.slug}`),
      siteName: site.siteName,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = await db.category.findUnique({ where: { slug } });
  if (!cat) notFound();

  const posts = await getPublishedPosts({ categorySlug: slug, take: 24 });

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12">
          <span className="text-4xl mb-3 block">{cat.icon || "📁"}</span>
          <h1 className="font-serif text-3xl sm:text-2xl tracking-tight mb-3">{cat.name}</h1>
          {cat.description && (
            <p className="text-muted-foreground text-lg max-w-xl">{cat.description}</p>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
        {posts.length === 0 && (
          <p className="text-muted-foreground text-center py-16">No articles in this category yet.</p>
        )}
      </div>
    </div>
  );
}
