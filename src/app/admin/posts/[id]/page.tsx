import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PostEditor } from "@/components/admin/post-editor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories, tags, series, authors] = await Promise.all([
    db.post.findUnique({
      where: { id },
      include: { tags: true },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.tag.findMany({ orderBy: { name: "asc" } }),
    db.series.findMany({ orderBy: { title: "asc" } }),
    db.author.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  return (
    <PostEditor
      post={post}
      categories={categories}
      tags={tags}
      series={series}
      authors={authors}
    />
  );
}
