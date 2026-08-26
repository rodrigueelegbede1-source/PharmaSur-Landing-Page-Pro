/* PharmaSur — interactions
   Tout est conditionné à prefers-reduced-motion : sur cette préférence,
   les états finaux sont appliqués sans animation. */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Menu mobile ---------- */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
  });
});

/* ---------- État du header + progression de lecture ---------- */
const header = document.getElementById('header');
const progress = document.getElementById('progress');
let ticking = false;

const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 8);

  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.setProperty('--p', max > 0 ? String(Math.min(y / max, 1)) : '0');
  ticking = false;
};

window.addEventListener(
  'scroll',
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  },
  { passive: true },
);
onScroll();

/* ---------- Révélations au scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -8%' },
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* Fil conducteur des étapes, tracé une fois la section atteinte */
const steps = document.getElementById('steps');
if (steps) {
  const threadObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        steps.classList.add('is-visible');
        threadObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.35 },
  );
  threadObserver.observe(steps);
}

/* ---------- Compteurs du héros ---------- */
const animateCount = (el) => {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';

  if (reduced) {
    el.textContent = target.toLocaleString('fr-FR') + suffix;
    return;
  }

  const duration = 1600;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString('fr-FR') + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 },
);

document.querySelectorAll('[data-count]').forEach((el) => countObserver.observe(el));

/* ---------- Recherche jouée dans la maquette ---------- */
const typed = document.getElementById('typed');
const caret = document.getElementById('caret');
const results = document.getElementById('results');

const playSearch = () => {
  const text = typed.dataset.text || '';

  const finish = () => {
    caret.classList.add('is-done');
    results.classList.add('is-typed');
  };

  if (reduced) {
    typed.textContent = text;
    finish();
    return;
  }

  let i = 0;
  const id = setInterval(() => {
    i += 1;
    typed.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(id);
      finish();
    }
  }, 55);
};

if (typed && caret && results) {
  const phoneObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        playSearch();
        phoneObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 },
  );
  phoneObserver.observe(typed.closest('.phone'));
}

/* ---------- Parallaxe discrète du héros ---------- */
const hero = document.getElementById('hero');
if (hero && !reduced) {
  let heroTicking = false;
  const parallax = () => {
    const rect = hero.getBoundingClientRect();
    const p = Math.min(Math.max(-rect.top / rect.height, 0), 1);
    hero.style.setProperty('--hero-shift', `${p * 10}%`);
    heroTicking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (heroTicking) return;
      heroTicking = true;
      requestAnimationFrame(parallax);
    },
    { passive: true },
  );
}

/* ---------- Formulaire ---------- */
const form = document.getElementById('ctaForm');
const formMsg = document.getElementById('formMsg');
const phoneRegex = /^(\+225)?[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}$/;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = form.phone.value.trim();

  if (!phoneRegex.test(value)) {
    formMsg.textContent = 'Entrez un numéro ivoirien valide, ex. +225 07 00 00 00 00.';
    formMsg.classList.add('is-error');
    return;
  }

  formMsg.classList.remove('is-error');
  formMsg.textContent = 'Merci ! Le lien de téléchargement vous a été envoyé par SMS.';
  form.reset();
});

/* ---------- Année courante ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
