# DEVELOPMENT — pdf-renderer

Cómo correr, testear y validar este repo. Documento vivo: ver "Mantener este documento".

## Setup
- Node 18 (Dockerfile `node:18` / `node:18-alpine`): `nvm use 18`.
- `npm ci` (el lockfile es `package-lock.json`; `CLAUDE.md` viejo y Makefile dicen `yarn`: no usar yarn).
- GCS (export a bucket): Application Default Credentials (`gcloud auth application-default login`).

## Correr local
- `npx next dev -p 3001` → http://localhost:3001 (`npm run dev` agrega `NODE_OPTIONS=--inspect`: abre el inspector en :9229 y choca si otro proceso Node lo usa).
- Preview visual: http://localhost:3001/pdf-preview
- Docker (si está arriba): `docker compose up -d` usa la imagen `:staging` en **:3002**; el compose de product-workflow la expone en :3001.

## Tests y validación
No hay tests automatizados. Checklist por cambio:
| Qué | Comando | Verde = |
|---|---|---|
| Tipos | `npx tsc --noEmit` | 0 errores (hay `@ts-nocheck` aceptados en componentes PDF) |
| Lint | `npx next lint` | 0 errores |
| Salud | `curl -s localhost:3001/api/health` | `{"status":"ok",…}` |
| Render | `curl -s -X POST localhost:3001/api/preview-pdf -H 'content-type: application/json' -d '{"markdown":"# Título\n\n**Sección**\n\ntexto","theme":"astrology"}' \| head -c 200` | 200 con PDF base64 |
| Export | `POST /api/export-pdf` con `sourceFilePath: "./examples/example-report.md"` (payload en `CLAUDE.md` → "API Request Format") | PDF en `public/exports/` |
| Visual | abrir el PDF y revisar portada, numeración (`pageNumber - 2`), fuentes Montserrat, cortes de página, cada tema tocado | sin regresiones |
| Build | `npx next build` (pesado, uno a la vez) | compila |

- Cambio de fuentes/rutas: validar en dev **y** en la imagen Docker (las rutas candidatas de fuentes difieren: `public/fonts/ttf` vs WORKDIR `/usr/src/app`).

## Integración con otros repos
Regla: todo cambio en el payload/respuesta de `/api/export-pdf`, temas o rutas GCS se valida con product-workflow corriendo contra este server local.
- product-workflow → `POST {PDF_SERVICE_URL}/api/export-pdf` (default `http://localhost:3001`; Dokploy `pdf-renderer:3001`).
  Validación: este repo en :3001 (sin el contenedor del compose levantado) + e2e smoke de product-workflow (`ENV=e2e`, ver `product-workflow/DEVELOPMENT.md`).
- Markdown de entrada lo generan los prompts n8n de product-workflow: un patrón nuevo de markdown (validators en `src/components/PDFDocument/helpers/validators/`) se prueba con un `.txt` real de `gs://test-astrall-reports`.

## Deploy
- `make deploy`: build Docker + push `pdf-renderer:latest` a GAR; Dokploy lo toma. Product-workflow local usa `:staging`. Sin CI.

## Problemas conocidos
- `/api/preview-pdf` fallaba por ruta de fuentes (`fonts/ttf` inexistente) → arreglado en `a491d3e` (resuelve candidatos `public/fonts/ttf`) → si reaparece, revisar `src/styles/pdfThemes.js` (`FONT_PROBE_FILE`).
- `make dev`/`build`/`start` llaman `yarn` → no instalado/lockfile npm → usar `npx next …`.
- :3001 ocupado por el contenedor `pdf-renderer` del compose de product-workflow o por granade-marketplace (también :3001) → parar el otro antes.
- Mac: build Next pesado; uno a la vez.

## Mantener este documento
Todo problema nuevo del flujo de desarrollo o técnica de validación que funcione se agrega aquí en el mismo cambio (una línea: síntoma → causa → arreglo).
