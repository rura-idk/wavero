import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const migrationsDir = path.join(root, "migrations");
const schemaPath = path.join(root, "schema.sql");
const mode = process.argv.includes("--write") ? "write" : "check";

const migrationNames = (await readdir(migrationsDir))
  .filter((name) => /^\d+_.+\.sql$/u.test(name))
  .sort((left, right) => left.localeCompare(right, "en"));

if (migrationNames.length === 0) throw new Error("No D1 migrations found");

const sections = [];
for (const name of migrationNames) {
  const sql = (await readFile(path.join(migrationsDir, name), "utf8"))
    .replace(/\r\n/g, "\n")
    .trim();
  sections.push(`-- Source: migrations/${name}\n${sql}`);
}

const generated = [
  "-- GENERATED FILE. Edit migrations/*.sql and run npm run build.",
  "-- Intended for a fresh local/test D1 database only.",
  "PRAGMA foreign_keys = ON;",
  "",
  sections.join("\n\n"),
  "",
].join("\n");

if (mode === "write") {
  await writeFile(schemaPath, generated, "utf8");
  process.stdout.write(`Generated schema.sql from ${migrationNames.length} migrations.\n`);
} else {
  const current = await readFile(schemaPath, "utf8").catch(() => "");
  if (current !== generated) {
    process.stderr.write("schema.sql is stale. Run npm run build.\n");
    process.exitCode = 1;
  } else {
    process.stdout.write("schema.sql matches migrations.\n");
  }
}
