import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;

  // Production: Turso (libSQL over HTTP). See docs/TURSO.md.
  if (tursoUrl) {
    const adapter = new PrismaLibSql({
      url: tursoUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }

  // Local / CI: SQLite file via better-sqlite3
  const url = process.env.DATABASE_URL || "file:./prisma/dev.db";
  let dbPath = url.replace(/^file:/, "");
  if (dbPath.startsWith("./")) {
    dbPath = path.join(/* turbopackIgnore: true */ process.cwd(), dbPath.slice(2));
  } else if (!path.isAbsolute(dbPath)) {
    dbPath = path.join(/* turbopackIgnore: true */ process.cwd(), dbPath);
  }
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
