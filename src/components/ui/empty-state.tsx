import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  className,
  icon,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className={cn("glass rounded-2xl p-12 text-center", className)}>
      {icon && <div className="mb-4 flex justify-center text-muted-foreground">{icon}</div>}
      <h3 className="font-serif text-xl mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">{description}</p>}
      {actionLabel && actionHref && (
        <Button asChild variant="cta" size="sm">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
