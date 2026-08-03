import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getPublishedPosts, getAllAuthorSlugs } from "@/lib/posts";
import { PostCard } from "@/components/posts/post-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getRobotsMetadata, getSiteConfig } from "@/lib/seo";
import { absoluteUrl } from "@/lib/utils";

export const revalidate = 60;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllAuthorSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await db.author.findUnique({ where: { slug } });
  const site = getSiteConfig();
  if (!author) return { title: "Author", robots: { index: false, follow: false } };
  return {
    title: author.name,
    description: author.bio || `Articles by ${author.name} on ${site.siteName}`,
    robots: getRobotsMetadata(),
    alternates: { canonical: absoluteUrl(`/authors/${author.slug}`) },
    openGraph: {
      title: author.name,
      description: author.bio || undefined,
      url: absoluteUrl(`/authors/${author.slug}`),
      siteName: site.siteName,
      images: author.avatar ? [{ url: author.avatar }] : undefined,
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = await db.author.findUnique({ where: { slug } });
  if (!author) notFound();

  const posts = await getPublishedPosts({ authorSlug: slug, take: 24 });

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-12 glass rounded-2xl p-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={author.avatar || undefined} />
            <AvatarFallback className="text-2xl">
              {author.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">{author.name}</h1>
            <p className="text-sm text-muted-foreground mt-1 capitalize">{author.role}</p>
            {author.bio && (
              <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">{author.bio}</p>
            )}
          </div>
        </div>
        <h2 className="font-serif text-2xl mb-6">Articles</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
