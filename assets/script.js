/* OUTLET DE LA PLATA — Interacciones */

// Año dinámico
document.getElementById('year').textContent = new Date().getFullYear();

// Cursor personalizado
const cursor = document.querySelector('.cursor');
if (cursor && matchMedia('(hover: hover)').matches) {
  window.addEventListener('mousemove', e => {
    cursor.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
  });
  document.querySelectorAll('a, button, .piece, .card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '32px';
      cursor.style.height = '32px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '8px';
      cursor.style.height = '8px';
    });
  });
}

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.manifesto__text, .card, .piece, .atelier__text, .press blockquote, .faq details, .contact__info, .contact__form')
  .forEach(el => { el.classList.add('reveal'); io.observe(el); });

// Filtros de catálogo
document.querySelectorAll('.filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.piece').forEach(p => {
      const show = f === 'all' || p.dataset.collection === f;
      p.classList.toggle('is-hidden', !show);
    });
  });
});

// Nav: sombra al scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 40
    ? 'rgba(10,10,10,.95)'
    : 'linear-gradient(to bottom, rgba(10,10,10,.85), transparent)';
}, { passive: true });

/* ============================================================
   Detección de capacidades — fallback elegante para Three.js
   ============================================================ */

(function detectWebGL() {
  const testCanvas = document.createElement('canvas');
  const gl =
    testCanvas.getContext('webgl2') ||
    testCanvas.getContext('webgl') ||
    testCanvas.getContext('experimental-webgl');

  const hasWebGL = !!gl;
  const saveData = navigator.connection?.saveData === true;
  const isSlow = navigator.connection?.effectiveType?.includes('2g');

  if (!hasWebGL || saveData || isSlow) {
    document.querySelectorAll('.hero__canvas, .chain__canvas')
      .forEach(c => c.classList.add('no-webgl'));
    document.documentElement.classList.add('no-3d');
  }
})();

/* ============================================================
   Menú móvil — toggle, cierre al navegar, bloqueo de scroll
   ============================================================ */

(function initMobileMenu() {
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('nav-mobile');
  if (!toggle || !menu) return;

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    menu.setAttribute('aria-hidden', 'false');
    menu.classList.add('is-open');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    menu.setAttribute('aria-hidden', 'true');
    menu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  // Cierra al pulsar cualquier enlace del menú
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Cierra con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Cierra si se rota a landscape o se pasa a desktop
  const mq = matchMedia('(min-width: 768px)');
  mq.addEventListener('change', (e) => {
    if (e.matches) closeMenu();
  });
})();

/* ============================================================
   iOS: fuerza 100svh correcto tras cargar fuentes
   (la barra de URL se colapsa y el layout se reajusta)
   ============================================================ */

if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    document.documentElement.style.setProperty(
      '--vh',
      `${window.visualViewport.height * 0.01}px`
    );
  });
}

/* ============================================================
   Detección táctil: elimina el canvas 3D si el dispositivo es móvil
   para ahorrar batería y memoria (además del CSS)
   ============================================================ */

(function maybeDisable3DOnMobile() {
  const isTouch = matchMedia('(hover: none) and (pointer: coarse)').matches;
  const isSmall = window.innerWidth < 768;
  if (isTouch && isSmall) {
    document.querySelectorAll('.hero__canvas, .chain__canvas')
      .forEach(c => c.classList.add('no-webgl'));
    document.documentElement.classList.add('no-3d');
  }
})();