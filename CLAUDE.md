# PharmaSur

Application de géolocalisation de médicaments en Côte d'Ivoire. Deux produits
sur un seul dépôt : une **application patient** et une **console pharmacie**,
plus le **site vitrine** qui les distribue.

Éditeur : ELEGSON (SARL, Abidjan). Responsable : Rodrigue Elegbede.
Production : <https://pharmasur.ci> (Vercel, déploiement automatique sur `main`).
Langue du produit, du code et des échanges : **français**.

---

## 1. Ce que l'application doit faire

### La proposition

Les autres applications ivoiriennes répondent à « **où** trouver mon
médicament ». Ce terrain est occupé par un acteur financé (Meditect, 1 200+
officines équipées de son logiciel de gestion, présent dans 8 pays).

PharmaSur répond à une autre question, que personne ne traite :

> **« J'ai 15 000 F en poche. Est-ce que je peux sortir avec cette ordonnance,
> et sinon que faire ? »**

### Le fait qui commande tout

Le prix des médicaments est **homologué** en Côte d'Ivoire — décret n° 94-667
du 21 décembre 1994, marges du grossiste et de l'officine fixées par arrêté.
Une même boîte coûte donc le même prix partout. **Comparer les prix n'a aucun
sens**, et toute fonctionnalité qui le suggère est fausse.

Ce qui change tout, en revanche : le remboursement ne s'applique **que dans
les officines conventionnées** avec l'organisme du patient. Une boîte à
10 000 F se paie 2 000 F chez un partenaire MUGEF-CI et 10 000 F à côté.

**Le choix de l'officine multiplie la dépense par cinq, et c'est invisible
depuis le trottoir.** C'est le cœur du produit.

### Les trois entrées du calcul

| Entrée | Coût d'entretien |
|---|---|
| Prix du médicament | **nul** — homologué, public, stable |
| Taux de couverture | **faible** — une poignée de nombres |
| Convention officine × organisme | **le seul point dur** |

Deux applications ivoiriennes ont tenté le troisième point et sont mortes de
sa péremption silencieuse (Pharmacy CI, dernière version nov. 2022, site hors
service ; Pharmacie de Garde CI, févr. 2019). **C'est le risque principal du
projet**, et la raison du mécanisme de confirmation par le patient.

---

## 2. Fonctionnalités implémentées

### Application patient — `/app/` (7 écrans)

| Écran | Fait quoi |
|---|---|
| **Recherche** | Cherche un produit par nom ou principe actif, l'ajoute à la liste |
| **Ma liste** | L'ordonnance en cours, son coût, l'option budget |
| **Résultats** | Officines classées, avec le reste à charge de chacune |
| **Fiche officine** | Détail, reste à charge, bons acceptés, confirmation |
| **Équivalent** | Le même principe actif sous un autre nom |
| **Carte** | Uniquement les officines **ouvertes** |
| **Profil** | Déclaration de l'organisme d'assurance |

**Reste à charge.** Calculé par `resteACharge()`. Trois conditions, toutes
nécessaires : organisme déclaré, officine conventionnée, produit remboursable.
Il en manque une → prix plein, avec le motif et **ce qu'il faut faire**.
Remonté aussi dans la liste des résultats, pour que comparer ne demande pas
d'ouvrir chaque fiche.

**Budget.** Le patient saisit ce qu'il a ; l'application propose les
équivalents au même principe actif, classés par économie, et dit franchement
quand même cela ne suffit pas. **Fermé par défaut, jamais proposé d'office.**

**Confirmation d'un bon.** « MUGEFCI a-t-elle été acceptée ici ? » — Oui/Non,
sur la fiche officine. Quatre états : déclaré, confirmé, refusé (barre la
pastille), périmé au-delà de 120 jours. **Reste sur l'appareil.**

**Horaires et garde.** `ouverture()` calcule l'état réel à l'heure de la
recherche, plages enjambant minuit comprises. Les officines de garde comptent
comme ouvertes.

**Fraîcheur des stocks.** Au-delà de 48 h sans confirmation, une disponibilité
devient « incertaine » et ne peut plus faire monter une officine à
« disponible ».

**Filtre par assurance.** Fermé par défaut, annonce combien il écarte.

### Console pharmacie — `/console/`

Inscription (agrément vérifié avant mise en ligne), stocks, bons d'assurance
avec **rappel hebdomadaire obligatoire**, demandes locales agrégées.

