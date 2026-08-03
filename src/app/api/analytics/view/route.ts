import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const postId = typeof body.postId === "string" ? body.postId : null;
    const path = typeof body.path === "string" ? body.path : null;
    if (!postId) {
      return NextResponse.json({ error: "postId required" }, { status: 400 });
    }

    await db.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });

    await db.analyticsEvent.create({
      data: {
        type: "pageview",
        path: path || undefined,
        postId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
