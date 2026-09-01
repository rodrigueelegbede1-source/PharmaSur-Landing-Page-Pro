/* PharmaSur — interactions
   Entrée en CSS, interaction en JavaScript : les animations d'entrée du héros
   sont des keyframes, le texte doit pouvoir apparaître même si ce script
   échoue. Tout est conditionné à prefers-reduced-motion, qui applique les états
   finaux sans animation. */

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

/* ---------- Séquence de la maquette ----------
   Deux produits sont déjà saisis, le troisième se tape sous les yeux du
   visiteur. Une fois la frappe finie : la ligne en rupture et son équivalent
   générique apparaissent, le total de l'ordonnance est recalculé, puis les
   officines et la carte de scan se révèlent. */
const typed = document.getElementById('typed');
const caret = document.getElementById('caret');
const lineGroup = document.getElementById('lineGroup');
const total = document.getElementById('total');
const results = document.getElementById('results');
const scanCard = document.getElementById('scanCard');

const PLACEHOLDER = 'Ajouter un produit…';

const finishSequence = () => {
  caret.classList.add('is-done');
  typed.textContent = PLACEHOLDER;
  typed.classList.add('is-placeholder');

  lineGroup.classList.add('is-shown');

  total.textContent = total.dataset.full;
  total.classList.add('is-bumped');

  results.classList.add('is-typed');
  scanCard.classList.add('is-shown');
};

const playSequence = () => {
  const text = typed.dataset.text || '';

  if (reduced) {
    finishSequence();
    return;
  }

  typed.textContent = '';
  typed.classList.remove('is-placeholder');

  let i = 0;
  const id = setInterval(() => {
    i += 1;
    typed.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(id);
      finishSequence();
    }
  }, 55);
};

if (typed && caret && lineGroup && total && results && scanCard) {
  const phoneObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        playSequence();
        phoneObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 },
  );
  phoneObserver.observe(document.getElementById('phoneMock'));
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

/* ---------- Formulaire ----------
   Endpoint de collecte des numéros. Vide, le formulaire valide et confirme sans
   rien envoyer — c'est l'état attendu en développement et en préversion. Une
   fois renseigné, il reçoit un POST JSON { phone, source }, abandonné au bout
   de 10 s. L'adresse est publique : la protection anti-spam et la limitation de
   débit se font côté serveur. */
const LEAD_ENDPOINT = '';

const form = document.getElementById('ctaForm');
const formMsg = document.getElementById('formMsg');
const submitBtn = document.getElementById('ctaSubmit');
const submitLabel = document.getElementById('ctaLabel');
const phoneRegex = /^(\+225)?[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}$/;

const messages = {
  invalid: 'Entrez un numéro ivoirien valide, ex. +225 07 00 00 00 00.',
  ok: "Merci ! Nous vous préviendrons dès l'ouverture de PharmaSur.",
  failed: 'Envoi impossible pour le moment. Réessayez dans un instant.',
};

const setStatus = (ok, msg) => {
  formMsg.textContent = msg;
  formMsg.classList.toggle('is-error', !ok);
};

let pending = false;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (pending) return;

  const value = form.phone.value.trim();
  if (!phoneRegex.test(value)) {
    setStatus(false, messages.invalid);
    return;
  }

  if (!LEAD_ENDPOINT) {
    setStatus(true, messages.ok);
    form.reset();
    return;
  }

  pending = true;
  submitBtn.disabled = true;
  submitLabel.textContent = 'Envoi…';
  setStatus(true, '');

  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ phone: value, source: 'landing-cta' }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    setStatus(true, messages.ok);
    form.reset();
  } catch {
    /* Le numéro reste dans le champ : le visiteur n'a pas à le retaper. */
    setStatus(false, messages.failed);
  } finally {
    pending = false;
    submitBtn.disabled = false;
    submitLabel.textContent = 'Être prévenu';
  }
});

/* ---------- Année courante ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
