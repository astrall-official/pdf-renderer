# Backlog — pdf-renderer

Lo que falta en el renderer de PDFs vendidos, en orden. Las decisiones no se repiten aquí: viven en
`astrall-app/docs/facts/decisiones.md` (las de este repo dicen "PDF"). Cuando un ítem se cierra, se
saca de aquí y va a `docs/archive/backlog/AAAA-MM-DD-HHMM-<tema>.md` (ver `docs/archive/README.md`).

## 1. Seguridad (antes que lo demás)

- **El repo es público** y su historial trae un reporte real y nombres, fechas y lugares de nacimiento
  de clientas. El fundador pidió dejarlo privado (5-nov-2026). La rueda de la portada ya sale de
  `public/img/`, en la imagen `:2026-11-05`, probada sin red. Producción sigue en `:latest`, que pide
  la rueda a GitHub, hasta que Dokploy apunte a `:2026-11-05`. Orden: cambiar Dokploy, comprobar un PDF
  y recién entonces pasar a privado. El plan gratis de GitHub no permite impedir que los miembros
  creen repos públicos. El fixture
  (`src/data/exampleMarkdown.js`) conserva las posiciones y el texto de esa lectura real, sin nombre.
- **La imagen de producción trae 565 PDFs de clientas** (comprobado el 5-nov-2026 leyendo las capas en
  GAR). `:latest`, que también tiene el tag `:staging`, del 14-feb-2026, lleva `public/exports/` con
  PDFs vendidos de marzo a mayo de 2025, con nombre y apellido en el archivo. Next los sirve en
  `/exports/<archivo>.pdf`. Ya no están en el disco y `:2026-11-05` no los trae. Las imágenes viejas
  ya se borraron de GAR (5-nov-2026). Queda solo `:latest`, como respaldo, por decisión del fundador.
  Se cierra cuando Dokploy use `:2026-11-05`; después se decide si `:latest` se borra.
- **Confirmar si el renderer de producción se ve desde internet.** `product-workflow/docker-compose.yml`
  publica el 3001 en un puerto aleatorio del host. `/api/export-pdf` acepta `sourceFilePath` y
  `outputPath` libres: lee y escribe cualquier ruta del contenedor, incluida la credencial de GCS
  montada. Primero se revisa en la VM sin cambiar nada (`docker ps` y firewall). Después:
  - quitar `ports` del compose o limitarlo a la red interna, con OK del fundador porque es producción;
  - en este repo, aceptar `sourceFilePath` y `outputPath` solo bajo una carpeta permitida.
- **Dependencias con vulnerabilidades.** GitHub marca 100 alertas en `main`, 11 críticas, sobre todo
  Next 15.2.2. Además, Node 18 ya no tiene soporte. Se actualizan Next, `@react-pdf/renderer` y Node con
  el test visual como red: si cambia el PDF, el fundador lo ve antes de desplegar.

## 2. Rediseño del PDF con el estilo de la app

Feature grande: antes de implementar, el fundador valida en visual una propuesta (skill `presentar`)
con unas pocas páginas representativas.

- Que el PDF se vea como `app.astrall.space`: paleta, tipografía e ilustraciones y stickers del sistema
  de arte de la app (`astrall-app/docs/desarrollo/arte.md`).
- **El arte se pide a `art.astrall.space` al renderizar**, por clave del manifiesto de la app
  (`astrall-app/lib/art/manifest.json`). No se copia al repo ni a la imagen Docker, porque pesaría
  demasiado. Una caché en disco dentro del contenedor evita bajar la misma imagen en cada venta.
- Por confirmar antes de diseñar:
  - `@react-pdf/renderer` lee PNG y JPG, no WebP, y el arte de R2 es WebP: hay que convertirlo al
    renderizar (`sharp`) o publicar también un PNG.
  - Si `art.astrall.space` no responde, el PDF debe salir igual, sin la ilustración, y no frenar la
    venta.
  - El CORS de R2 no aplica, porque se pide desde el servidor.

## 3. Orden

- Tres temas (`default`, `professional` y `dark`) no los pide ninguna venta: `product-workflow` no manda
  `theme` y el default es `astrology`. Se archivan, con tag, cuando entre el rediseño.
- `Dockerfile`: hace `EXPOSE 3000` pero el servidor corre en 3001, y usa `npm install` en vez de
  `npm ci`.
- `src/cli/`: scripts de prueba a mano (`generate-pdf*.ts`). Se archivan si nadie los usa tras el test
  visual.
