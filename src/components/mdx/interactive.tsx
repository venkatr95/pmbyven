"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

function isRemoteSrc(src: string) {
  return src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/");
}

export function Expandable({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="my-4 glass rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left font-medium hover:bg-secondary/40 transition-colors"
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-muted-foreground border-t border-border/40 pt-4">{children}</div>}
    </div>
  );
}

export function Accordion({
  items,
}: {
  items: { title: string; content: React.ReactNode }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="my-6 space-y-2">
      {items.map((item, i) => (
        <Expandable key={i} title={item.title} defaultOpen={open === i}>
          {item.content}
        </Expandable>
      ))}
    </div>
  );
}

export function LightboxImage({
  src,
  alt = "",
  caption,
}: {
  src: string;
  alt?: string;
  caption?: string;
}) {
  const [open, setOpen] = useState(false);
  const remote = isRemoteSrc(src);

  return (
    <figure className="my-8">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full overflow-hidden rounded-2xl aspect-[16/10] bg-muted"
      >
        {remote ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
          />
        )}
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full glass opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="h-4 w-4" />
        </span>
      </button>
      {caption && (
        <figcaption className="text-center text-sm text-muted-foreground mt-3">{caption}</figcaption>
      )}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative w-full max-w-5xl aspect-[16/10] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {remote ? (
              <Image
                src={src}
                alt={alt}
                fill
                sizes="100vw"
                className="object-contain rounded-lg"
                priority
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt} className="max-h-[90vh] max-w-full rounded-lg mx-auto" />
            )}
          </div>
        </div>
      )}
    </figure>
  );
}

export function ImageGallery({
  images,
}: {
  images: { src: string; alt?: string; caption?: string }[];
}) {
  return (
    <div className="my-8 grid grid-cols-2 md:grid-cols-3 gap-3">
      {images.map((img, i) => (
        <LightboxImage key={i} src={img.src} alt={img.alt} caption={img.caption} />
      ))}
    </div>
  );
}

export function ComparisonSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [pos, setPos] = useState(50);
  return (
    <div className="my-8 relative aspect-[16/10] rounded-2xl overflow-hidden select-none glass">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={beforeLabel} className="absolute inset-0 w-full h-full object-cover max-w-none" style={{ width: `${10000 / pos}%` }} />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
        aria-label="Comparison slider"
      />
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-[5]" style={{ left: `${pos}%` }} />
      <span className="absolute top-3 left-3 text-xs bg-black/50 text-white px-2 py-1 rounded-full">{beforeLabel}</span>
      <span className="absolute top-3 right-3 text-xs bg-black/50 text-white px-2 py-1 rounded-full">{afterLabel}</span>
    </div>
  );
}

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "loose" });
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, chart.trim());
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Mermaid render failed");
      }
    }
    render();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <pre className="my-6 p-4 rounded-2xl bg-muted text-xs overflow-x-auto">
        Mermaid error: {error}
        {"\n"}
        {chart}
      </pre>
    );
  }

  return <div ref={ref} className="my-8 flex justify-center overflow-x-auto glass rounded-2xl p-6" />;
}

export function MathBlock({ children }: { children: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    async function run() {
      const katex = await import("katex");
      if (ref.current) {
        katex.default.render(children.trim(), ref.current, {
          displayMode: true,
          throwOnError: false,
        });
      }
    }
    run();
  }, [children]);
  return <div ref={ref} className="my-6 overflow-x-auto text-center" />;
}

export function Footnote({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <sup id={`fnref-${id}`} className="text-primary">
      <a href={`#fn-${id}`} className="no-underline text-xs font-medium">
        [{id}]
      </a>
      <span className="sr-only">{children}</span>
    </sup>
  );
}

export function Footnotes({
  items,
}: {
  items: { id: string; content: React.ReactNode }[];
}) {
  return (
    <section className="mt-12 pt-8 border-t border-border/50">
      <h3 className="font-serif text-lg mb-4">References & footnotes</h3>
      <ol className="space-y-2 text-sm text-muted-foreground list-decimal pl-5">
        {items.map((item) => (
          <li key={item.id} id={`fn-${item.id}`}>
            {item.content}{" "}
            <a href={`#fnref-${item.id}`} className="text-primary">
              ↩
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Highlight({ children }: { children: React.ReactNode }) {
  return <mark className="highlight">{children}</mark>;
}

export function TabsMDX({
  tabs,
}: {
  tabs: { label: string; content: React.ReactNode }[];
}) {
  const [active, setActive] = useState(0);
  return (
    <div className="my-6 glass rounded-2xl overflow-hidden">
      <div className="flex border-b border-border/50 overflow-x-auto">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
              active === i ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="p-5 text-sm">{tabs[active]?.content}</div>
    </div>
  );
}
