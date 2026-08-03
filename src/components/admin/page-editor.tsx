"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { savePage } from "@/lib/actions/cms";

export function PageEditor({
  page,
}: {
  page?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    status: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
  };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(page?.title || "");
  const [slug, setSlug] = useState(page?.slug || "");
  const [content, setContent] = useState(page?.content || "");
  const [status, setStatus] = useState(page?.status || "published");
  const [seoTitle, setSeoTitle] = useState(page?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(page?.seoDescription || "");

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">{page ? "Edit page" : "New page"}</h1>
        <Button
          variant="cta"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const res = await savePage({
                id: page?.id,
                title,
                slug,
                content,
                status,
                seoTitle,
                seoDescription,
              });
              if (res.ok) {
                toast.success("Page saved");
                if (res.page && !page) router.push(`/admin/pages/${res.page.id}`);
                else router.refresh();
              }
            })
          }
        >
          Save
        </Button>
      </div>
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
          >
            <option value="published">published</option>
            <option value="draft">draft</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Content (MDX)</Label>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[280px] font-mono text-sm" />
        </div>
        <div className="space-y-2">
          <Label>SEO title</Label>
          <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>SEO description</Label>
          <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} />
        </div>
      </div>
    </div>
  );
}
