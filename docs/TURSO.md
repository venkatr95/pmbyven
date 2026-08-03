# Turso (production database)

This project uses **SQLite locally** (a file, via `better-sqlite3`) and
**[Turso](https://turso.tech)** (serverless libSQL, SQLite over HTTP) **in
production**. The Prisma schema's `provider` stays `"sqlite"` throughout —
Turso is wire-compatible, so there's no schema migration between engines,
just a different adapter at runtime and a different URL for the CLI.

How it's wired:

- [src/lib/db.ts](../src/lib/db.ts) — picks the adapter at runtime. If
  `TURSO_DATABASE_URL` is set, it uses `@prisma/adapter-libsql` against
  Turso; otherwise it falls back to `@prisma/adapter-better-sqlite3` against
  the local `DATABASE_URL` file.
- [prisma.config.ts](../prisma.config.ts) — picks the datasource URL for the
  Prisma **CLI** (`generate`, `db push`, `studio`) the same way, so
  `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` also drive schema commands, not
  just the app's runtime client.

## 1. Create a Turso database

```bash
# Install the Turso CLI (see https://docs.turso.tech/cli/installation)
turso auth login
turso db create pmbyven
turso db show pmbyven --url          # -> libsql://pmbyven-<org>.turso.io
turso db tokens create pmbyven       # -> auth token
```

## 2. Environment variables

Set these wherever the app runs in production (Vercel → Project → Settings →
Environment Variables, for Production + Preview):

| Name | Example |
|------|---------|
| `TURSO_DATABASE_URL` | `libsql://pmbyven-yourorg.turso.io` |
| `TURSO_AUTH_TOKEN` | (token from `turso db tokens create`) |

Leave `DATABASE_URL` unset in production — it's only the local dev fallback.
Locally, don't set `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` at all; `db.ts`
and `prisma.config.ts` fall back to the SQLite file automatically.

## 3. Push the schema to Turso

With `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` set in your shell (or a
`.env` loaded by `dotenv/config`):

```bash
npx prisma generate
npx prisma db push
```

This is what `vercel.json`'s `buildCommand` already runs on every deploy
(`prisma generate && prisma db push && next build`), so schema changes ship
automatically as long as the Turso env vars are set on Vercel.

### Alternative: generate raw SQL and pipe it through the Turso CLI

If you'd rather review/version the SQL instead of relying on `db push`:

```bash
npx prisma migrate diff \
  --from-empty \
  --to-schema prisma/schema.prisma \
  --script > migration.sql

turso db shell pmbyven < migration.sql
```

## 4. Seeding production data (optional)

```bash
TURSO_DATABASE_URL="libsql://pmbyven-yourorg.turso.io" \
TURSO_AUTH_TOKEN="..." \
npm run db:seed
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `db.ts` still hitting the local SQLite file in prod | Confirm `TURSO_DATABASE_URL` is actually set in that environment (Vercel Preview *and* Production must be set separately). |
| `prisma db push` fails to authenticate | Token may be expired/revoked — run `turso db tokens create pmbyven` again. |
| Local dev accidentally talking to Turso | Make sure `TURSO_DATABASE_URL` isn't set in your local `.env` — its presence always takes priority over `DATABASE_URL`. |
