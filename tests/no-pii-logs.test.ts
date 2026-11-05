// Las rutas API no deben dejar datos personales en el log: ni nombre, ni fecha, hora o lugar de
// nacimiento, ni el request completo (que los trae). Dos capas:
//   1. Estática: ningún console.* de src/pages/api nombra esos campos ni el request/body entero.
//   2. En ejecución: se llama a /api/export-pdf y /api/preview-pdf con datos centinela y se
//      revisa todo lo que salió por consola.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import exportPdf from "../src/pages/api/export-pdf";
import previewPdf from "../src/pages/api/preview-pdf";

const API_DIR = path.join(process.cwd(), "src", "pages", "api");

const PII_FIELDS = /\b(userName|birthDate|birthTime|location)\b/;
// `request`, `req` o `body` enteros (o esparcidos con ...). Se permiten solo estos campos sueltos:
const WHOLE_REQUEST =
  /\b(request|req|body)\b(?!\s*\??\.\s*(gcpFile|sourceFilePath|outputPath|outputStorageFilePath|theme|method|url)\b)/;

const listFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return listFiles(full);
    return /\.(ts|tsx|js|jsx)$/.test(e.name) ? [full] : [];
  });

// Devuelve el texto de los argumentos de cada console.xxx( ... ), respetando paréntesis anidados.
const consoleCalls = (source: string) => {
  const calls: { line: number; args: string }[] = [];
  const re = /\bconsole\s*\.\s*\w+\s*\(/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) {
    let depth = 1;
    let i = m.index + m[0].length;
    const start = i;
    for (; i < source.length && depth > 0; i++) {
      if (source[i] === "(") depth++;
      else if (source[i] === ")") depth--;
    }
    calls.push({ line: source.slice(0, m.index).split("\n").length, args: source.slice(start, i - 1) });
  }
  return calls;
};

// Deja solo el código de los argumentos: quita el texto de los strings, pero conserva lo que va
// dentro de ${...} en los template literals (ahí sí puede haber un campo personal).
const codeOnly = (args: string) =>
  args
    .replace(/`(?:\\.|[^\\`])*`/g, (tpl) => (tpl.match(/\$\{[^}]*\}/g) ?? []).join(" "))
    .replace(/(["'])(?:\\.|(?!\1)[^\\])*\1/g, '""');

const isOffending = (args: string) => {
  const code = codeOnly(args);
  return PII_FIELDS.test(code) || WHOLE_REQUEST.test(code);
};

test("ningún console.* de src/pages/api loguea datos personales ni el request completo", () => {
  const offenders: string[] = [];
  const files = listFiles(API_DIR);
  assert.ok(files.length > 0, "no se encontraron rutas API");
  for (const file of files) {
    const source = fs.readFileSync(file, "utf-8");
    for (const { line, args } of consoleCalls(source)) {
      if (isOffending(args)) {
        offenders.push(`${path.relative(process.cwd(), file)}:${line}  console(${args.trim()})`);
      }
    }
  }
  assert.deepEqual(offenders, [], `Logs con datos personales:\n${offenders.join("\n")}`);
});

test("el detector estático atrapa los casos prohibidos", () => {
  const bad = [
    'console.log("Received request:", request)',
    "console.log(req.body)",
    "console.info({ ...request, theme })",
    "console.log(`user ${request.userName}`)",
    "console.warn(userName, birthDate)",
    "console.log(JSON.stringify(req.body))",
  ];
  for (const src of bad) {
    const [{ args }] = consoleCalls(src);
    assert.ok(isOffending(args), `no detectó: ${src}`);
  }
  const ok = [
    'console.log("export-pdf request:", { gcpFile: request.gcpFile, theme: request.theme })',
    'console.error("Error generating PDF (sin userName):", error)',
  ];
  for (const src of ok) {
    const [{ args }] = consoleCalls(src);
    assert.ok(!isOffending(args), `falso positivo: ${src}`);
  }
});

// --- En ejecución ----------------------------------------------------------------------------

const SENTINELS = {
  userName: "Centinela Nombre Zq7",
  birthDate: "1911-11-11",
  birthTime: "11:47",
  location: "Lugar Centinela Xk9",
};

const captureConsole = async (fn: () => Promise<void>) => {
  const methods = ["log", "info", "warn", "error", "debug", "trace"] as const;
  const original = methods.map((m) => console[m]);
  const out: string[] = [];
  methods.forEach((m) => {
    (console as any)[m] = (...args: unknown[]) =>
      out.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a) ?? String(a))).join(" "));
  });
  try {
    await fn();
  } finally {
    methods.forEach((m, i) => ((console as any)[m] = original[i]));
  }
  return out.join("\n");
};

const fakeRes = () => {
  const res: any = { statusCode: 0, body: undefined };
  res.status = (code: number) => ((res.statusCode = code), res);
  res.json = (body: unknown) => ((res.body = body), res);
  return res;
};

const assertNoSentinels = (logs: string) => {
  for (const [field, value] of Object.entries(SENTINELS)) {
    assert.ok(!logs.includes(value), `el log contiene ${field}:\n${logs}`);
  }
};

test("/api/export-pdf no loguea datos personales (éxito y error)", async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "pdf-renderer-pii-"));
  try {
    const source = path.join(tmp, "report.md");
    fs.writeFileSync(source, "# Título\n\n**Sección**\n\ntexto\n");
    const ok = fakeRes();
    const logs = await captureConsole(() =>
      exportPdf(
        { method: "POST", body: { ...SENTINELS, documentName: "Doc", sourceFilePath: source, outputPath: path.join(tmp, "out.pdf") } } as any,
        ok,
      ),
    );
    assert.equal(ok.statusCode, 200, JSON.stringify(ok.body));
    assert.ok(logs.includes("export-pdf request"), "se esperaba el log de bucket, rutas y tema");
    assertNoSentinels(logs);

    const bad = fakeRes();
    const errLogs = await captureConsole(() =>
      exportPdf({ method: "POST", body: { ...SENTINELS, sourceFilePath: path.join(tmp, "no-existe.md") } } as any, bad),
    );
    assert.equal(bad.statusCode, 400);
    assertNoSentinels(errLogs);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("/api/preview-pdf no loguea datos personales", async () => {
  const res = fakeRes();
  const logs = await captureConsole(() =>
    previewPdf({ method: "POST", body: { ...SENTINELS, markdown: "# Título\n\ntexto", theme: "astrology" } } as any, res),
  );
  assert.equal(res.statusCode, 200);
  assertNoSentinels(logs);
});
