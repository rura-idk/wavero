import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workerPath = path.join(root, "worker.js");
const htmlPath = path.join(root, "index.html");
const mode = process.argv.includes("--write") ? "write" : "check";

const [worker, html] = await Promise.all([
  readFile(workerPath, "utf8"),
  readFile(htmlPath, "utf8"),
]);

const newlineIndex = worker.indexOf("\n");
if (newlineIndex < 0 || !worker.startsWith("const indexHtml = ")) {
  throw new Error("worker.js must start with the generated indexHtml declaration");
}

const normalizedHtml = html.replace(/\r\n/g, "\n").replace(/\s+$/u, "") + "\n";
const generatedLine = `const indexHtml = ${JSON.stringify(normalizedHtml)};`;
const generatedWorker = `${generatedLine}\n${worker.slice(newlineIndex + 1)}`;

if (mode === "write") {
  if (generatedWorker !== worker) await writeFile(workerPath, generatedWorker, "utf8");
  process.stdout.write("Embedded UI is up to date.\n");
} else if (generatedWorker !== worker) {
  process.stderr.write("worker.js contains a stale embedded UI. Run npm run build.\n");
  process.exitCode = 1;
} else {
  process.stdout.write("Embedded UI matches index.html.\n");
}
