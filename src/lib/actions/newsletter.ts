"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { fanOutNewsletterIntegrations } from "@/lib/newsletter-integrations";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().optional(),
});

export async function subscribeNewsletter(email: string, name?: string) {
  const parsed = schema.safeParse({ email, name });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.errors[0]?.message };
  }

  try {
    await db.subscriber.upsert({
      where: { email: parsed.data.email.toLowerCase() },
      create: {
        email: parsed.data.email.toLowerCase(),
        name: parsed.data.name || null,
        status: "active",
        source: "website",
      },
      update: {
        status: "active",
        ...(parsed.data.name ? { name: parsed.data.name } : {}),
      },
    });

    await db.analyticsEvent.create({
      data: { type: "subscribe", path: "/", meta: parsed.data.email },
    });

    // Optional third-party fan-out (ConvertKit, Buttondown, Mailchimp, webhook)
    const integrations = await fanOutNewsletterIntegrations({
      email: parsed.data.email,
      name: parsed.data.name,
      source: "website",
    });

    return { ok: true as const, integrations };
  } catch {
    return { ok: false as const, error: "Could not subscribe. Try again." };
  }
}

export async function exportSubscribersCsv() {
  const subs = await db.subscriber.findMany({ orderBy: { createdAt: "desc" } });
  const header = "email,name,status,source,createdAt\n";
  const rows = subs
    .map(
      (s) =>
        `${s.email},${s.name || ""},${s.status},${s.source || ""},${s.createdAt.toISOString()}`
    )
    .join("\n");
  return header + rows;
}
