"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { generateAiSummary, isAiEnabled } from "@/lib/ai";
import { isAdminAuthenticated } from "@/lib/admin";

export async function getOrCreatePostSummary(slug: string, force = false) {
  const post = await db.post.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      content: true,
      aiSummary: true,
      aiSummaryAt: true,
      slug: true,
    },
  });
  if (!post) return { ok: false as const, error: "Post not found" };

  const staleMs = 1000 * 60 * 60 * 24 * 30; // 30 days
  const isFresh =
    post.aiSummary &&
    post.aiSummaryAt &&
    Date.now() - post.aiSummaryAt.getTime() < staleMs;

  if (!force && isFresh && post.aiSummary) {
    return {
      ok: true as const,
      summary: post.aiSummary,
      provider: "cached" as const,
      aiEnabled: isAiEnabled(),
    };
  }

  const { summary, provider } = await generateAiSummary({
    title: post.title,
    content: post.content,
  });

  await db.post.update({
    where: { id: post.id },
    data: { aiSummary: summary, aiSummaryAt: new Date() },
  });

  revalidatePath(`/blog/${post.slug}`);
  return {
    ok: true as const,
    summary,
    provider,
    aiEnabled: isAiEnabled(),
  };
}

export async function regeneratePostSummary(slug: string) {
  const admin = await isAdminAuthenticated();
  // Readers can request first generation; only admin can force regenerate cached
  return getOrCreatePostSummary(slug, admin);
}
