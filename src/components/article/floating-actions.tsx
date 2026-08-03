"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Bookmark, BookmarkCheck, Share2, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReaderStore } from "@/store/reader";
import { toast } from "sonner";

export function FloatingActions({ slug, title }: { slug: string; title: string }) {
  const [show, setShow] = useState(false);
  const { toggleBookmark, isBookmarked, setDistractionFree, distractionFree } = useReaderStore();
  const bookmarked = isBookmarked(slug);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-2">
      <Button
        size="icon"
        variant="glass"
        className="shadow-lg"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="glass"
        className="shadow-lg"
        aria-label="Bookmark"
        onClick={() => {
          toggleBookmark(slug);
          toast.success(bookmarked ? "Removed bookmark" : "Bookmarked");
        }}
      >
        {bookmarked ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
      </Button>
      <Button
        size="icon"
        variant="glass"
        className="shadow-lg"
        aria-label="Share"
        onClick={async () => {
          if (navigator.share) {
            await navigator.share({ title, url: window.location.href });
          } else {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied");
          }
        }}
      >
        <Share2 className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="glass"
        className="shadow-lg"
        aria-label="Reading mode"
        onClick={() => setDistractionFree(!distractionFree)}
      >
        <Type className="h-4 w-4" />
      </Button>
    </div>
  );
}
