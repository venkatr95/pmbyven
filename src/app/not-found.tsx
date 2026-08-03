import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-20 px-4">
      <div className="text-center max-w-md">
        <p className="font-serif text-8xl text-muted-foreground/30 mb-4">404</p>
        <h1 className="font-serif text-3xl mb-3">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          This page wandered off. Let&apos;s get you back to something beautiful.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="cta">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/blog">Blog</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
