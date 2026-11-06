// Test de regresión visual (golden) del PDF de producción.
//
// Renderiza el reporte de ejemplo (src/data/exampleMarkdown.js, la misma fuente que /pdf-preview)
// con MarkdownReportPDF y el tema "astrology" (el default que usa product-workflow), y lo compara
// contra la base aprobada en tests/golden/:
//   (a) cantidad de páginas,
//   (b) texto por página (pdftotext, exacto),
//   (c) imagen por página a baja resolución (pdftoppm + pixelmatch), con tolerancia.
//
// npm test                    -> compara
// npm run test:golden:update  -> aprueba una base nueva (solo si el cambio visual era lo buscado)
//
// Al fallar deja en tests/output/diff/ (ignorada por git) el antes, el después y la diferencia
// de cada página que cambió.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import MarkdownReportPDF from "../src/components/PDFDocument/MarkdownReportPDF";
import { exampleMarkdown, exampleMetadata } from "../src/data/exampleMarkdown";

const ROOT = process.cwd();
const GOLDEN_DIR = path.join(ROOT, "tests", "golden");
const OUTPUT_DIR = path.join(ROOT, "tests", "output");
const DIFF_DIR = path.join(OUTPUT_DIR, "diff");
const UPDATE = process.env.GOLDEN_UPDATE === "1";

// Resolución y tolerancias: se eligieron para que la misma base pase en Mac y en Ubuntu (CI).
// 36 dpi deja cada página en ~306x433 px: la base completa pesa poco y el ruido de antialiasing
// entre versiones de poppler (Mac vs Ubuntu) queda bajo la tolerancia.
const DPI = 36;
// Umbral por pixel de pixelmatch (0 = exacto, 1 = todo igual). 0.1 es su default.
const PIXEL_THRESHOLD = 0.1;
// Fracción máxima de pixeles distintos por página para considerarla igual.
const MAX_DIFF_RATIO = 0.001;

const realFetch = globalThis.fetch;
// El render no debe depender de la red: la rueda de la portada se lee de public/img.
globalThis.fetch = (async (input: any) => {
  const url = typeof input === "string" ? input : input?.url ?? String(input);
  throw new Error(`El test golden no permite red: ${url}`);
}) as typeof fetch;

const pad = (n: number) => String(n).padStart(2, "0");

const run = (cmd: string, args: string[]) =>
  execFileSync(cmd, args, { encoding: "utf-8", maxBuffer: 64 * 1024 * 1024 });

const renderPdf = async (): Promise<string> => {
  const buffer = await renderToBuffer(
    React.createElement(MarkdownReportPDF, {
      markdown: exampleMarkdown,
      theme: "astrology",
      ...exampleMetadata,
    }) as any,
  );
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const pdfPath = path.join(OUTPUT_DIR, "actual.pdf");
  fs.writeFileSync(pdfPath, buffer);
  return pdfPath;
};

const pageCount = (pdfPath: string): number => {
  const match = run("pdfinfo", [pdfPath]).match(/^Pages:\s+(\d+)/m);
  assert.ok(match, "pdfinfo no devolvió la cantidad de páginas");
  return Number(match[1]);
};

const pageText = (pdfPath: string, page: number): string =>
  run("pdftotext", ["-enc", "UTF-8", "-f", String(page), "-l", String(page), pdfPath, "-"]);

const renderPagePng = (pdfPath: string, page: number, outBase: string): string => {
  run("pdftoppm", [
    "-png", "-r", String(DPI), "-f", String(page), "-l", String(page), "-singlefile", pdfPath, outBase,
  ]);
  return `${outBase}.png`;
};

const readPng = (file: string) => PNG.sync.read(fs.readFileSync(file));

const blankLike = (png: PNG) => {
  const out = new PNG({ width: png.width, height: png.height });
  out.data.fill(255);
  return out;
};

type PageResult = { page: number; problems: string[] };

