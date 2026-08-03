"use client";

import { useEffect, useState } from "react";
import { useReaderStore } from "@/store/reader";

export function EstimatedFinish({ readingTime }: { readingTime: number }) {
  const [finish, setFinish] = useState("");
  const fontSize = useReaderStore((s) => s.fontSize);
  // Larger font ≈ slightly slower effective speed
  const adjusted = Math.max(1, Math.round(readingTime * (fontSize / 18)));

  useEffect(() => {
    const end = new Date(Date.now() + adjusted * 60_000);
    setFinish(
      end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    );
  }, [adjusted]);

  return (
    <span className="text-xs text-muted-foreground">
      ~{adjusted} min · finish by {finish || "—"}
    </span>
  );
}

export function ScrollPercentage() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? Math.round((window.scrollY / h) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <span className="text-xs tabular-nums text-muted-foreground" aria-live="polite">
      {pct}%
    </span>
  );
}

export function ReadingStreakBadge() {
  const streak = useReaderStore((s) => s.readingStreak);
  if (streak < 1) return null;
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
      🔥 {streak}-day streak
    </span>
  );
}
