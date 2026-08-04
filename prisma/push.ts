import { createClient } from "@libsql/client";
import { execSync } from "child_process";
import fs from "fs";

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // If we aren't using Turso, fallback to normal prisma db push
  if (!url || !url.startsWith("libsql://")) {
    console.log("No Turso URL found, running standard prisma db push...");
    execSync("npx prisma db push", { stdio: "inherit" });
    return;
  }

  console.log("Turso database detected. Generating SQL from Prisma schema...");
  
  try {
    // Generate the raw SQL required to create the schema
    execSync("npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script > migration.sql", { stdio: "inherit" });
    let sql = fs.readFileSync("migration.sql", "utf8");

    // The diff is always generated from an empty schema, so on repeat deploys
    // the tables/indexes already exist in Turso. Make the statements idempotent
    // so re-applying an unchanged schema is a no-op instead of an error.
    sql = sql
      .replace(/CREATE TABLE "/gi, 'CREATE TABLE IF NOT EXISTS "')
      .replace(/CREATE UNIQUE INDEX "/gi, 'CREATE UNIQUE INDEX IF NOT EXISTS "')
      .replace(/CREATE INDEX "/gi, 'CREATE INDEX IF NOT EXISTS "');

    console.log("Connecting to Turso to apply schema...");
    const client = createClient({ url, authToken });

    // Execute the SQL against the remote Turso DB
    await client.executeMultiple(sql);
    console.log("Schema successfully applied to Turso!");
  } catch (error) {
    console.error("Failed to push schema to Turso:", error);
    process.exit(1);
  } finally {
    if (fs.existsSync("migration.sql")) {
      fs.unlinkSync("migration.sql");
    }
  }
}

main();
