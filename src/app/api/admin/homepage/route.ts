import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const config = await db.themeConfig.findFirst();
  let sections: string[] = [];
  try {
    sections = JSON.parse(config?.homepageSections || "[]");
  } catch {
    sections = [];
  }
  return NextResponse.json({ sections });
}
