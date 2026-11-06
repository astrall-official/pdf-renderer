# CLAUDE.md — pdf-renderer

Convierte en PDF el markdown de las lecturas que se venden. Es un servicio Next 15 con
`@react-pdf/renderer`: `product-workflow` le pasa el texto en GCS y él sube el PDF que recibe la clienta.
Solo renderiza. El texto lo escriben los prompts de `product-workflow` y la carta la dibuja
`astrall-front`. El método de trabajo está en el `CLAUDE.md` del workspace (`../CLAUDE.md`): roles,
autonomía, sub-agentes y cómo reportar.

## Antes de tocar
- **`DEVELOPMENT.md`:** cómo está armado, cómo correr, testear y desplegar, y problemas conocidos.
- **`docs/backlog.md`:** qué falta y en qué orden.
- **Decisiones:** `../astrall-app/docs/facts/decisiones.md`, que es el único lugar. Las de este repo
  dicen "PDF".

## Validar

```bash
./pesado.sh pdf-renderer npm test                  # desde la raíz del workspace; lo mismo corre en CI
./pesado.sh pdf-renderer npx tsc --noEmit
```

- `npm test` compara el PDF del reporte de ejemplo, página por página, contra la versión aprobada en
  `tests/golden/`. Si falla, deja el antes, el después y la diferencia de cada página que cambió
  (`DEVELOPMENT.md`, "Test visual").
- Una base nueva solo se aprueba (`npm run test:golden:update`) cuando el cambio visual era lo buscado
  y el fundador ya lo vio.
- Cambios en el payload de `/api/export-pdf`, en el markdown que llega o en las rutas de GCS: se validan
  con `product-workflow` corriendo contra este servidor local (`DEVELOPMENT.md`, "Integración").
- CI en rojo en `main` se arregla antes de seguir.

## Qué valida el fundador y qué decides tú
- **El fundador ve todo cambio visible del PDF antes de desplegar:** portada, tipografía, colores,
  márgenes, ilustraciones y cortes de página. Usa la skill `presentar` con antes y después de unas
  pocas páginas representativas (portada, una con título y etiquetas, una con corte de página y el
  cierre), no el PDF entero. Las páginas se sacan de `tests/output/actual.pdf` con
  `pdftoppm -r 110 -png -f <n> -l <n>`. Los PNG de diff del test (36 dpi) solo sirven para ver qué
  cambió.
- **Tú decides:** cambios sin efecto visual (el test pasa sin aprobar una base nueva), refactors,
  tests, dependencias y arreglos de errores.

## Ambientes
- **Producción:** la imagen `pdf-renderer:latest` en GAR, que corre en Dokploy (VM Hetzner) junto a
  `product-workflow`. Con ella se arma cada PDF vendido. `make deploy` la reemplaza, así que se
  pregunta antes.
- **`:staging`:** la usa el compose de `product-workflow` en local y en staging. Subirla también se
  pregunta.
- **Local:** `npx next dev -p 3001`, libre.

Se trabaja directo en `main`, porque nada se despliega solo: producción cambia únicamente con
`make deploy`.

## Errores que ya pasaron
- **Datos reales de clientas en el repo, que es público.** Había un reporte real, nombres y fechas de
  nacimiento en el preview, en los valores por defecto de la portada y en archivos sueltos. Además,
  `public/exports/` juntó cientos de PDFs vendidos que se colaban en la imagen Docker. Todo ejemplo usa
  la persona ficticia de `exampleMetadata`, y solo lo ficticio se guarda en las carpetas de salida
  (`public/exports/`, `shared/`, `tests/output/`). Un PDF de una venta real se revisa fuera del repo
  y se borra al terminar.
- **El log no lleva datos personales.** `/api/export-pdf` registraba el request entero, con nombre,
  fecha, hora y lugar de nacimiento. Lo cubre un test.
- **Las fuentes se buscan en rutas distintas en dev y en Docker** (`src/styles/pdfThemes.js`). Un
  cambio de fuentes o de rutas se prueba en los dos.
- **El arte no entra al repo ni a la imagen.** Las ilustraciones de Astrall se piden a
  `art.astrall.space` cuando hacen falta, igual que en la app (`../astrall-app/docs/desarrollo/arte.md`).
- **npm, no yarn:** el lockfile es de npm.
- **Ningún recurso del PDF se pide a GitHub.** La portada cargaba la rueda desde
  `raw.githubusercontent.com` y se habría roto al pasar el repo a privado. Hoy sale de `public/img/`.
- **El puerto 3001 lo ocupan otros:** el contenedor del compose de `product-workflow` y
  `granade-marketplace`. Detén el otro antes de levantar este.
