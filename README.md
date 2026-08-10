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

## Configuration

Le formulaire de bas de page envoie le numéro saisi à l'endpoint défini par
`VITE_LEAD_ENDPOINT`. Copiez le modèle puis renseignez-le :

```bash
cp .env.example .env
```

| `VITE_LEAD_ENDPOINT` | Comportement du formulaire |
| --- | --- |
| vide ou absent | valide le numéro et affiche la confirmation, sans rien envoyer |
| une URL | `POST` JSON `{ "phone": "…", "source": "landing-cta" }`, abandon au bout de 10 s |

En cas d'échec réseau ou de réponse non-2xx, un message d'erreur s'affiche et le
numéro reste dans le champ. Le type de la variable est déclaré dans `src/vite-env.d.ts`.

`VITE_SITE_URL` fixe le domaine public : `vite.config.ts` l'injecte dans `index.html`
à la place de `%SITE_URL%` pour les URL absolues des métadonnées de partage
(`og:image`, `canonical`). Sans valeur, `https://pharmasur.ci` s'applique. Un chemin
relatif ne suffirait pas — WhatsApp et Facebook exigent une URL absolue. À renseigner
donc si le site est déployé ailleurs, sinon aucun aperçu ne s'affichera au partage.

Toute variable préfixée `VITE_` est intégrée au bundle JavaScript public : n'y placez
jamais de clé secrète. L'endpoint doit donc être une adresse publique, protégée côté
serveur (anti-spam, limitation de débit).

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

## Partage et icônes

| Fichier | Définition | Poids | Usage |
| --- | --- | --- | --- |
| `public/og.jpg` | 1200 × 630 | 75 ko | aperçu des liens : WhatsApp, Facebook, X, LinkedIn |
| `public/apple-touch-icon.png` | 180 × 180 | 4 ko | écran d'accueil iOS, qui ne lit pas le SVG |
| `public/favicon.svg` | vectoriel | 1 ko | onglet du navigateur |

`og.jpg` superpose à la photo d'officine un voile vert, le logo et le titre du site,
composés dans la police et les couleurs de la charte. Il reste sous les 300 ko au-delà
desquels WhatsApp cesse d'afficher l'aperçu. À régénérer si le titre ou l'identité
changent — sinon les liens partagés continueront d'annoncer l'ancienne version.

## Conventions

- Un seul easing pour tout le site : `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-cine`).
- Les révélations sont `once: true` : aucune animation ne rejoue au retour du scroll.
- `prefers-reduced-motion` est respecté partout (`useReducedMotion`, `motion-safe:`/`motion-reduce:`).
- Le formulaire du CTA poste vers `VITE_LEAD_ENDPOINT` (voir Configuration) ; sans variable
  définie, il reste local.
- Les tarifs, chiffres et témoignages sont ceux de la version d'origine, à valider avant mise en ligne.
