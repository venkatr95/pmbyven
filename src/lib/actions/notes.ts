"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) throw new Error("Unauthorized");
}

const noteSchema = z.object({
  id: z.string().optional(),
  postId: z.string().optional().nullable(),
  title: z.string().min(1),
  body: z.string().min(1),
  color: z.string().optional(),
  pinned: z.boolean().optional(),
  global: z.boolean().optional(),
  order: z.number().optional(),
});

export async function savePinnedNote(raw: z.infer<typeof noteSchema>) {
  await requireAdmin();
  const data = noteSchema.parse(raw);
  const payload = {
    title: data.title,
    body: data.body,
    color: data.color || "amber",
    pinned: data.pinned ?? true,
    global: data.global ?? false,
    postId: data.postId || null,
    order: data.order ?? 0,
  };

  if (data.id) {
    await db.pinnedNote.update({ where: { id: data.id }, data: payload });
  } else {
    await db.pinnedNote.create({ data: payload });
  }

  revalidatePath("/");
  if (data.postId) {
    const post = await db.post.findUnique({ where: { id: data.postId }, select: { slug: true } });
    if (post) revalidatePath(`/blog/${post.slug}`);
  }
  revalidatePath("/admin/notes");
  return { ok: true as const };
}

export async function deletePinnedNote(id: string) {
  await requireAdmin();
  await db.pinnedNote.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/notes");
  return { ok: true as const };
}

export async function getNotesForPost(postId: string) {
  return db.pinnedNote.findMany({
    where: {
      pinned: true,
      OR: [{ postId }, { global: true }],
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function getGlobalNotes() {
  return db.pinnedNote.findMany({
    where: { pinned: true, global: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}
