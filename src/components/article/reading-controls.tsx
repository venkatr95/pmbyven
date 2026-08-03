"use client";

import { useEffect, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Share2,
  Printer,
  Maximize,
  Minimize,
  Type,
  Columns,
  Eye,
  EyeOff,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReaderStore } from "@/store/reader";
import { cn, formatNumber } from "@/lib/utils";

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("article-content");
      if (!el) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
        return;
      }
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      setProgress(total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="reading-progress"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}

export function ArticleActions({
  slug,
  title,
  likes = 0,
  commentsCount = 0,
  shares = 0,
}: {
  slug: string;
  title: string;
  likes?: number;
  commentsCount?: number;
  shares?: number;
}) {
  const {
    toggleBookmark,
    isBookmarked,
    fontSize,
    setFontSize,
    readingWidth,
    setReadingWidth,
    distractionFree,
    setDistractionFree,
    fullscreen,
    setFullscreen,
    addRecentlyViewed,
    updateStreak,
  } = useReaderStore();

  const [copied, setCopied] = useState(false);
  const bookmarked = isBookmarked(slug);

  useEffect(() => {
    addRecentlyViewed(slug);
    updateStreak();
  }, [slug, addRecentlyViewed, updateStreak]);

  useEffect(() => {
    document.documentElement.style.setProperty("--reader-font-size", `${fontSize}px`);
  }, [fontSize]);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2000);
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href });
    } else {
      await copyLink();
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
          ♥ {formatNumber(likes)}
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
          💬 {formatNumber(commentsCount)}
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
          ↻ {formatNumber(shares)}
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            toggleBookmark(slug);
            toast.success(bookmarked ? "Removed bookmark" : "Bookmarked");
          }}
          aria-label="Bookmark"
        >
          {bookmarked ? (
            <BookmarkCheck className="h-4 w-4 text-primary" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </Button>

        <Button variant="ghost" size="icon-sm" onClick={share} aria-label="Share">
          <Share2 className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon-sm" onClick={copyLink} aria-label="Copy link">
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Link2 className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => window.print()}
          aria-label="Print"
        >
          <Printer className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Reading settings">
              <Type className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Reading settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-2 space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1.5">Font size</div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                  >
                    A−
                  </Button>
                  <span className="text-xs tabular-nums w-8 text-center">{fontSize}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFontSize(Math.min(28, fontSize + 1))}
                  >
                    A+
                  </Button>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1.5">Width</div>
                <div className="flex gap-1">
                  {(["narrow", "normal", "wide"] as const).map((w) => (
                    <Button
                      key={w}
                      size="sm"
                      variant={readingWidth === w ? "default" : "outline"}
                      onClick={() => setReadingWidth(w)}
                      className="capitalize flex-1"
                    >
                      {w[0]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDistractionFree(!distractionFree)}>
              {distractionFree ? (
                <Eye className="h-4 w-4 mr-2" />
              ) : (
                <EyeOff className="h-4 w-4 mr-2" />
              )}
              {distractionFree ? "Exit distraction-free" : "Distraction-free"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFullscreen(!fullscreen)}>
              {fullscreen ? (
                <Minimize className="h-4 w-4 mr-2" />
              ) : (
                <Maximize className="h-4 w-4 mr-2" />
              )}
              {fullscreen ? "Exit fullscreen" : "Fullscreen reading"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" className="rounded-full ml-1" onClick={share}>
          Share
        </Button>
      </div>
    </div>
  );
}

export function ReaderWidthWrapper({ children }: { children: React.ReactNode }) {
  const readingWidth = useReaderStore((s) => s.readingWidth);
  const distractionFree = useReaderStore((s) => s.distractionFree);

  return (
    <div
      className={cn(
        "w-full mx-auto transition-all duration-300",
        readingWidth === "narrow" && "reader-narrow",
        readingWidth === "normal" && "reader-normal",
        readingWidth === "wide" && "reader-wide",
        distractionFree && "max-w-2xl"
      )}
    >
      {children}
    </div>
  );
}
