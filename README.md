# PharmaSur — Landing page (version pro)

Version modernisée de la landing page PharmaSur : géolocalisation des médicaments disponibles dans
les pharmacies de Côte d'Ivoire.

L'identité verte et la trame générale viennent de la version statique (`../Pharmasur-landing-page`),
mais le produit décrit a depuis divergé : la recherche porte sur une **liste de produits** classée
par complétude, affiche le **coût de l'ordonnance** et propose un **équivalent générique** en cas de
rupture. La promesse de scan d'ordonnance, présente à l'origine, a été retirée au profit d'une
saisie manuelle réellement prévue.

Deux fonctionnalités annoncées à l'origine ont été retirées, pour la même raison : elles étaient
promises et non construites.

- **Le scan d'ordonnance**, remplacé par la saisie manuelle.
- **Le scan d'authentification anti-contrefaçon**, retiré faute de base de codes authentiques.
  Vérifier qu'une boîte est authentique suppose d'interroger un référentiel que le projet n'a pas.
  Tant qu'il n'existe pas, l'annoncer promettrait à un patient une vérification qu'il n'obtiendrait
  pas — sur un produit de santé, c'est la promesse la plus grave qu'on puisse tenir à faux. Ne pas
  la remettre avant que la base existe et soit interrogeable.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 — tous les tokens sont déclarés dans `src/index.css` via `@theme`
- Motion (`motion/react`) pour les animations
- oxlint

## Commandes

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck, build client, build SSR, puis pré-rendu
npm run preview  # sert le build
npm run lint     # oxlint
```

`build` enchaîne quatre étapes : `tsc -b`, le build client, un build SSR de
`src/entry-server.tsx`, puis `scripts/prerender.mjs` qui injecte le HTML rendu dans
`dist/index.html` et supprime le dossier SSR intermédiaire. Le site reste **entièrement
statique** : aucun serveur Node n'est nécessaire à l'exécution.

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
index.html                    page principale
mentions-legales/index.html   page légale, sans React
confidentialite/index.html    page légale, sans React
design/officine.jpg           source de og.jpg, hors public/ : jamais déployée

scripts/prerender.mjs         injecte le HTML rendu au build dans dist/index.html

src/
  index.css              tokens verts, typographie, utilitaires (rail, eyebrow, grad), keyframes
  entry-server.tsx       rendu du site en HTML au build, pour le pré-rendu
  legal.ts               entrée des pages légales : charge la feuille de style, rien d'autre
  lib/cx.ts              concaténation de classes
  components/
    primitives.tsx       Reveal, Eyebrow, Badge, Button, Counter, SectionHead
    Nav.tsx              header fixe translucide, logo, menu mobile
    Hero.tsx             titre révélé ligne par ligne, parallaxe, compteurs
    HeroBackdrop.tsx     fond dessiné en SVG : plan urbain, cercles de recherche, repères
    PhoneMock.tsx        maquette : liste multi-produits, prix, équivalent générique, itinéraire
    HowItWorks.tsx       3 étapes, fil conducteur tracé au scroll
    Reliability.tsx      les trois voies qui tiennent le stock à jour
    Pricing.tsx          2 offres : gratuite pour les patients, abonnement pour les officines
    Testimonials.tsx     3 témoignages
    CtaPhone.tsx         capture de numéro, envoi à l'endpoint, mention d'usage
    Footer.tsx
```

## Pages légales

`/mentions-legales/` et `/confidentialite/` sont de véritables entrées du build, déclarées dans
`vite.config.ts` (`rollupOptions.input`) : une URL propre, indexable et citable, comme l'exige un
document opposable. Une ancre sur la page d'accueil n'aurait pas suffi.

Elles n'embarquent ni React ni moteur d'animation — `src/legal.ts` ne fait qu'importer la feuille
de style, soit 0,02 ko de script. Une politique de confidentialité doit rester lisible même si le
JavaScript échoue.

Leur contenu est un **canevas** : bandeau rouge en tête, `noindex` dans l'en-tête, et seize mentions
surlignées à compléter. Retirez le bandeau et le `noindex` une fois le texte complété et relu par
un juriste.

## Ressources

Le fond du héros est la photo d'officine fournie par le client, ramenée dans la charte par un
voile vert. `HeroBackdrop.tsx` assemble les deux et n'y laisse, du plan urbain qui occupait
cette place, que les cercles de recherche : superposé à une photographie déjà dense, le dessin
faisait du bruit.

