import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getTags } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  title: "Topics",
  description: "Browse pmbyven by topic and tag — a cloud of ideas sized by popularity.",
  path: "/topics",
});

export const revalidate = 60;

export default async function TopicsPage() {
  const tags = await getTags();
  const max = Math.max(...tags.map((t) => t.count), 1);

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl mb-12 mx-auto text-center">
          <h1 className="font-serif text-3xl sm:text-2xl tracking-tight mb-3">Topics</h1>
          <p className="text-muted-foreground text-lg">
            A cloud of ideas — sized by popularity.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
          {tags.map((tag) => {
            const scale = 0.85 + (tag.count / max) * 0.6;
            return (
              <Link key={tag.id} href={`/topics/${tag.slug}`} prefetch>
                <Badge
                  variant="glass"
                  className="hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                  style={{
                    fontSize: `${scale}rem`,
                    padding: `${0.35 * scale}rem ${0.75 * scale}rem`,
                  }}
                >
                  {tag.name}
                  <span className="ml-1.5 opacity-50 text-[0.75em]">{tag.count}</span>
                </Badge>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
