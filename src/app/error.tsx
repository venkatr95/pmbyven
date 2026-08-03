"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center pt-20 px-4">
      <div className="text-center max-w-md">
        <p className="font-serif text-8xl text-muted-foreground/30 mb-4">500</p>
        <h1 className="font-serif text-3xl mb-3">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset} variant="cta">
          Try again
        </Button>
      </div>
    </div>
  );
}
