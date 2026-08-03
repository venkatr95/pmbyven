import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { isAdminAuthenticated } from "@/lib/admin";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const alt = (form.get("alt") as string) || "";
  const folder = (form.get("folder") as string) || "uploads";

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".bin";
  const filename = `${nanoid(10)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);

  const url = `/uploads/${folder}/${filename}`;
  const media = await db.media.create({
    data: {
      filename: file.name,
      url,
      alt,
      mimeType: file.type,
      size: bytes.length,
      folder,
    },
  });

  return NextResponse.json({ ok: true, media, url });
}