« Obligatoire » a un sens précis et un seul : passé le délai, la fiche cesse
d'**affirmer** que les organismes sont acceptés et passe en « à reconfirmer ».
Elle ne disparaît jamais des résultats — punir le patient de la négligence de
son pharmacien serait absurde. **La sanction porte sur l'affirmation, jamais
sur la visibilité.**

Les demandes locales et la remontée des équivalents recherchés sont
**agrégées, anonymes, et sous un seuil de 5 recherches**.

### Site vitrine

Hero, fonctionnement, fiabilité, offres, engagements, téléchargement.
Trois routes d'installation : APK Android, guide iPhone (Safari, sans App
Store), fichier HTML unique hors ligne (< 500 ko, vérifié au build).

Pages annexes : `/aide/`, `/mentions-legales/`, `/confidentialite/`, `/iphone/`.

### Ce qui n'existe pas, et ne doit pas être inventé

- **Aucun serveur, aucune base de données, aucun compte.** Tout est local.
- **Aucune collecte de données.** Le formulaire de rappel par téléphone a été
  retiré (6 sept. 2026) : il était redondant — l'application installée reçoit
  les officines réelles sans rien demander — et il portait à lui seul la base
  légale, la durée de conservation et un transfert vers les États-Unis.
- **Aucune géolocalisation réelle.** `Permissions-Policy: geolocation=()`.
- **Aucun scan anti-contrefaçon.** Retiré faute de base de codes authentiques.
- **Aucune mesure d'audience, aucun cookie.**
- Les données de `src/app/donnees.ts` sont **fausses** : quatre officines de
  démonstration, dix produits. Le site le dit au visiteur.

---

## 3. Structure des fichiers

```
src/
  App.tsx, main.tsx, entry-server.tsx   Site vitrine (React)
  index.css                             Jetons Tailwind v4 (@theme)
  legal.ts                              Entrée des pages légales
  components/                           Sections du site
    Hero, HeroBackdrop, HowItWorks, Reliability, Pricing,
    Engagements, CtaTelecharger, Footer, Nav, PhoneMock,
    InstallerIphone, primitives
  lib/
    destinations.ts   Toutes les URL de téléchargement
    plateforme.ts     Détection Android / iPhone / iPad / ordinateur
    cx.ts             Concaténation de classes
  app/                                  APPLICATION PATIENT
    donnees.ts        ★ Données ET règles métier. À lire en premier.
    App.tsx           Les 7 écrans
    ui.tsx, icones.tsx

design/                                 Sources des visuels (Node, hors build)
  console/            donnees.mjs · ecrans.mjs · style.mjs
  generer-console.mjs → public/console/ + public/console-pharmasur.html
  generer-og.mjs, mesurer-og.mjs, og-commun.mjs
  generer-icones-*.mjs, generer-visuels.mjs
  maquettes-app/, maquettes-console/    Canevas Claude Design (.dc.html)

collecte/                               Référencement des officines
  fiche.html → generer-fiche.mjs → fiche-de-collecte.html
  officines.csv, verifier.mjs, diagnostic-pharmasur.html

scripts/
  generer-app-fichier.mjs   Application patient en un seul fichier HTML
  prerender.mjs             Injecte le HTML rendu dans dist/index.html
  signer-apk.mjs            Signature des APK

public/       APK, PWA console, polices, og.jpg, .well-known/assetlinks.json
aide/ iphone/ mentions-legales/ confidentialite/ app/    Pages HTML statiques
vercel.json   En-têtes de sécurité, CSP, Content-Disposition
```

**Le fichier le plus important est `src/app/donnees.ts`.** Il porte les données
de démonstration *et* toutes les règles métier, chacune avec le raisonnement
qui l'a produite. Le lire avant de toucher à l'application patient.

---

## 4. Technologies

| | |
|---|---|
| **Vite 8** | Build. Mode MPA : `index`, `mentions`, `confidentialite`, `aide`, `iphone`, `app` |
| **React 19** + **TypeScript 7** | Site et application patient |
| **Tailwind CSS v4** | Jetons dans `src/index.css` via `@theme` — pas de `tailwind.config.js` |
| **motion 13** | Animations |
| **oxlint** | `npm run lint` |
| **Node** (`.mjs`) | Génération des visuels et de la console, hors build |
| **Vercel** | Hébergement, déploiement sur `main` |
| **Bubblewrap / TWA** | APK Android (`android/`, `android-console/`) |

Chaîne de build (`npm run build`), dans l'ordre :
`tsc -b` → build du fichier unique → `generer-app-fichier.mjs` → build client
→ build SSR → `prerender.mjs`.

