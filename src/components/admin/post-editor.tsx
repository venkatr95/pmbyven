"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { savePost } from "@/lib/actions/admin";
import { slugify } from "@/lib/utils";

interface Option {
  id: string;
  name?: string;
  title?: string;
}

interface PostEditorProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    coverImage?: string | null;
    status: string;
    featured: boolean;
    editorsPick: boolean;
    dropCap: boolean;
    pinned?: boolean;
    categoryId?: string | null;
    seriesId?: string | null;
    authorId?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
    tags?: { tagId: string }[];
  };
  categories: Option[];
  tags: Option[];
  series: Option[];
  authors: Option[];
}

export function PostEditor({ post, categories, tags, series, authors }: PostEditorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [coverImage, setCoverImage] = useState(post?.coverImage || "");
  const [status, setStatus] = useState(post?.status || "draft");
  const [featured, setFeatured] = useState(post?.featured || false);
  const [editorsPick, setEditorsPick] = useState(post?.editorsPick || false);
  const [dropCap, setDropCap] = useState(post?.dropCap || false);
  const [pinned, setPinned] = useState(post?.pinned || false);
  const [categoryId, setCategoryId] = useState(post?.categoryId || "");
  const [seriesId, setSeriesId] = useState(post?.seriesId || "");
  const [authorId, setAuthorId] = useState(post?.authorId || "");
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription || "");
  const [tagIds, setTagIds] = useState<string[]>(post?.tags?.map((t) => t.tagId) || []);
  const [split, setSplit] = useState(true);

  const previewHtml = useMemo(() => {
    // lightweight markdown-ish preview
    return content
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/`([^`]+)`/gim, "<code>$1</code>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br/>");
  }, [content]);

  function onSave(nextStatus?: string) {
    startTransition(async () => {
      const res = await savePost({
        id: post?.id,
        title,
        slug: slug || slugify(title),
        excerpt,
        content,
        coverImage,
        status: (nextStatus || status) as "draft" | "published" | "scheduled" | "archived" | "trash",
        featured,
        editorsPick,
        dropCap,
        pinned,
        categoryId: categoryId || null,
        seriesId: seriesId || null,
        authorId: authorId || null,
        seoTitle,
        seoDescription,
        tagIds,
      });
      if (res.ok) {
        toast.success(nextStatus === "published" ? "Published" : "Saved");
        if (!post?.id && res.post) {
          router.push(`/admin/posts/${res.post.id}`);
        } else {
          router.refresh();
        }
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="font-serif text-3xl tracking-tight">
          {post ? "Edit post" : "New post"}
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setSplit(!split)}>
            {split ? "Editor only" : "Split preview"}
          </Button>
          <Button variant="outline" onClick={() => onSave("draft")} disabled={pending}>
            Save draft
          </Button>
          <Button variant="cta" onClick={() => onSave("published")} disabled={pending}>
            {pending ? "Saving…" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className={`${split ? "lg:col-span-2" : "lg:col-span-3"} space-y-4`}>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!post) setSlug(slugify(e.target.value));
            }}
            placeholder="Post title"
            className="h-14 text-xl font-serif rounded-2xl"
          />

          <Tabs defaultValue="write">
            <TabsList>
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="write">
              <div className="flex flex-wrap gap-1 mb-2 p-2 glass rounded-xl">
                {[
                  { label: "H2", insert: "\n## " },
                  { label: "Bold", insert: "**bold**" },
                  { label: "Quote", insert: "\n> " },
                  { label: "Code", insert: "\n```ts\n\n```\n" },
                  { label: "Callout", insert: '\n<Callout type="info" title="Note">\n\n</Callout>\n' },
                  { label: "YouTube", insert: '\n<YouTube id="VIDEO_ID" />\n' },
                  { label: "Mermaid", insert: "\n<Mermaid chart={`graph TD; A-->B`} />\n" },
                  { label: "Math", insert: "\n$$\nE = mc^2\n$$\n" },
                  { label: "Image", insert: '\n![alt](https://)\n' },
                  { label: "Expand", insert: '\n<Expandable title="More">\n\n</Expandable>\n' },
                ].map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    className="text-xs px-2.5 py-1 rounded-full border border-border hover:bg-secondary"
                    onClick={() => setContent((c) => c + t.insert)}
                  >
                    {t.label}
                  </button>
                ))}
                <span className="text-[10px] text-muted-foreground self-center ml-2">
                  Slash-style inserts · MDX components
                </span>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write in Markdown / MDX… Type / via toolbar inserts for blocks, embeds, mermaid, math…"
                className="min-h-[480px] font-mono text-sm rounded-2xl"
              />
            </TabsContent>
            <TabsContent value="preview">
              <div
                className="prose-editorial min-h-[480px] glass rounded-2xl p-6"
                dangerouslySetInnerHTML={{ __html: `<p>${previewHtml}</p>` }}
              />
            </TabsContent>
          </Tabs>

          {split && (
            <div className="hidden lg:block">
              <Label className="mb-2 block text-muted-foreground">Live preview</Label>
              <div
                className="prose-editorial glass rounded-2xl p-6 max-h-[400px] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: `<p>${previewHtml}</p>` }}
              />
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="font-medium text-sm">Settings</h3>
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
                {["draft", "published", "scheduled", "archived", "trash"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Cover image URL</Label>
              <Input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="rounded-xl"
                placeholder="https://…"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Featured</Label>
              <Switch checked={featured} onCheckedChange={setFeatured} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Editor&apos;s pick</Label>
              <Switch checked={editorsPick} onCheckedChange={setEditorsPick} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Drop cap</Label>
              <Switch checked={dropCap} onCheckedChange={setDropCap} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Pinned article</Label>
              <Switch checked={pinned} onCheckedChange={setPinned} />
            </div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="font-medium text-sm">Taxonomy</h3>
            <div className="space-y-2">
              <Label>Author</Label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
              >
                <option value="">—</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
              >
                <option value="">—</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Series</Label>
              <select
                value={seriesId}
                onChange={(e) => setSeriesId(e.target.value)}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
              >
                <option value="">—</option>
                {series.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {tags.map((t) => {
                  const on = tagIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() =>
                        setTagIds((ids) =>
                          on ? ids.filter((x) => x !== t.id) : [...ids, t.id]
                        )
                      }
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        on
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-secondary"
                      }`}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5 space-y-4">
            <h3 className="font-medium text-sm">SEO</h3>
            <div className="space-y-2">
              <Label>SEO title</Label>
              <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>SEO description</Label>
              <Textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={3}
                className="rounded-xl"
              />
            </div>
            <div className="rounded-xl border border-border p-3 bg-muted/30">
              <p className="text-xs text-primary mb-0.5">Open Graph preview</p>
              <p className="text-sm font-medium line-clamp-1">{seoTitle || title || "Title"}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {seoDescription || excerpt || "Description"}
              </p>
            </div>
            <div className="rounded-xl border border-border p-3 bg-muted/30">
              <p className="text-xs text-muted-foreground mb-0.5">Twitter card</p>
              <p className="text-sm font-medium line-clamp-1">{seoTitle || title || "Title"}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {seoDescription || excerpt || "Description"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
