#!/usr/bin/env node
// Ensures the database is ready before the app runs:
//   node scripts/db.mjs         → prisma db push (creates/updates tables)
//   node scripts/db.mjs --seed  → also seeds starter products (skips if any exist)
// Loads .env / .env.local itself because the Prisma CLI only reads .env.
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

// Real environment variables win; .env.local wins over .env.
for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    const value = m[2].replace(/^(["'])(.*)\1$/, "$2");
    if (!(m[1] in process.env)) process.env[m[1]] = value;
  }
}

if (!process.env.DATABASE_URL) {
  console.error(`
✖ DATABASE_URL is not set, so the store has no database yet.

  Local dev:  create a .env file in the project root with a Postgres URL, e.g.
              DATABASE_URL="postgresql://user:password@localhost:5432/graces_stitchery"
              (a free cloud db from https://neon.tech works great too)

  Vercel:     in your project go to Storage → Create Database → Neon (free),
              which sets DATABASE_URL automatically, then redeploy.
`);
  process.exit(1);
}

function run(cmd, args, extraEnv = {}) {
  const res = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, ...extraEnv },
  });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

// Schema changes (DDL) should use a direct connection when the host provides
// a pooled DATABASE_URL (Neon / Vercel Postgres set an unpooled variant).
const directUrl =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL;

run("npx", ["prisma", "db", "push", "--skip-generate"], { DATABASE_URL: directUrl });
run("npx", ["prisma", "generate"]);
if (process.argv.includes("--seed")) run("npx", ["tsx", "prisma/seed.ts"]);
