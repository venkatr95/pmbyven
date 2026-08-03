"use client";

import { useState, useTransition } from "react";
import { Sparkles, RefreshCw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrCreatePostSummary } from "@/lib/actions/ai-summary";
import { cn } from "@/lib/utils";

export function AiSummary({
  slug,
  initialSummary,
}: {
  slug: string;
  initialSummary?: string | null;
}) {
  const [summary, setSummary] = useState(initialSummary || "");
  const [provider, setProvider] = useState<string | null>(initialSummary ? "cached" : null);
  const [open, setOpen] = useState(Boolean(initialSummary));
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function load(force = false) {
    setError(null);
    startTransition(async () => {
      const res = await getOrCreatePostSummary(slug, force);
      if (!res.ok) {
        setError(res.error || "Could not generate summary");
        return;
      }
      setSummary(res.summary);
      setProvider(res.provider);
      setOpen(true);
    });
  }

  return (
    <div className="my-8 glass rounded-2xl overflow-hidden border border-primary/15">
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 bg-primary/5">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-medium"
          onClick={() => {
            if (!summary && !pending) load(false);
            else setOpen(!open);
          }}
        >
          <Sparkles className="h-4 w-4 text-primary" />
          AI summary
          {provider && (
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-normal">
              {provider === "xai"
                ? "SpaceXAI"
                : provider === "extractive"
                  ? "offline"
                  : provider}
            </span>
          )}
          <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>
        <div className="flex items-center gap-1">
          {!summary && (
            <Button size="sm" variant="cta" disabled={pending} onClick={() => load(false)}>
              {pending ? "Generating…" : "Generate"}
            </Button>
          )}
          {summary && (
            <Button
              size="icon-sm"
              variant="ghost"
              disabled={pending}
              aria-label="Regenerate summary"
              onClick={() => load(true)}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", pending && "animate-spin")} />
            </Button>
          )}
        </div>
      </div>
      {open && summary && (
        <div className="px-5 py-4 text-sm leading-relaxed text-muted-foreground border-t border-border/40">
          {summary}
        </div>
      )}
      {error && (
        <p className="px-5 py-3 text-xs text-destructive border-t border-border/40">{error}</p>
      )}
      {!summary && !pending && open && (
        <p className="px-5 py-3 text-xs text-muted-foreground border-t border-border/40">
          Uses SpaceXAI (xAI) when <code className="bg-muted px-1 rounded">XAI_API_KEY</code> is set;
          otherwise an extractive offline summary.
        </p>
      )}
    </div>
  );
}
