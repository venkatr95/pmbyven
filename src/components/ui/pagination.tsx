import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Pagination({
  page,
  totalPages,
  basePath,
  className,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  className?: string;
}) {
  if (totalPages <= 1) return null;
  const href = (p: number) => {
    const sep = basePath.includes("?") ? "&" : "?";
    return `${basePath}${sep}page=${p}`;
  };

  return (
    <nav className={cn("flex items-center justify-center gap-2", className)} aria-label="Pagination">
      <Button asChild variant="outline" size="sm" disabled={page <= 1}>
        <Link href={page > 1 ? href(page - 1) : "#"} aria-disabled={page <= 1}>
          Previous
        </Link>
      </Button>
      <span className="text-sm text-muted-foreground tabular-nums px-2">
        {page} / {totalPages}
      </span>
      <Button asChild variant="outline" size="sm" disabled={page >= totalPages}>
        <Link href={page < totalPages ? href(page + 1) : "#"} aria-disabled={page >= totalPages}>
          Next
        </Link>
      </Button>
    </nav>
  );
}
