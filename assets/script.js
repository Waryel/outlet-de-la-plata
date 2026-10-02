/* OUTLET DE LA PLATA — Interacciones */

/* Layout compartido: todas las páginas usan la misma navegación y footer. */
(function initSharedLayout() {
  const pathname = window.location.pathname.replace(/\/+$/, '');
  const isHome = pathname === '' || pathname === '/index.html';
  const section = id => isHome ? `#${id}` : `/#${id}`;
  const page = path => path;

  document.querySelector('header.nav')?.remove();
  document.querySelector('div.nav-mobile')?.remove();
  document.querySelector('footer.footer')?.remove();

  const header = document.createElement('header');
  header.className = 'nav';
  header.id = 'nav';
  header.innerHTML = `
    <a href="${section('hero')}" class="nav__brand" aria-label="OUTLET DE LA PLATA - Inicio">OUTLET DE LA PLATA</a>
    <nav class="nav__links" aria-label="Navegación principal">
        <a href="${page('/anillos-de-plata/')}">Anillos</a>
        <a href="${page('/pendientes-de-plata/')}">Pendientes</a>
        <a href="${page('/colgantes-de-plata/')}">Colgantes</a>
      <details class="nav__more">
        <summary>Más</summary>
        <div class="nav__more-menu">
          <a href="${page('/conjunto-de-plata/')}">Conjuntos de plata</a>
          <a href="${page('/piezas-plata-malaga/')}">Piezas únicas</a>
          <a href="${page('/joyeria-religiosa/')}">Joyas religiosas</a>
        </div>
      </details>
      <a href="/malaga.html">Málaga</a>
      <a href="${section('faq')}">FAQ</a>
      <a href="${section('contacto')}">Contacto</a>
    </nav>
    <div class="nav__lang"><a href="${section('hero')}" aria-current="page">ES</a></div>
    <button class="nav__toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav-mobile">
      <span></span><span></span><span></span>
    </button>`;

  const mobile = document.createElement('div');
  mobile.className = 'nav-mobile';
  mobile.id = 'nav-mobile';
  mobile.setAttribute('aria-hidden', 'true');
  mobile.innerHTML = `
    <div class="nav-mobile__top">
      <span class="nav-mobile__label">Navegación</span>
      <button class="nav-mobile__close" type="button" aria-label="Cerrar menú"><span></span><span></span></button>
    </div>
    <nav class="nav-mobile__inner" aria-label="Navegación móvil">
      <a href="/anillos-de-plata/">Anillos de plata</a>
      <a href="/pendientes-de-plata/">Pendientes de plata</a>
      <a href="/colgantes-de-plata/">Colgantes de plata</a>
      <details class="nav-mobile__more">
        <summary>Más</summary>
        <div>
          <a href="/piezas-plata-malaga/">Pulsera de plata</a>
          <a href="/conjunto-de-plata/">Conjunto de plata</a>
          <a href="/piezas-plata-malaga/">Piezas exclusivas</a>
        </div>
      </details>
      <a href="/malaga.html">Málaga</a>
      <a href="${section('faq')}">Preguntas frecuentes</a>
      <a href="${section('contacto')}">Contacto</a>
    </nav>`;

  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="footer__grid">
      <div>
        <p class="footer__brand">OUTLET DE LA PLATA</p>
        <p class="footer__small">Joyería artesanal · Plata 925<br>C. San Juan 22 · 29005 Málaga<br><a href="tel:+34611041585">611 04 15 85</a></p>
        <p class="footer__social-label">Síguenos</p>
        <nav class="footer__socials" aria-label="Redes sociales y contacto">
          <a href="https://www.facebook.com/people/Outlet-de-la-Plata/100048492763612/?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook" data-label="Facebook">f</a>
          <a href="https://www.instagram.com/outletdelaplata" target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-label="Instagram">◎</a>
          <a href="https://www.tiktok.com/@outletdelaplata" target="_blank" rel="noopener noreferrer" aria-label="TikTok" data-label="TikTok">♪</a>
          <a href="mailto:hola@outletdelaplata.es" aria-label="Email" data-label="Email">@</a>
        </nav>
      </div>
      <nav aria-label="Categorías">
        <a href="/anillos-de-plata/">Anillos de plata</a>
        <a href="/pendientes-de-plata/">Pendientes de plata</a>
        <a href="/colgantes-de-plata/">Colgantes de plata</a>
        <a href="/piezas-plata-malaga/">Piezas exclusivas</a>
      </nav>
      <nav aria-label="Información">
        <a href="${section('faq')}">Preguntas frecuentes</a>
        <a href="${section('contacto')}">Contacto</a>
        <a href="/legal/aviso-legal/">Aviso legal</a>
        <a href="/legal/privacidad/">Privacidad</a>
      </nav>
    </div>
    <p class="footer__copy">© <span id="year"></span> OUTLET DE LA PLATA · Málaga, España</p>`;

  document.body.prepend(mobile);
  document.body.prepend(header);
  document.body.append(footer);
  document.getElementById('year').textContent = new Date().getFullYear();
})();

// Cursor personalizado
const cursor = document.querySelector('.cursor');
if (cursor && matchMedia('(hover: hover)').matches) {
  let cursorFrame;
  window.addEventListener('mousemove', e => {
    cancelAnimationFrame(cursorFrame);
    cursorFrame = requestAnimationFrame(() => {
      cursor.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
    });
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

// Reveal on scroll: GSAP for smooth timing, IntersectionObserver as fallback.
const revealTargets = document.querySelectorAll(
  '.card, .piece, .atelier__text, .press blockquote, .faq details, .contact__info, .contact__form'
);

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  revealTargets.forEach((element, index) => {
    gsap.fromTo(element,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        delay: (index % 4) * 0.06,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: element,
          start: 'top 86%',
          once: true,
        },
      }
    );
  });
} else {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => { el.classList.add('reveal'); io.observe(el); });
}

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
  const closeButton = menu?.querySelector('.nav-mobile__close');
  if (!toggle || !menu) return;

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
    menu.setAttribute('aria-hidden', 'false');
    menu.classList.add('is-open');
    menu.classList.remove('is-leaving');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    menu.setAttribute('aria-hidden', 'true');
    menu.classList.remove('is-open');
    menu.classList.remove('is-leaving');
    document.body.classList.remove('menu-open');
  }

  closeButton?.addEventListener('click', closeMenu);

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  // Destaca la opción elegida y cierra con una transición antes de navegar.
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      menu.querySelectorAll('a').forEach(item => item.classList.remove('is-selected'));
      link.classList.add('is-selected');
      menu.classList.add('is-leaving');
      window.setTimeout(() => {
        window.location.href = link.href;
      }, 340);
    });
  });

  menu.addEventListener('click', event => {
    if (event.target === menu) closeMenu();
  });

  // Cierra con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Cierra si se rota a landscape o se pasa a desktop
  const mq = matchMedia('(min-width: 901px)');
  mq.addEventListener('change', (e) => {
    if (e.matches) closeMenu();
  });
})();

/* ============================================================
   iOS: fuerza 100svh correcto tras cargar fuentes
   (la barra de URL se colapsa y el layout se reajusta)
   ============================================================ */

if (window.visualViewport) {
  const updateViewportHeight = () => {
    document.documentElement.style.setProperty(
      '--vh',
      `${window.visualViewport.height * 0.01}px`
    );
  };
  updateViewportHeight();
  window.visualViewport.addEventListener('resize', () => {
    updateViewportHeight();
  });
}

