"use client";

import { useRef, useState } from "react";
import { Download, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function ShareImageButton({
  title,
  subtitle,
  author,
  siteName = "pmbyven",
}: {
  title: string;
  subtitle?: string | null;
  author?: string | null;
  siteName?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = 1200;
    const h = 630;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#0f172a");
    grad.addColorStop(0.5, "#1e293b");
    grad.addColorStop(1, "#0f172a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Accent blob
    const blob = ctx.createRadialGradient(w * 0.85, h * 0.2, 20, w * 0.85, h * 0.2, 280);
    blob.addColorStop(0, "rgba(59,130,246,0.45)");
    blob.addColorStop(1, "rgba(59,130,246,0)");
    ctx.fillStyle = blob;
    ctx.fillRect(0, 0, w, h);

    const blob2 = ctx.createRadialGradient(w * 0.15, h * 0.9, 20, w * 0.15, h * 0.9, 260);
    blob2.addColorStop(0, "rgba(168,85,247,0.35)");
    blob2.addColorStop(1, "rgba(168,85,247,0)");
    ctx.fillStyle = blob2;
    ctx.fillRect(0, 0, w, h);

    // Brand
    ctx.fillStyle = "#94a3b8";
    ctx.font = '600 28px "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif';
    ctx.fillText(siteName, 64, 72);

    // Logo circle
    const lg = ctx.createLinearGradient(64, 40, 104, 80);
    lg.addColorStop(0, "#3b82f6");
    lg.addColorStop(1, "#a855f7");
    ctx.beginPath();
    ctx.arc(48, 64, 14, 0, Math.PI * 2);
    ctx.fillStyle = lg;
    ctx.fill();

    // Title (wrap)
    ctx.fillStyle = "#ffffff";
    const titleSize = title.length > 70 ? 42 : title.length > 45 ? 48 : 56;
    ctx.font = `600 ${titleSize}px "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif`;
    const lines = wrapText(ctx, title, w - 128, 4);
    let y = 200;
    for (const line of lines) {
      ctx.fillText(line, 64, y);
      y += titleSize * 1.2;
    }

    // Subtitle
    if (subtitle) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = '400 26px "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif';
      const subLines = wrapText(ctx, subtitle, w - 128, 2);
      y += 16;
      for (const line of subLines) {
        ctx.fillText(line, 64, y);
        y += 34;
      }
    }

    // Author
    if (author) {
      ctx.fillStyle = "#cbd5e1";
      ctx.font = '500 22px "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif';
      ctx.fillText(author, 64, h - 64);
    }

    // Accent bar
    const bar = ctx.createLinearGradient(64, 0, 200, 0);
    bar.addColorStop(0, "#3b82f6");
    bar.addColorStop(1, "#a855f7");
    ctx.fillStyle = bar;
    ctx.fillRect(64, h - 48, 120, 6);

    setPreview(canvas.toDataURL("image/png"));
  }

  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
        if (lines.length >= maxLines) break;
      } else {
        current = test;
      }
    }
    if (current && lines.length < maxLines) lines.push(current);
    if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
      lines[maxLines - 1] = lines[maxLines - 1].replace(/\.?$/, "…");
    }
    return lines;
  }

  function download() {
    if (!preview) {
      draw();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `share-${title.slice(0, 40).replace(/\s+/g, "-").toLowerCase()}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
    toast.success("Share image downloaded");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) setTimeout(draw, 50);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full gap-1.5">
          <ImageIcon className="h-3.5 w-3.5" />
          Share image
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share image</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2">
          Generate a 1200×630 card for social posts. Also available via{" "}
          <code className="text-xs bg-muted px-1 rounded">/api/og</code>.
        </p>
        <canvas ref={canvasRef} className="hidden" />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Share preview" className="w-full rounded-xl border border-border" />
        ) : (
          <div className="aspect-[1200/630] rounded-xl bg-muted animate-pulse" />
        )}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={draw}>
            Refresh
          </Button>
          <Button variant="cta" onClick={download} className="gap-1.5">
            <Download className="h-4 w-4" />
            Download PNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
