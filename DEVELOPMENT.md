# DEVELOPMENT — pdf-renderer

Cómo está armado, cómo correr, testear, integrar y desplegar este repo. Las reglas de trabajo están en
`CLAUDE.md`. Un problema nuevo del flujo de desarrollo, o una forma de validar que funcione, se agrega
aquí en el mismo cambio.

## Cómo está armado
- **Entradas:**
  - `POST /api/export-pdf` es lo que usa producción. Lee el markdown de GCS (`gcpFile`) o de un archivo
    local (`sourceFilePath`) y escribe el PDF en `outputPath` o en `public/exports/`. Si viene
    `outputStorageFilePath`, además lo sube a GCS.
  - `POST /api/preview-pdf` devuelve el PDF en base64.
  - `/pdf-preview` es la vista previa en vivo.
  - `GET /api/health` responde si el servidor está arriba.
- **Payload de `product-workflow`** (`astrology/workflow_engine/outcome_generators.py`): `documentName`,
  `userName`, `birthDate`, `birthTime`, `location`, `gcpFile {bucketName, filePath}` y
  `outputStorageFilePath {bucketName, filePath}`. No manda `theme`, así que se usa `astrology`. Tipos
  en `src/types.ts`.
- **Documento:** `src/components/PDFDocument/MarkdownReportPDF.tsx`. La página 1 es la portada, con
  nombre, fecha, hora y lugar. El contenido parte en la página 2 y la numeración visible resta 2.
  Parsea con `react-markdown` + `remark-gfm`.
- **Temas:**
  - estilos en `src/styles/pdfThemes.js`, que también registra Montserrat desde `public/fonts/ttf/`;
  - componentes por tema en `components/PDFDocument/themes/themeComponents.tsx`;
  - la mezcla con los componentes base, en `factory/componentsFactory.tsx`.
- **Patrones propios del markdown**, detectados por validadores en `helpers/validators/` y
  renderizados en `helpers/renderHelper.tsx`:
  - `strongTitle`: un párrafo que es solo `**Título**`, con adorno.
  - `tagList`: `Título: a - b - c`.

  Un patrón nuevo nace en los prompts de `product-workflow`. Se prueba con un `.txt` real de
  `gs://test-astrall-reports`, que se descarga fuera del repo y se borra después.
- **Cortes de página:** `minPresenceAhead`, `wrap={false}` y `orphans`. Son lo que más se rompe al
  tocar estilos.
- **Tipos:** hay `@ts-nocheck` y `@ts-ignore` aceptados en componentes PDF, por los tipos de
  `@react-pdf`.

## Setup
- Node 18, que es el del `Dockerfile` (`.nvmrc`).
- `npm ci --registry https://registry.npmjs.org`. El lockfile es de npm: no uses yarn.
- `poppler`, para el test visual (`pdftoppm` y `pdftotext`): `brew install poppler`.
- GCS, solo para exportar a un bucket: `gcloud auth application-default login`, con
  `CLOUDSDK_CONFIG=~/.config/gcloud-astrall`. Usa `test-astrall-reports`, nunca el bucket de ventas.

## Correr local
- `npx next dev -p 3001` → http://localhost:3001/pdf-preview. No uses `npm run dev`: agrega `--inspect`
  y choca en :9229 con otro Node.
- Probar el render:
  `curl -s -X POST localhost:3001/api/preview-pdf -H 'content-type: application/json' -d '{"markdown":"# Título\n\n**Sección**\n\ntexto","theme":"astrology"}' | head -c 200`
  responde 200 con un PDF en base64.
- El servidor se cierra al terminar. No va con `pesado.sh` (ver el `CLAUDE.md` del workspace).

## Test visual
- `./pesado.sh pdf-renderer npm test` (`node tests/run.mjs`) renderiza el reporte de ejemplo ficticio
  (`src/data/exampleMarkdown.js`, con `exampleMetadata`; el preview lee lo mismo), con el tema
  `astrology`. Son 37 páginas, que se comparan contra `tests/golden/`:
  - la cantidad de páginas;
  - el texto exacto de cada página;
  - la imagen de cada página a 36 dpi, con un máximo de 0,1 % de pixeles distintos.
