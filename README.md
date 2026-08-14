# TecnoAndina — Soporte y Mantenimiento Informático (Bogotá)

Sitio estático multi-página (39 páginas) de servicios, productos y zonas para SEO local en Bogotá. Rediseñado con el sistema UI/UX del demo **cam-launch** (expo "Semana de la Cámara" de VigilCam): tema oscuro mono (`#09090b`), acento naranja `#fb923c` + violeta `#a78bfa`, bordes punteados, stickers girados, tarjetas con borde perforado de boleto y código de barras en el footer.

- **Demo en Vercel:** https://harleyvasqueztech.vercel.app
- **Repositorio:** https://github.com/HarleyVasquezcom/harleyvasqueztech
- **Diseño fuente:** https://cam-launch.vercel.app (también en el monorepo `portfolio-demos`)

## Estructura

| Área | Archivos | Detalle |
|---|---|---|
| Inicio | `index.html` | Hero, servicios destacados, zonas, Blog/Aprende, CTA |
| Servicios | `servicios.html`, `servicio-*.html` (8) | Soporte, redes, cloud, datacenter, ciberseguridad, mantenimiento, control de acceso, alarmas |
| Productos | `productos.html`, `producto-*.html` (8) | Computadores, periféricos, redes, servidores, software, UPS, control de acceso, alarmas |
| Zonas | `zona-*.html` (6) | Barrios Unidos, Chapinero, La Candelaria, Puente Aranda, Teusaquillo, Usaquén |
| Blog | `blog.html`, `articulo-*.html` (10) | Guías prácticas por zona |
| Aprende | `aprende.html` | 4 módulos guiados |
| Contacto | `contacto.html` | Formulario + WhatsApp `wa.me/573182020729` |

## Sistema UI/UX (adaptado de cam-launch)

- **Tokens:** `--bg:#09090b`, `--panel:#101013`, `--panel2:#15151a`, `--line:#26262c`, `--line-soft:#1c1c21`, `--text:#fafafa`, `--muted:#a1a1aa`, `--faint:#6b6b74`, acento `#fb923c`, violeta `#a78bfa`, ok `#4ade80`, danger `#f87171`, sky `#7dd3fc`, amber `#fbbf24`; mono `ui-monospace…`, `--radius:8px`, `--max:1180px`.
- **Componentes:** nav sticky con blur + logo-mark dashed, hero con grid + máscara radial + glows naranja/violeta + badge-sticker girado + stats con líneas de acento, eyebrow con raya punteada, botones con borde dashed (primarios con gradiente naranja→violeta), marquee de marcas, tarjetas con borde perforado (`ticket-mask`), stickers (`sticker`/`sticker.violet`), código de barras en footer (`barcode`), FAQ acordeón con borde dashed, formulario validado, botón flotante WhatsApp, reveal `translateY(26px)` + `prefers-reduced-motion` + `focus-visible` naranja.
- **Tipografía:** mono en todo el sitio (tildes y `ñ` incluidos en la pila del sistema).

## SEO y PWA

- `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, iconos 192/512/maskable, `sw.js` con caché versionada.
- Meta SEO/OG por página, `lang="es"`, `geo.*` para Bogotá (CO-DC), JSON-LD `LocalBusiness`.

## Despliegue

```powershell
npx vercel --prod --yes
```

Verificación post-deploy: hash MD5 local == remoto y smoke CDP (200 + componentes presentes) en las 39 páginas.

## Verificación local

```powershell
python -m http.server 8000   # o cualquier servidor estático en localhost:8000
```

Chequeos: HTTP 200 en las 39 páginas, HTML balanceado (divs/sections/footer/a), 0 enlaces rotos, 0 mojibake (UTF-8 puro).

## Historial

- **2026-08-14** — Nuevas secciones Control de Acceso y Citofonía y Alarmas: `servicio-control-acceso.html`, `servicio-alarmas.html`, `producto-control-acceso.html`, `producto-alarmas.html` (39 páginas). Tarjetas y enlaces de footer en `index.html`, `servicios.html`, `productos.html`; `sitemap.xml`, `sw.js` (v83), `README.md` actualizados.
- **2026-08-08** — Rediseño completo con sistema UI/UX de cam-launch (tema oscuro mono, naranja/violeta, bordes punteados, stickers, ticket-mask, barcode). Repo dedicado `HarleyVasquezcom/harleyvasqueztech`, desplegado en Vercel.
