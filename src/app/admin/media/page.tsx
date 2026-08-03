"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMedia, deleteMedia } from "@/lib/actions/admin";

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  alt?: string | null;
  folder: string;
  mimeType?: string | null;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [url, setUrl] = useState("");
  const [filename, setFilename] = useState("");
  const [alt, setAlt] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");
  const [folder, setFolder] = useState("general");
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/media");
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = items.filter(
    (m) =>
      (!q || m.filename.toLowerCase().includes(q.toLowerCase()) || (m.alt || "").toLowerCase().includes(q.toLowerCase())) &&
      (!folder || folder === "all" || m.folder === folder)
  );

  async function onDrop(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("alt", alt || file.name);
        fd.append("folder", folder === "all" ? "uploads" : folder);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Upload failed");
      }
      toast.success("Upload complete");
      load();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="font-serif text-3xl tracking-tight">Media library</h1>
        <div className="flex gap-2">
          <Button variant={view === "grid" ? "default" : "outline"} size="sm" onClick={() => setView("grid")}>
            Grid
          </Button>
          <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>
            List
          </Button>
        </div>
      </div>

      <div
        className="glass rounded-2xl p-8 border-2 border-dashed border-border text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onDrop(e.dataTransfer.files);
        }}
      >
        <p className="text-sm text-muted-foreground mb-3">
          Drag & drop images/videos, or choose files (bulk supported)
        </p>
        <Input
          type="file"
          multiple
          accept="image/*,video/*"
          className="max-w-sm mx-auto"
          disabled={uploading}
          onChange={(e) => onDrop(e.target.files)}
        />
      </div>

      <form
        className="glass rounded-2xl p-5 grid sm:grid-cols-4 gap-3 items-end"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            await createMedia({
              url,
              filename: filename || url.split("/").pop() || "image",
              alt,
              folder: folder === "all" ? "general" : folder,
            });
            toast.success("Media added by URL");
            setUrl("");
            setFilename("");
            setAlt("");
            load();
          });
        }}
      >
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Or paste image URL</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} required className="rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label>Folder</Label>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="all">all</option>
            <option value="general">general</option>
            <option value="covers">covers</option>
            <option value="uploads">uploads</option>
          </select>
        </div>
        <Button type="submit" variant="cta" disabled={pending}>
          Add URL
        </Button>
        <div className="space-y-1.5 sm:col-span-4">
          <Label>Alt text / caption</Label>
          <Input value={alt} onChange={(e) => setAlt(e.target.value)} className="rounded-xl" />
        </div>
      </form>

      <Input
        placeholder="Search media…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="max-w-sm rounded-full"
      />

      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="glass rounded-2xl overflow-hidden">
              <div className="aspect-video bg-muted">
                {m.mimeType?.startsWith("video") ? (
                  <video src={m.url} className="h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.alt || ""} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{m.filename}</p>
                  <p className="text-[10px] text-muted-foreground">{m.folder}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() =>
                    startTransition(async () => {
                      await deleteMedia(m.id);
                      load();
                    })
                  }
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl divide-y divide-border/40">
          {filtered.map((m) => (
            <div key={m.id} className="flex items-center gap-4 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt="" className="h-12 w-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{m.filename}</p>
                <p className="text-xs text-muted-foreground truncate">{m.url}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() =>
                  startTransition(async () => {
                    await deleteMedia(m.id);
                    load();
                  })
                }
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