La console pharmacie n'est **pas** en React : elle est générée en HTML/CSS/JS
par `design/generer-console.mjs`, en deux sorties — la PWA `public/console/` et
le fichier autonome `public/console-pharmasur.html`.

---

## 5. Décisions de design et instructions pour un futur modèle

### 5.1 La règle cardinale — ne rien laisser de faux au visiteur

C'est la règle qui prime sur toutes les autres, y compris sur l'esthétique et
sur la demande immédiate.

Sur ce projet, ont été trouvées et retirées : un numéro de téléphone qui ne
sonnait nulle part, des comptes sociaux menant en haut de page, des
témoignages inventés, une photographie de héros aux droits non établis,
« vérifiés il y a 2 jours » codé en dur, « stocks synchronisés il y a 30 s »,
un scan anti-contrefaçon sans base de codes, des prix présentés comme variables
alors qu'ils sont homologués.

**Attendu de vous :** signaler ces affirmations *et* les retirer, sans attendre
qu'on vous le demande. Si une demande de l'utilisateur rendrait une page
fausse, corriger la page en même temps — ou le dire et refuser d'introduire le
mensonge.

### 5.2 Mesurer plutôt qu'estimer

Ont été rattrapés par la mesure, jamais par l'œil : un vide de 340 px, six
blocs à 0 px d'écart, plusieurs contrastes sous le seuil, une expression
régulière silencieusement cassée, des pastilles tronquées, une maquette
débordant de 76 px.

- **Contraste :** Tailwind v4 émet des `oklab()` que `getComputedStyle` ne
  résout pas — une première mesure a renvoyé 1:1. **Méthode correcte :**
  peindre la couleur dans un `<canvas>` 1×1 et lire le pixel. Seuil retenu sur
  ce projet : **7:1**, au-delà des 4,5 exigés.
- **Géométrie :** relever `getBoundingClientRect()` sur le rendu réel.
- **Cadres de maquette :** hauteur fixe et `overflow: hidden` — **le rognage est
  silencieux**. Toujours mesurer après avoir ajouté du contenu.
- **Argent :** vérifier l'arithmétique hors interface (`node fichier.mts`,
  Node retire les types tout seul) *et* le nombre affiché à l'écran.

### 5.3 Doctrines du produit — ne pas contourner

1. **Fraîcheur.** Au-delà de 48 h, une disponibilité est « incertaine », jamais
   « disponible ». Un bon confirmé par le patient se périme à 120 jours.
2. **Équivalents.** Par principe actif **et** dosage identiques, jamais une
   autre molécule, toujours avec la mention du pharmacien. **Jamais proposés
   spontanément pour une raison de prix** : uniquement en rupture, ou quand le
   patient a lui-même déclaré un budget. La distinction est tout ce qui sépare
   un service d'un argumentaire commercial.
3. **Prix homologués.** Un produit, un prix, le même partout. Rien à comparer
   entre officines sur ce terrain.
4. **Ouverture.** Une officine n'est proposée que si elle est ouverte. La
   **carte** ne montre que les ouvertes ; l'écran **Résultats** garde les
   fermées, grisées en bas, pour savoir quand rappeler.
5. **Organismes nommés.** « CMU », « MUGEFCI », « NSIA Assurances » — jamais
   des catégories comme « Mutuelles » ou « Assurances », qui ne répondent à
   personne.
6. **Agrégation.** Toute remontée vers le pharmacien est agrégée, anonyme, et
   sous un seuil de 5. Une notification nominative révélerait d'un coup une
   gêne financière et un état de santé à quelqu'un qu'on va voir en face.
7. **Estimation, jamais promesse.** Le reste à charge est une **fourchette
   haute** ; c'est le ticket du comptoir qui fait foi.

### 5.4 Taux de couverture — relevés le 7 septembre 2026

| Organisme | Couverture | Reste à charge |
|---|---|---|
| CMU (CNAM) | 70 % | 30 % |
| MUGEF-CI, régime complémentaire obligatoire | **80 %** depuis le 21 avril 2025, engagé jusqu'en 2027 | 20 % |
| MUGEF-CI / CMU (arrimage fonctionnaires) | 80 % | 20 % |
| Ivoir Santé Plus | 70 % | 30 % |
| **Assureurs privés** (NSIA, SUNU, Sanlam) | **80 % ou 100 % selon contrat** | **non public** |

Pour le privé, `TAUX_COUVERTURE` vaut `null` — ce qui signifie « nous ne
savons pas », pas « zéro ». **Ne jamais inventer un taux privé.**

