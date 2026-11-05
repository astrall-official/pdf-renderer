// Corre los tests: los compila con esbuild (el código del PDF tiene JSX dentro de archivos .js,
// que ni Node ni tsx aceptan) y los ejecuta con el runner nativo de Node (node --test).
//
// node tests/run.mjs            -> todos los tests
// node tests/run.mjs golden     -> solo los que contienen "golden" en el nombre
// GOLDEN_UPDATE=1 node tests/run.mjs golden  -> aprueba una base golden nueva
import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const testsDir = path.join(root, "tests");
const outDir = path.join(testsDir, "output", "build");
const filter = process.argv[2];

const entries = fs
  .readdirSync(testsDir)
  .filter((f) => f.endsWith(".test.ts") && (!filter || f.includes(filter)))
  .sort()
  .map((f) => path.join(testsDir, f));

if (entries.length === 0) {
  console.error(`No hay tests que coincidan con "${filter}"`);
  process.exit(1);
}

fs.rmSync(outDir, { recursive: true, force: true });
await build({
  entryPoints: entries,
  outdir: outDir,
  outExtension: { ".js": ".mjs" },
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  packages: "external",
  loader: { ".js": "jsx" },
  jsx: "automatic",
  sourcemap: "inline",
  logLevel: "warning",
});

const built = entries.map((f) => path.join(outDir, path.basename(f).replace(/\.ts$/, ".mjs")));
const result = spawnSync(process.execPath, ["--enable-source-maps", "--test", ...built], {
  stdio: "inherit",
  env: process.env,
});
process.exit(result.status ?? 1);
