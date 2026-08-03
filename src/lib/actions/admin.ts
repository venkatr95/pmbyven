"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { adminCookieName, getAdminSecret, isAdminAuthenticated } from "@/lib/admin";
import { estimateReadingTime, slugify, wordCount } from "@/lib/utils";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export async function loginAdmin(secret: string) {
  if (secret !== getAdminSecret()) {
    return { ok: false as const, error: "Invalid admin secret" };
  }
  const jar = await cookies();
  jar.set(adminCookieName(), secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return { ok: true as const };
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(adminCookieName());
  return { ok: true as const };
}

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverImage: z.string().optional(),
  status: z.enum(["draft", "published", "scheduled", "archived", "trash"]).default("draft"),
  featured: z.boolean().optional(),
  editorsPick: z.boolean().optional(),
  dropCap: z.boolean().optional(),
  pinned: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
  seriesId: z.string().optional().nullable(),
  authorId: z.string().optional().nullable(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  scheduledAt: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
});

export async function savePost(raw: z.infer<typeof postSchema>) {
  await requireAdmin();
  const data = postSchema.parse(raw);
  const slug = data.slug || slugify(data.title);
  const wc = wordCount(data.content);
  const rt = estimateReadingTime(data.content);

  let publishedAt: Date | null | undefined = undefined;
  if (data.status === "published") {
    if (data.id) {
      const existing = await db.post.findUnique({
        where: { id: data.id },
        select: { publishedAt: true, status: true },
      });
      publishedAt = existing?.publishedAt ?? new Date();
    } else {
      publishedAt = new Date();
    }
  } else if (data.scheduledAt) {
    publishedAt = new Date(data.scheduledAt);
  } else if (data.status === "draft") {
    publishedAt = null;
  }

  const payload = {
    title: data.title,
    slug,
    excerpt: data.excerpt || null,
    content: data.content,
    coverImage: data.coverImage || null,
    status: data.status,
    featured: data.featured ?? false,
    editorsPick: data.editorsPick ?? false,
    dropCap: data.dropCap ?? false,
    pinned: data.pinned ?? false,
    categoryId: data.categoryId || null,
    seriesId: data.seriesId || null,
    authorId: data.authorId || null,
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
    wordCount: wc,
    readingTime: rt,
    ...(publishedAt !== undefined ? { publishedAt } : {}),
    scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
  };

  const post = data.id
    ? await db.post.update({ where: { id: data.id }, data: payload })
    : await db.post.create({ data: payload });

  await db.revision.create({
    data: { postId: post.id, title: post.title, content: post.content },
  });

  if (data.tagIds) {
    await db.postTag.deleteMany({ where: { postId: post.id } });
    if (data.tagIds.length) {
      await db.postTag.createMany({
        data: data.tagIds.map((tagId) => ({ postId: post.id, tagId })),
      });
    }
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin");
  return { ok: true as const, post };
}

export async function deletePost(id: string, hard = false) {
  await requireAdmin();
  if (hard) {
    await db.post.delete({ where: { id } });
  } else {
    await db.post.update({ where: { id }, data: { status: "trash" } });
  }
  revalidatePath("/admin");
  revalidatePath("/blog");
  return { ok: true as const };
}

export async function restorePost(id: string) {
  await requireAdmin();
  await db.post.update({ where: { id }, data: { status: "draft" } });
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function duplicatePost(id: string) {
  await requireAdmin();
  const original = await db.post.findUnique({
    where: { id },
    include: { tags: true },
  });
  if (!original) return { ok: false as const, error: "Not found" };

  const post = await db.post.create({
    data: {
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Date.now().toString(36)}`,
      excerpt: original.excerpt,
      content: original.content,
      coverImage: original.coverImage,
      status: "draft",
      featured: false,
      editorsPick: false,
      dropCap: original.dropCap,
      categoryId: original.categoryId,
      seriesId: original.seriesId,
      authorId: original.authorId,
      wordCount: original.wordCount,
      readingTime: original.readingTime,
      seoTitle: original.seoTitle,
      seoDescription: original.seoDescription,
    },
  });

  if (original.tags.length) {
    await db.postTag.createMany({
      data: original.tags.map((t) => ({ postId: post.id, tagId: t.tagId })),
    });
  }

  revalidatePath("/admin");
  return { ok: true as const, post };
}

export async function saveCategory(data: {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  featured?: boolean;
}) {
  await requireAdmin();
  const slug = data.slug || slugify(data.name);
  if (data.id) {
    await db.category.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug,
        description: data.description,
        icon: data.icon,
        featured: data.featured,
      },
    });
  } else {
    await db.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        icon: data.icon,
        featured: data.featured ?? false,
      },
    });
  }
  revalidatePath("/admin");
  revalidatePath("/categories");
  return { ok: true as const };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await db.category.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/categories");
  return { ok: true as const };
}

export async function saveTag(data: { id?: string; name: string; slug?: string }) {
  await requireAdmin();
  const slug = data.slug || slugify(data.name);
  if (data.id) {
    await db.tag.update({ where: { id: data.id }, data: { name: data.name, slug } });
  } else {
    await db.tag.create({ data: { name: data.name, slug } });
  }
  revalidatePath("/admin");
  revalidatePath("/topics");
  return { ok: true as const };
}

export async function deleteTag(id: string) {
  await requireAdmin();
  await db.tag.delete({ where: { id } });
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function saveSeries(data: {
  id?: string;
  title: string;
  slug?: string;
  description?: string;
  coverImage?: string;
}) {
  await requireAdmin();
  const slug = data.slug || slugify(data.title);
  if (data.id) {
    await db.series.update({
      where: { id: data.id },
      data: {
        title: data.title,
        slug,
        description: data.description,
        coverImage: data.coverImage,
      },
    });
  } else {
    await db.series.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        coverImage: data.coverImage,
      },
    });
  }
  revalidatePath("/admin");
  revalidatePath("/series");
  return { ok: true as const };
}

export async function saveSetting(key: string, value: string) {
  await requireAdmin();
  await db.setting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function saveThemeConfig(data: {
  activeTheme?: string;
  accent?: string;
  glassIntensity?: string;
  animationSpeed?: string;
  homepageSections?: string;
}) {
  await requireAdmin();
  const existing = await db.themeConfig.findFirst();
  if (existing) {
    await db.themeConfig.update({ where: { id: existing.id }, data });
  } else {
    await db.themeConfig.create({ data: { name: "default", ...data } });
  }
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function createMedia(data: {
  filename: string;
  url: string;
  alt?: string;
  caption?: string;
  folder?: string;
  mimeType?: string;
}) {
  await requireAdmin();
  const media = await db.media.create({
    data: {
      filename: data.filename,
      url: data.url,
      alt: data.alt,
      caption: data.caption,
      folder: data.folder || "general",
      mimeType: data.mimeType,
    },
  });
  revalidatePath("/admin");
  return { ok: true as const, media };
}

export async function deleteMedia(id: string) {
  await requireAdmin();
  await db.media.delete({ where: { id } });
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function deleteSubscriber(id: string) {
  await requireAdmin();
  await db.subscriber.delete({ where: { id } });
  revalidatePath("/admin");
  return { ok: true as const };
}
