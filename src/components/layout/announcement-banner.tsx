"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export function AnnouncementBanner({
  message,
  href,
  id = "default",
}: {
  message: string;
  href?: string;
  id?: string;
}) {
  const key = `pmbyven-banner-${id}`;
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(key)) {
      setVisible(true);
    }
  }, [key]);

  useEffect(() => {
    if (!visible) {
      document.documentElement.style.setProperty("--announcement-height", "0px");
      return;
    }
    const el = bannerRef.current;
    if (!el) return;
    const update = () =>
      document.documentElement.style.setProperty(
        "--announcement-height",
        `${el.offsetHeight}px`
      );
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    return () => {
      document.documentElement.style.setProperty("--announcement-height", "0px");
    };
  }, []);

  if (!visible || !message) return null;

  return (
    <div
      ref={bannerRef}
      className="relative z-[60] bg-gradient-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] text-white text-xs sm:text-sm"
    >
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-center gap-3">
        {href ? (
          <Link href={href} className="hover:underline font-medium text-center">
            {message}
          </Link>
        ) : (
          <p className="text-center font-medium">{message}</p>
        )}
        <button
          type="button"
          aria-label="Dismiss announcement"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20"
          onClick={() => {
            localStorage.setItem(key, "1");
            setVisible(false);
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
