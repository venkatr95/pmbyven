import Link from "next/link";
import { getCategories } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  title: "Categories",
  description: "Browse pmbyven by category — product, design, engineering, and craft.",
  path: "/categories",
});

/** ISR — static HTML, revalidate every minute */
export const revalidate = 60;

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <h1 className="font-serif text-3xl sm:text-2xl tracking-tight mb-3">Categories</h1>
          <p className="text-muted-foreground text-lg">
            Explore the publication by discipline.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              prefetch
              className="glass rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all group"
            >
              <span className="text-4xl mb-4 block">{cat.icon || "📁"}</span>
              <h2 className="font-serif text-2xl group-hover:text-primary transition-colors">
                {cat.name}
              </h2>
              {cat.description && (
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {cat.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                {cat._count.posts} articles
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
