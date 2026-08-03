"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) throw new Error("Unauthorized");
}

export async function savePage(raw: {
  id?: string;
  title: string;
  slug?: string;
  content: string;
  status?: string;
  seoTitle?: string;
  seoDescription?: string;
}) {
  await requireAdmin();
  const data = z
    .object({
      id: z.string().optional(),
      title: z.string().min(1),
      slug: z.string().optional(),
      content: z.string(),
      status: z.string().optional(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
    })
    .parse(raw);

  const slug = data.slug || slugify(data.title);
  const payload = {
    title: data.title,
    slug,
    content: data.content,
    status: data.status || "published",
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
  };

  const page = data.id
    ? await db.page.update({ where: { id: data.id }, data: payload })
    : await db.page.create({ data: payload });

  revalidatePath(`/${page.slug}`);
  revalidatePath("/admin/pages");
  return { ok: true as const, page };
}

export async function deletePage(id: string) {
  await requireAdmin();
  await db.page.delete({ where: { id } });
  revalidatePath("/admin/pages");
  return { ok: true as const };
}

export async function saveAuthor(raw: {
  id?: string;
  name: string;
  slug?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  twitter?: string;
  website?: string;
  role?: string;
}) {
  await requireAdmin();
  const slug = raw.slug || slugify(raw.name);
  const payload = {
    name: raw.name,
    slug,
    email: raw.email || null,
    bio: raw.bio || null,
    avatar: raw.avatar || null,
    twitter: raw.twitter || null,
    website: raw.website || null,
    role: raw.role || "writer",
  };
  if (raw.id) {
    await db.author.update({ where: { id: raw.id }, data: payload });
  } else {
    await db.author.create({ data: payload });
  }
  revalidatePath("/admin/authors");
  return { ok: true as const };
}

export async function deleteAuthor(id: string) {
  await requireAdmin();
  await db.author.delete({ where: { id } });
  revalidatePath("/admin/authors");
  return { ok: true as const };
}

export async function saveHomepageSections(sections: string[]) {
  await requireAdmin();
  const existing = await db.themeConfig.findFirst();
  const value = JSON.stringify(sections);
  if (existing) {
    await db.themeConfig.update({
      where: { id: existing.id },
      data: { homepageSections: value },
    });
  } else {
    await db.themeConfig.create({
      data: { name: "default", homepageSections: value },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin/homepage");
  return { ok: true as const };
}

export async function saveMenuItems(
  menuId: string,
  items: { id?: string; label: string; href: string; order: number }[]
) {
  await requireAdmin();
  await db.menuItem.deleteMany({ where: { menuId } });
  if (items.length) {
    await db.menuItem.createMany({
      data: items.map((item, i) => ({
        menuId,
        label: item.label,
        href: item.href,
        order: item.order ?? i,
      })),
    });
  }
  revalidatePath("/");
  revalidatePath("/admin/menus");
  return { ok: true as const };
}

export async function saveCollection(raw: {
  id?: string;
  title: string;
  slug?: string;
  description?: string;
  coverImage?: string;
  featured?: boolean;
  postIds?: string[];
}) {
  await requireAdmin();
  const slug = raw.slug || slugify(raw.title);
  const payload = {
    title: raw.title,
    slug,
    description: raw.description || null,
    coverImage: raw.coverImage || null,
    featured: raw.featured ?? false,
    postIds: JSON.stringify(raw.postIds || []),
  };
  if (raw.id) {
    await db.collection.update({ where: { id: raw.id }, data: payload });
  } else {
    await db.collection.create({ data: payload });
  }
  revalidatePath("/collections");
  revalidatePath("/admin/collections");
  return { ok: true as const };
}

export async function saveAnnouncement(raw: {
  id?: string;
  message: string;
  href?: string;
  active?: boolean;
}) {
  await requireAdmin();
  if (raw.id) {
    await db.announcement.update({
      where: { id: raw.id },
      data: {
        message: raw.message,
        href: raw.href || null,
        active: raw.active ?? true,
      },
    });
  } else {
    await db.announcement.create({
      data: {
        message: raw.message,
        href: raw.href || null,
        active: raw.active ?? true,
      },
    });
  }
  revalidatePath("/");
  return { ok: true as const };
}

export async function bulkUpdatePosts(
  ids: string[],
  action: "publish" | "draft" | "trash" | "archive" | "feature" | "unfeature"
) {
  await requireAdmin();
  const data =
    action === "publish"
      ? { status: "published", publishedAt: new Date() }
      : action === "draft"
        ? { status: "draft" }
        : action === "trash"
          ? { status: "trash" }
          : action === "archive"
            ? { status: "archived" }
            : action === "feature"
              ? { featured: true }
              : { featured: false };

  await db.post.updateMany({ where: { id: { in: ids } }, data });
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath("/");
  return { ok: true as const };
}

export async function exportBackup() {
  await requireAdmin();
  const [posts, categories, tags, authors, series, pages, subscribers, media, settings] =
    await Promise.all([
      db.post.findMany(),
      db.category.findMany(),
      db.tag.findMany(),
      db.author.findMany(),
      db.series.findMany(),
      db.page.findMany(),
      db.subscriber.findMany(),
      db.media.findMany(),
      db.setting.findMany(),
    ]);
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      posts,
      categories,
      tags,
      authors,
      series,
      pages,
      subscribers,
      media,
      settings,
    },
    null,
    2
  );
}

export async function saveFullThemeConfig(data: {
  activeTheme?: string;
  accent?: string;
  fontHeading?: string;
  fontBody?: string;
  radius?: string;
  glassIntensity?: string;
  animationSpeed?: string;
  containerWidth?: string;
}) {
  await requireAdmin();
  const existing = await db.themeConfig.findFirst();
  if (existing) {
    await db.themeConfig.update({ where: { id: existing.id }, data });
  } else {
    await db.themeConfig.create({ data: { name: "default", ...data } });
  }
  revalidatePath("/");
  return { ok: true as const };
}
