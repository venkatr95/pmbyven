"use client";

import { useEffect } from "react";

/**
 * Fire-and-forget pageview counter so static/ISR pages can still record views
 * without blocking Server Component HTML or forcing force-dynamic.
 */
export function ViewTracker({ postId, path }: { postId: string; path: string }) {
  useEffect(() => {
    const key = `viewed:${postId}`;
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(key)) {
      return;
    }
    fetch("/api/analytics/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, path }),
      keepalive: true,
    }).catch(() => null);
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      /* private mode */
    }
  }, [postId, path]);

  return null;
}