- La misma base pasa en el Mac (poppler 26) y en CI (Ubuntu, poppler 24): la diferencia máxima medida
  es 0,0098 %.
- También corre `tests/no-pii-logs.test.ts`: llama a las rutas con datos centinela y falla si el log
  los muestra.
- Para correr solo una parte: `node tests/run.mjs golden` o `node tests/run.mjs pii`.
- Si falla, deja `tests/output/diff/page-NN-{antes,despues,diff}.png` y `-texto-{antes,despues}.txt`.
  El PDF queda en `tests/output/actual.pdf`. Esas imágenes van a la propuesta del fundador.
- `./pesado.sh pdf-renderer npm run test:golden:update` aprueba la base nueva. Solo se usa cuando el
  cambio visual era lo buscado y el fundador ya lo vio.
- CI (`.github/workflows/ci.yml`) corre en cada push y PR: `npm ci`, `tsc` y `npm test`. Si falla, sube
  `tests/output/diff/` como artefacto. Para seguirla: `gh run watch <id> --exit-status`.
- Antes de desplegar, además: `npx next build` (pesado, con `pesado.sh`) y abrir un PDF de prueba
  exportado.

## Integración con otros repos
Todo cambio en el payload o en la respuesta de `/api/export-pdf`, en las rutas de GCS o en el markdown
que se acepta se valida con `product-workflow` corriendo contra este servidor local:
- este repo en :3001, sin el contenedor `pdf-renderer` del compose levantado;
- el smoke e2e de `product-workflow` (`ENV=e2e`), que usa `test-astrall-reports` (ver
  `product-workflow/DEVELOPMENT.md`).

## Deploy
- Desde el 5-nov-2026 cada versión se sube con un tag con fecha y `:latest` no se toca: queda como
  respaldo. `make deploy IMAGE_TAG=AAAA-MM-DD` construye y sube solo ese tag a GAR (`bold-vortex-332122`,
  `us-central1`, repositorio `astrall`), con `CLOUDSDK_CONFIG=~/.config/gcloud-astrall`. Producción
  cambia cuando el compose de Dokploy apunta a ese tag: **se pregunta antes**.
- Las imágenes son arm64, igual que la VM, así que se construyen en este Mac.
- Antes de subir, prueba la imagen sin red: `docker run -d --network none`, y un `export-pdf` con
  `docker exec … wget`. Mira la portada y confirma que el log no traiga datos personales.
- `:staging` es la imagen de los compose local y staging de `product-workflow`. Subirla también se
  pregunta.
- Es la única tarea pesada mientras corre. Docker se apaga al terminar.
- Un cambio de fuentes o de rutas se valida también dentro de la imagen, porque las rutas candidatas
  de las fuentes cambian (`public/fonts/ttf` contra `/usr/src/app`).

## Problemas conocidos
- **`/api/preview-pdf` fallaba por la ruta de las fuentes** → arreglado en `a491d3e`. Si vuelve a pasar,
  revisa `FONT_PROBE_FILE` y las candidatas en `src/styles/pdfThemes.js`.
- **El puerto 3001 lo ocupa el contenedor del compose de `product-workflow` o `granade-marketplace`** →
  detén el otro antes.
- **El build de Next es pesado en la Mac** → uno a la vez, con `pesado.sh`.
- **`tsx` falla en Node 18** (`E.toReversed is not a function`) **y no acepta JSX en `.js`** (los assets
  del PDF son `.js` con JSX) → el runner compila con esbuild fijo (`loader: {".js": "jsx"}`) y corre
  con `node --test`.
- **PDFs de clientas dentro de la imagen Docker** → el patrón `exports` de `.dockerignore` solo calzaba
  en la raíz → arreglado en `609f419`: excluye `public/exports` y `shared`.
- **La portada cargaba la rueda desde `raw.githubusercontent.com`** → con el repo privado daría 404 en
  cada PDF vendido → ahora sale de `public/img/astrology-wheel.jpg` (`coverWheelSrc` en
  `pdfThemes.js`). El test visual no permite red.
- **La página 2 sale en blanco** → es el diseño actual y quedó así en la base.
- **React avisa `Invalid '\n' string child outside <Text>`** en cada render → ya pasaba y no se ve.
