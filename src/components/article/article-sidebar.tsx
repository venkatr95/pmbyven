import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber } from "@/lib/utils";

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  views: number;
}

interface AuthorInfo {
  name: string;
  slug: string;
  bio?: string | null;
  avatar?: string | null;
}

export function ArticleSidebar({
  author,
  related,
  popular,
  tags,
  series,
}: {
  author?: AuthorInfo | null;
  related: RelatedPost[];
  popular: RelatedPost[];
  tags?: { name: string; slug: string }[];
  series?: { title: string; slug: string } | null;
}) {
  return (
    <aside className="hidden lg:block w-64 shrink-0 space-y-6 sticky top-28 self-start">
      {author && (
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={author.avatar || undefined} />
              <AvatarFallback>{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <Link
                href={`/authors/${author.slug}`}
                className="font-medium text-sm hover:text-primary transition-colors"
              >
                {author.name}
              </Link>
              <p className="text-xs text-muted-foreground">Author</p>
            </div>
          </div>
          {author.bio && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
              {author.bio}
            </p>
          )}
        </div>
      )}

      {series && (
        <div className="glass rounded-2xl p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Series
          </h4>
          <Link
            href={`/series/${series.slug}`}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            {series.title}
          </Link>
        </div>
      )}

      {related.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Related
          </h4>
          <ul className="space-y-3">
            {related.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="text-sm leading-snug hover:text-primary transition-colors line-clamp-2"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {popular.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Popular
          </h4>
          <ul className="space-y-3">
            {popular.map((p, i) => (
              <li key={p.id} className="flex gap-2">
                <span className="text-xs font-serif text-muted-foreground/50 w-4">
                  {i + 1}
                </span>
                <div>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="text-sm leading-snug hover:text-primary transition-colors line-clamp-2"
                  >
                    {p.title}
                  </Link>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {formatNumber(p.views)} views
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Tags
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Link key={t.slug} href={`/topics/${t.slug}`}>
                <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                  {t.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
