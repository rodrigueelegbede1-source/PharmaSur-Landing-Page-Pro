# PharmaSur — Landing page (version pro)

Version modernisée de la landing page PharmaSur : géolocalisation des médicaments disponibles dans
les pharmacies de Côte d'Ivoire et authentification anti-contrefaçon par scan.

Le contenu, la structure et l'identité verte reprennent la version statique
(`../Pharmasur-landing-page`). Ce qui change : exécution en composants, animations pilotées par le
scroll et un système de design centralisé.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 — tous les tokens sont déclarés dans `src/index.css` via `@theme`
- Motion (`motion/react`) pour les animations
- oxlint

## Commandes

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck (tsc -b) + build de production
npm run preview  # sert le build
npm run lint     # oxlint
```

## Structure

```
src/
  index.css              tokens verts, typographie, utilitaires (rail, eyebrow, grad), keyframes
  lib/cx.ts              concaténation de classes
  components/
    primitives.tsx       Reveal, Eyebrow, Badge, Button, Counter, SectionHead
    Nav.tsx              header fixe translucide, logo, menu mobile
    Hero.tsx             titre révélé ligne par ligne, parallaxe, compteurs
    PhoneMock.tsx        maquette app : frappe de la recherche, résultats en cascade, scan
    HowItWorks.tsx       3 étapes, fil conducteur tracé au scroll
    Pricing.tsx          3 offres en FCFA, carte « Le plus choisi » surélevée
    Testimonials.tsx     3 témoignages
    CtaPhone.tsx         capture de numéro + validation ivoirienne
    Footer.tsx
```

## Ressources

Photo d'officine fournie par le client, posée en fond du héros uniquement : elle se fond au blanc
avant `#how` (utilitaires `hero-photo` / `hero-veil` dans `src/index.css`).

| Fichier | Définition | Poids | Usage |
| --- | --- | --- | --- |
| `public/officine.webp` | 2048 × 1358 | 186 ko | écrans > 1024 px |
| `public/officine.jpg` | 2048 × 1358 | 362 ko | repli JPEG |
| `public/officine-1200.webp` | 1200 × 796 | 119 ko | écrans ≤ 1024 px |
| `public/officine-1200.jpg` | 1200 × 796 | 194 ko | repli JPEG |

La source (1024 × 679) a été remontée en 2048 px de large (Lanczos3 + masque de netteté léger)
puis réencodée. La sélection du format se fait en CSS via `image-set()`, et le WebP correspondant
est préchargé dans `index.html` (`rel="preload"` avec `media`).

## Conventions

- Un seul easing pour tout le site : `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-cine`).
- Les révélations sont `once: true` : aucune animation ne rejoue au retour du scroll.
- `prefers-reduced-motion` est respecté partout (`useReducedMotion`, `motion-safe:`/`motion-reduce:`).
- Le formulaire du CTA est local (aucun backend) : brancher `submit` dans `CtaPhone.tsx`.
- Les tarifs, chiffres et témoignages sont ceux de la version d'origine, à valider avant mise en ligne.