| Fichier | Définition | Poids | Usage |
| --- | --- | --- | --- |
| `public/hero-officine.webp` | 1500 × 995 | 90 ko | écrans > 1024 px |
| `public/hero-officine.jpg` | 1500 × 995 | 128 ko | repli JPEG |
| `public/hero-officine-900.webp` | 900 × 597 | 51 ko | écrans ≤ 1024 px |
| `public/hero-officine-900.jpg` | 900 × 597 | 63 ko | repli JPEG |
| `design/officine.jpg` | 2048 × 1358 | 362 ko | **source, hors `public/`, jamais déployée** |

La sélection du format et de la définition se fait en CSS via `image-set()` et une requête média
(utilitaire `hero-photo`), et le WebP correspondant est préchargé dans `index.html`. Les dérivées
sont légèrement désaturées : la photo est très colorée et jurerait sous un voile vert.

**Le voile (`hero-veil`) diffère selon la largeur, et ce n'est pas cosmétique.** En deux colonnes
il est dégradé, dense à gauche sous le titre et transparent à droite où la scène doit rester
visible. Sous 1025 px, le texte occupant toute la largeur, ce même dégradé le laissait sur la
partie claire de la photo — contraste mesuré à 2,2:1. Le voile y est donc presque uniforme :
sur petit écran, la lisibilité prime sur l'image.

> Cette photo avait déjà servi de fond au héros, puis avait été remplacée par un dessin SVG sans
> que le préchargement ne soit retiré : chaque visiteur téléchargeait 122 à 190 ko d'image jamais
> affichée. Si le fond change à nouveau, vérifiez que le préchargement suit.

## Partage et icônes

| Fichier | Définition | Poids | Usage |
| --- | --- | --- | --- |
| `public/og.jpg` | 1200 × 630 | 75 ko | aperçu des liens : WhatsApp, Facebook, X, LinkedIn |
| `public/apple-touch-icon.png` | 180 × 180 | 4 ko | écran d'accueil iOS, qui ne lit pas le SVG |
| `public/favicon.svg` | vectoriel | 1 ko | onglet du navigateur |

`og.jpg` superpose à `design/officine.jpg` un voile vert, le logo et le titre du site, composés
dans Plus Jakarta Sans et les couleurs de la charte. Il reste sous les 300 ko au-delà desquels
WhatsApp cesse d'afficher l'aperçu. À régénérer si le titre ou l'identité changent — sinon les
liens partagés continueront d'annoncer l'ancienne version.

La composition a été rendue hors du projet (`sharp` + `@resvg/resvg-js`, la police chargée depuis
son fichier variable), pour ne pas imposer ces dépendances au site. `apple-touch-icon.png` reprend
`favicon.svg` en 180 px sur fond plein : iOS applique son propre masque arrondi et ferait ressortir
en noir des coins transparents.

## Marque et réseaux sociaux

Tout est dans `design/`, hors de `public/` : ce sont des fichiers de marque, pas des ressources
du site, et rien n'est déployé.

| Fichier | Usage |
| --- | --- |
| `logo/pharmasur-marque.svg` | la tuile seule, en vectoriel — favicon, avatar, app |
| `logo/pharmasur-marque-512.png` · `-1024.png` | même tuile en PNG, pour les plateformes qui refusent le SVG |
| `logo/pharmasur-logo-fond-clair.png` · `.svg` | verrou horizontal sur fond clair, 2400 px, fond transparent |
| `logo/pharmasur-logo-fond-sombre.png` · `.svg` | idem pour fond sombre : mot en blanc, « Sur » en vert clair |
| `reseaux-sociaux/*.jpg` | couvertures aux dimensions de chaque plateforme |

