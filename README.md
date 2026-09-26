# OUTLET DE LA PLATA — Sitio web

Sitio informativo y catálogo visual de OUTLET DE LA PLATA, joyería de autor especializada en plata 925 con atelier en Málaga, España.

## Stack

- HTML5 + CSS3 + JavaScript vanilla
- Three.js para el anillo 3D interactivo del hero
- Fuentes: Bodoni Moda (titulares) + Inter (cuerpo)
- Optimizado para SEO, GEO y AEO

## Estructura

- `index.html` — página principal
- `malaga.html` — landing SEO local
- `assets/styles.css` — estilos globales y responsive
- `assets/script.js` — interacciones (menú móvil, filtros, cursor)
- `assets/three-hero.js` — anillo 3D del hero
- `assets/three-parallax.js` — divisor 3D entre secciones
- `models/` — modelos GLB
- `llms.txt`, `robots.txt`, `sitemap.xml` — SEO técnico
- `staticwebapp.config.json` — configuración Azure Static Web Apps

## Desarrollo local

Servir con cualquier servidor HTTP estático:

```bash
python3 -m http.server 8080
# o
npx serve .