test("el PDF del reporte de ejemplo coincide con la base aprobada", async () => {
  const pdfPath = await renderPdf();
  const pages = pageCount(pdfPath);
  const actualPngDir = path.join(OUTPUT_DIR, "actual");
  fs.rmSync(actualPngDir, { recursive: true, force: true });
  fs.mkdirSync(actualPngDir, { recursive: true });

  if (UPDATE) {
    fs.rmSync(GOLDEN_DIR, { recursive: true, force: true });
    fs.mkdirSync(path.join(GOLDEN_DIR, "png"), { recursive: true });
    fs.mkdirSync(path.join(GOLDEN_DIR, "text"), { recursive: true });
    for (let p = 1; p <= pages; p++) {
      fs.writeFileSync(path.join(GOLDEN_DIR, "text", `page-${pad(p)}.txt`), pageText(pdfPath, p));
      renderPagePng(pdfPath, p, path.join(GOLDEN_DIR, "png", `page-${pad(p)}`));
    }
    fs.writeFileSync(
      path.join(GOLDEN_DIR, "golden.json"),
      JSON.stringify({ pages, dpi: DPI }, null, 2) + "\n",
    );
    console.log(`Base aprobada: ${pages} páginas en ${path.relative(ROOT, GOLDEN_DIR)}`);
    return;
  }

  const golden = JSON.parse(fs.readFileSync(path.join(GOLDEN_DIR, "golden.json"), "utf-8"));
  assert.equal(golden.dpi, DPI, "La base se generó con otra resolución: apruébala de nuevo");

  fs.rmSync(DIFF_DIR, { recursive: true, force: true });
  const results: PageResult[] = [];
  let maxRatio = 0;
  let maxRatioPage = 0;
  const maxPages = Math.max(pages, golden.pages);

  for (let p = 1; p <= maxPages; p++) {
    const problems: string[] = [];
    const goldenTextFile = path.join(GOLDEN_DIR, "text", `page-${pad(p)}.txt`);
    const goldenPngFile = path.join(GOLDEN_DIR, "png", `page-${pad(p)}.png`);
    const inActual = p <= pages;
    const inGolden = p <= golden.pages;

    // (b) texto
    const actualText = inActual ? pageText(pdfPath, p) : "";
    const goldenText = inGolden ? fs.readFileSync(goldenTextFile, "utf-8") : "";
    if (!inActual) problems.push("la página ya no existe");
    else if (!inGolden) problems.push("página nueva");
    else if (actualText !== goldenText) problems.push("el texto cambió");

    // (c) imagen
    const actualPng = inActual ? readPng(renderPagePng(pdfPath, p, path.join(actualPngDir, `page-${pad(p)}`))) : null;
    const goldenPng = inGolden ? readPng(goldenPngFile) : null;
    const before = goldenPng ?? blankLike(actualPng!);
    const after = actualPng ?? blankLike(goldenPng!);
    let diffPng: PNG | null = null;
    if (before.width !== after.width || before.height !== after.height) {
      problems.push(`cambió el tamaño de página (${before.width}x${before.height} -> ${after.width}x${after.height})`);
    } else {
      diffPng = new PNG({ width: before.width, height: before.height });
      const diffPixels = pixelmatch(before.data, after.data, diffPng.data, before.width, before.height, {
        threshold: PIXEL_THRESHOLD,
      });
      const ratio = diffPixels / (before.width * before.height);
      if (inActual && inGolden && ratio > maxRatio) {
        maxRatio = ratio;
        maxRatioPage = p;
      }
      if (inActual && inGolden && ratio > MAX_DIFF_RATIO) {
        problems.push(`la imagen cambió: ${(ratio * 100).toFixed(3)}% de pixeles distintos (máx ${(MAX_DIFF_RATIO * 100).toFixed(3)}%)`);
      }
    }

    if (problems.length) {
      fs.mkdirSync(DIFF_DIR, { recursive: true });
      const base = path.join(DIFF_DIR, `page-${pad(p)}`);
      fs.writeFileSync(`${base}-antes.png`, PNG.sync.write(before));
      fs.writeFileSync(`${base}-despues.png`, PNG.sync.write(after));
      if (diffPng) fs.writeFileSync(`${base}-diff.png`, PNG.sync.write(diffPng));
      if (actualText !== goldenText) {
        fs.writeFileSync(`${base}-texto-antes.txt`, goldenText);
        fs.writeFileSync(`${base}-texto-despues.txt`, actualText);
      }
      results.push({ page: p, problems });
    }
  }

  // Sirve para calibrar la tolerancia entre Mac y Ubuntu.
  console.log(
    `Imagen: mayor diferencia ${(maxRatio * 100).toFixed(4)}% en la página ${maxRatioPage} (tolerancia ${(MAX_DIFF_RATIO * 100).toFixed(3)}%)`,
  );
  const summary = results.map((r) => `  página ${r.page}: ${r.problems.join("; ")}`).join("\n");
  assert.equal(
    pages,
    golden.pages,
    `(a) Cambió la cantidad de páginas: ${golden.pages} -> ${pages}.\n${summary}\nAntes/después/diff en ${path.relative(ROOT, DIFF_DIR)}/`,
  );
  assert.equal(
    results.length,
    0,
    `${results.length} página(s) distintas a la base:\n${summary}\nAntes/después/diff en ${path.relative(ROOT, DIFF_DIR)}/\n` +
      "Si el cambio era lo buscado y el fundador lo vio: npm run test:golden:update",
  );
});

test.after(() => {
  globalThis.fetch = realFetch;
});