**Tout n'est pas remboursé.** Le champ `remboursable` existe pour ça :
annoncer 20 % de reste à charge sur un produit couvert à 0 % enverrait
quelqu'un au comptoir avec le quart de la somme. La source réelle sera la
Liste des Médicaments Remboursables de la MUGEF-CI (PDF public, 5 607
références en janvier 2026, avec prix, DCI, générique/spécialité, régime).

### 5.5 Écriture

Français, vouvoiement, phrases courtes. Nommer les choses comme le patient les
nomme. Un bouton dit ce qui va se passer. Un message d'erreur dit **quoi
faire**, pas seulement ce qui manque. Ne jamais inventer un accord grammatical
sur un nom de médicament dont on ignore le genre — reformuler.

Les commentaires du code portent le **pourquoi**, pas le quoi, et gardent la
trace de ce qui a été retiré et pour quelle raison. C'est la mémoire du
projet : les respecter et les tenir à jour.

### 5.6 Pièges de l'environnement

- **`vercel.json` n'accepte aucun commentaire.** Une clé `"//"` a fait échouer
  un déploiement sans le moindre log de build — la validation échoue avant.
- **CSP :** `connect-src 'self'` et `form-action 'self'`. Le site ne peut plus
  joindre aucun tiers. `font-src` doit garder `data:` — la console embarque une
  police en `data:font/woff2`.
- **Shell :** ne pas passer d'accents ni de `${...}` à `node -e` via bash, ils
  sont corrompus. Utiliser les outils Edit/Write, ou un heredoc.
- **Volet navigateur :** il bloque les sous-ressources de `pharmasur.ci`
  (`ERR_BLOCKED_BY_CLIENT`). Vérifier la production avec `curl`, et le local
  sur `localhost`. Un fichier hors du dossier projet n'est pas exécuté.
- **Service worker :** tester `isSecureContext`, pas
  `location.protocol === 'https:'` — sinon rien ne s'enregistre sur localhost.
- **Cache :** avant de conclure à un bug en production, vérifier avec un
  paramètre anti-cache. Un rapport de bug s'est déjà expliqué par une page en
  cache.

---

## 6. État au 7 septembre 2026 — ce qui bloque

**Ne relèvent pas du modèle, à ne pas tenter de contourner :**

1. **N° RCCM** — manquant dans `mentions-legales/`.
2. **Démarches ARTCI** — manquantes dans `confidentialite/`. La question ne
   porte plus sur une collecte (il n'y en a plus) mais sur les journaux
   techniques de l'hébergeur.
3. **Sens de la colonne « prix » de la LMR** — prix comptoir ou base de
   remboursement ? Confrontée à une officine réelle, la liste tombe juste à
   2-5 % près, ce qui exclut un tarif de gros. Trancher demande une source
   primaire : trois tickets de caisse, ou un appel au 1676.

Les deux pages légales gardent leur **bandeau rouge** et leur **`noindex`**
jusqu'à relecture par un juriste ivoirien. **Ne pas les retirer**, même une
fois les mentions remplies.

**Autres points ouverts :** les deux APK sont signés en debug (le Play Store
les refuse ; une clé de release est définitive, la perdre interdit toute mise
à jour) · caches de service worker figés à `v1` · aucun compte social · la
confirmation d'un bon reste locale, l'effet d'entraînement supposerait un
serveur dont la création rouvrirait toute la politique de confidentialité.

---

## 7. Manière de travailler attendue

- **Vérifier en production, pas en local**, après chaque déploiement — sur le
  code réellement livré (bundle, en-têtes HTTP), pas sur une copie de travail.
- **Signaler ses propres erreurs.** Une régression de contraste introduite puis
  mesurée à 4,30 a été corrigée et documentée. Un chiffre estimé dans un
  commentaire a été remplacé par le chiffre mesuré.
- **Ne pas élargir le périmètre en silence** ; ne pas le rétrécir non plus.
  Faire la demande en entier, dire ce qui a été laissé et pourquoi.
- **Distinguer une décision d'une évidence.** Le classement des officines, la
  durée de conservation, le seuil d'agrégation sont des arbitrages : les poser
  clairement comme tels et laisser Rodrigue trancher.
- `npm run build` **et** `npm run lint` avant de commiter. Messages de commit
  en français, sans accents (le shell les corrompt), expliquant le **pourquoi**.
- Ne commiter et ne pousser **que sur demande explicite**.
