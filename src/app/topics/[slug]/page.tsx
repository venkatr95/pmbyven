import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/posts/post-card";
import { getPublishedPosts, getAllTagSlugs } from "@/lib/posts";
import { db } from "@/lib/db";
import { getRobotsMetadata, getSiteConfig } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 60;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllTagSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await db.tag.findUnique({ where: { slug } });
  const site = getSiteConfig();
  if (!tag) return { title: "Topic", robots: { index: false, follow: false } };

  return {
    title: `#${tag.name}`,
    description: `Articles tagged ${tag.name} on ${site.siteName}`,
    robots: getRobotsMetadata(),
    alternates: { canonical: absoluteUrl(`/topics/${tag.slug}`) },
    openGraph: {
      title: `#${tag.name}`,
      url: absoluteUrl(`/topics/${tag.slug}`),
      siteName: site.siteName,
    },
  };
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  const tag = await db.tag.findUnique({ where: { slug } });
  if (!tag) notFound();

  const posts = await getPublishedPosts({ tagSlug: slug, take: 24 });

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="font-serif text-3xl sm:text-2xl tracking-tight mb-3">#{tag.name}</h1>
        <p className="text-muted-foreground mb-12">{tag.count} articles</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