Les couvertures sont dimensionnées **sur la largeur visible**, jamais sur le petit côté : une bande
comme celle de YouTube (zone sûre 1546 × 423 au centre d'un 2560 × 1440) donnerait sinon un logo
minuscule, et un carré un logo qui déborde.

`generer-visuels.mjs` régénère l'ensemble. Ses deux dépendances ne sont pas dans `package.json` :
elles ne servent qu'à fabriquer des images et n'ont rien à faire dans le site livré. Les
instructions d'installation sont en tête du fichier.

> Le mot-symbole est rendu en simulant l'extra-bold par un contour de 5,5 % du corps : la police
> variable ne s'expose qu'en graisse par défaut au rendu. Au-delà de 7 %, les contreformes du
> « a » et du « e » se referment.

## Maquettes de l'application

`design/maquettes-app/` contient les sept écrans de l'application patient, un fichier `.dc.html`
par écran plus `canvas.json` qui les dispose. Ce sont des **maquettes à valider**, pas du code
applicatif : elles servent de référence à qui construira l'application en Flutter ou React Native.

`design/maquettes-console/` contient de la même façon les cinq écrans de la console pharmacie :
inscription de l'officine, tableau de bord, stocks, bons d'assurance et demandes locales.

Elles reprennent les tokens de `src/index.css` et le contenu réel du site — mêmes produits, mêmes
prix, même classement par complétude — pour qu'un développeur n'ait pas à réinventer des valeurs
déjà arrêtées.

Le canevas assemblé (2,5 Mo) n'est pas versionné : il se régénère depuis ces sources, et vit en
ligne comme document partageable.

> Le canevas comptait trois écrans de plus — Scan, Boîte authentifiée, Boîte non reconnue — retirés
> avec la fonctionnalité. Ils avaient posé une règle qui reste valable le jour où elle reviendra :
> ne jamais affirmer la contrefaçon, parce qu'un code abîmé donne le même résultat qu'une fausse
> boîte, et qu'accuser à tort exposerait autant le service qu'une officine honnête.

## Conventions

- **Entrée en CSS, interaction en JavaScript.** Les animations d'entrée du héros sont des
  keyframes CSS (`ps-line`, `ps-rise`, `ps-fade`) : le HTML étant pré-rendu, le texte doit
  pouvoir apparaître avant que `motion` ne soit chargé. Confiées à `motion`, elles
  inscriraient un `opacity: 0` en style en ligne dans le HTML livré, et le visiteur
  attendrait 115 ko de JavaScript devant un héros vide. `motion` reste pour ce qui dépend
  réellement de l'exécution : parallaxe au scroll, frappe de la maquette, révélations en
  descendant la page.
- Un seul easing pour tout le site : `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-cine`).
- Les révélations sont `once: true` : aucune animation ne rejoue au retour du scroll.
- `prefers-reduced-motion` est respecté partout (`useReducedMotion`, `motion-safe:`/`motion-reduce:`).
- Le formulaire du CTA poste vers `VITE_LEAD_ENDPOINT` (voir Configuration) ; sans variable
  définie, il reste local.
- La charte est verte, sans exception près : `--color-alert` est la seule couleur étrangère,
  réservée aux mentions que le patient ne doit pas survoler. L'étendre à d'autres usages lui
  ferait perdre son pouvoir d'alerte.
- L'écran du téléphone dans `PhoneMock.tsx` est **à saturation** : 8 px de marge. Tout ajout
  suppose d'en retirer autre chose, faute de quoi le conteneur flex comprime silencieusement la
  carte du bas sans provoquer de débordement visible.
- PharmaSur localise et informe, mais n'interprète jamais : l'équivalence proposée porte sur le
  principe actif seul, jamais sur une autre molécule, et reste soumise au pharmacien.

## Avant la mise en ligne

Le code porte des marqueurs là où une décision reste à prendre. Cette liste les récapitule.

| À traiter | Où | Pourquoi c'est bloquant |
| --- | --- | --- |
| `VITE_LEAD_ENDPOINT` | `.env` | sans lui, le formulaire ne collecte rien |
| `VITE_SITE_URL` | `.env` | sans lui, aucun aperçu au partage si le domaine diffère |
| Statistiques 98 % et 45 s | `Hero.tsx` — `À ACTUALISER` | chiffres de maquette affichés comme des faits |
| Prix des médicaments | `PhoneMock.tsx` — `À VALIDER` | un tarif faux coûte plus cher qu'un tarif absent |
| Dispositif de fiabilité | `Reliability.tsx` — `À CONSTRUIRE` | la section décrit un existant qui n'existe pas |
| Gestion des bons d'assurance | `PhoneMock.tsx` — `À CONSTRUIRE` | ajout manuel à l'inscription, retrait possible à tout moment |
| 16 mentions légales | `mentions-legales/`, `confidentialite/` | raison sociale, RCCM, hébergeur, ARTCI |
| Relecture juridique | les deux pages légales | conformité à la loi n°2013-450, à faire valider |

Deux formulations restent également à trancher : le `+` de « 1 400+ », qui annonce davantage qu'un
chiffre exact, et le libellé « Pharmacies partenaires », inexact si 1 400 désigne le total des
officines du pays plutôt que vos signataires.
