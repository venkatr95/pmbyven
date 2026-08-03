"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CodeBlock({
  children,
  className,
  "data-language": language,
  "data-line-numbers": lineNumbers,
  ...props
}: React.HTMLAttributes<HTMLPreElement> & {
  "data-language"?: string;
  "data-line-numbers"?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const extract = (node: unknown): string => {
      if (node == null) return "";
      if (typeof node === "string" || typeof node === "number") return String(node);
      if (Array.isArray(node)) return node.map(extract).join("");
      if (typeof node === "object" && node !== null && "props" in node) {
        return extract((node as { props?: { children?: unknown } }).props?.children);
      }
      return "";
    };
    const text = extract(children);
    await navigator.clipboard.writeText(text.replace(/\n$/, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group relative my-6">
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        {language && (
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-medium">
            {language}
          </span>
        )}
        <button
          type="button"
          onClick={copy}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <pre
        className={cn(
          "overflow-x-auto rounded-2xl !bg-[hsl(var(--code-bg))] !text-[hsl(var(--code-fg))] p-4 pt-12 text-sm leading-relaxed border border-border/30",
          lineNumbers && "line-numbers",
          className
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

export function InlineCode({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "rounded-md bg-muted px-1.5 py-0.5 text-[0.875em] font-mono",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}
