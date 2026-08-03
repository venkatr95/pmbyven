import { db } from "@/lib/db";
import { PostEditor } from "@/components/admin/post-editor";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const [categories, tags, series, authors] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.tag.findMany({ orderBy: { name: "asc" } }),
    db.series.findMany({ orderBy: { title: "asc" } }),
    db.author.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <PostEditor
      categories={categories}
      tags={tags}
      series={series}
      authors={authors}
    />
  );
}
