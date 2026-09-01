# PharmaSur — Landing page (version statique)

Landing page de PharmaSur : composition d'une liste d'ordonnance avec son coût, géolocalisation
des pharmacies classées par nombre de produits disponibles, et authentification anti-contrefaçon
par scan, en Côte d'Ivoire.

Aucune dépendance, aucune étape de build : ouvrir `index.html` suffit.

## Rapport à la version pro

Ce projet est le **portage statique** de `../Pharmasur-landing-pro` (Vite + React 19 +
Tailwind v4), qui fait référence pour le contenu comme pour le design. Contenu, tarifs,
sections et charte y sont alignés à l'identique, mais réécrits en CSS et JavaScript natifs.

> **Les deux projets décrivent désormais la même chose avec deux stacks différentes.** Tout
> changement doit donc être fait deux fois, et l'expérience montre que l'un des deux décroche :
> c'est précisément ce qui s'était produit avant ce portage. Si un seul doit survivre, trancher
> tôt coûtera moins cher.

## Fichiers

```
index.html                    page principale
styles.css                    tokens verts, mises en page, animations, pages légales
script.js                     menu, révélations, compteurs, séquence de la maquette, formulaire

mentions-legales/index.html   page légale, sans JavaScript
confidentialite/index.html    page légale, sans JavaScript

assets/
  hero-officine*.webp/jpg     fond du héros, 2 définitions, repli JPEG
  og.jpg                      aperçu des liens partagés, 1200 × 630
  favicon.svg                 onglet du navigateur
  apple-touch-icon.png        écran d'accueil iOS, qui ne lit pas le SVG
  fonts/                      Plus Jakarta Sans variable + licence OFL
```

## Servir en local

Un double-clic sur `index.html` fonctionne : tous les chemins internes sont relatifs, y compris
ceux des pages légales. Pour un serveur local :

```bash
npx serve -l 4173 .
```

Node est disponible sur la machine de développement, **Python ne l'est pas** : le `python` du
PATH est le raccourci Microsoft Store et échoue silencieusement.

## Configuration

Le formulaire de bas de page poste le numéro saisi vers la constante `LEAD_ENDPOINT`, en tête de
la section « Formulaire » dans `script.js`.

| `LEAD_ENDPOINT` | Comportement du formulaire |
| --- | --- |
| chaîne vide (par défaut) | valide le numéro et affiche la confirmation, sans rien envoyer |
| une URL | `POST` JSON `{ "phone": "…", "source": "landing-cta" }`, abandon au bout de 10 s |

En cas d'échec réseau ou de réponse non-2xx, un message d'erreur s'affiche et le numéro reste
dans le champ. L'adresse est publique : anti-spam et limitation de débit se font côté serveur.

Les URL absolues des métadonnées de partage (`canonical`, `og:image`, `twitter:image`) sont
écrites en dur sur `https://pharmasur.ci`. Sans étape de build pour les injecter, **elles sont à
reprendre à la main** si le site est déployé ailleurs — un chemin relatif ne suffirait pas,
WhatsApp et Facebook exigent une adresse absolue.

## Repères d'implémentation

- **Tokens** : couleurs, ombres et easing sont des variables CSS dans `:root`, identiques à
  celles du projet pro.
- **Mouvement** : un seul easing pour tout le site, `--ease: cubic-bezier(.16, 1, .3, 1)`.
- **Entrée en CSS, interaction en JavaScript.** Les animations d'entrée du héros sont des
  keyframes : le texte doit pouvoir apparaître même si `script.js` échoue.
- **Accessibilité** : `prefers-reduced-motion` neutralise animations et transitions, et applique
  directement les états finaux.
- **Charte verte sans exception près** : `--alert` (#c1121f) est la seule couleur étrangère,
  réservée aux mentions que le patient ne doit pas survoler — l'équivalence générique et les
  bandeaux des pages légales. L'étendre à d'autres usages lui ferait perdre son pouvoir d'alerte.
- **Fond du héros** : `image-set()` choisit le format, une requête média la définition (52 ko
  sous 1025 px, 92 ko au-delà), et le WebP correspondant est préchargé. **Si ce fond change,
  vérifier que le préchargement suit** — la version pro a longtemps téléchargé 122 à 190 ko
  d'image jamais affichée pour cette raison.
- **Voile du héros** : il diffère selon la largeur, et ce n'est pas cosmétique. En deux colonnes
  il est dégradé ; sous 1025 px, le texte occupant toute la largeur, ce même dégradé le laissait
  sur la partie claire de la photo (contraste mesuré à 2,2:1). Le voile y est donc presque
  uniforme : sur petit écran, la lisibilité prime sur l'image.
- **Maquette téléphone** : l'écran est **à saturation**, 14 px de marge. Tout ajout suppose d'en
  retirer autre chose, faute de quoi le conteneur flex comprime silencieusement la carte de scan
  sans provoquer de débordement visible.
- **Police auto-hébergée** : un seul fichier variable couvre les cinq graisses, et évite deux
  connexions externes plus une feuille bloquante — coût invisible en fibre, sensible sur une
  connexion mobile ivoirienne.
- PharmaSur localise et informe, mais n'interprète jamais : l'équivalence proposée porte sur le
  principe actif seul, jamais sur une autre molécule, et reste soumise au pharmacien.

## Pages légales

`mentions-legales/` et `confidentialite/` sont de véritables pages, avec une URL propre,
indexable et citable, comme l'exige un document opposable. Une ancre sur la page d'accueil
n'aurait pas suffi. Elles n'embarquent aucun script : une politique de confidentialité doit
rester lisible même si le JavaScript échoue.

Leur contenu est un **canevas** : bandeau rouge en tête, `noindex` dans l'en-tête, et seize
mentions surlignées à compléter. Retirer le bandeau et le `noindex` une fois le texte complété
et relu par un juriste.

## Avant la mise en ligne

| À traiter | Où | Pourquoi c'est bloquant |
| --- | --- | --- |
| `LEAD_ENDPOINT` | `script.js` | sans lui, le formulaire ne collecte rien |
| URL absolues de partage | `index.html` | aucun aperçu au partage si le domaine diffère |
| Statistiques 1 400+, 98 % et 45 s | `index.html` — `À ACTUALISER` | chiffres de maquette affichés comme des faits |
| Trois témoignages | `index.html` — `À ACTUALISER` | avis fictifs sur une application de santé |
| Prix des médicaments | `index.html` — `À VALIDER` | un tarif faux coûte plus cher qu'un tarif absent |
| Dispositif de fiabilité | section `#fiabilite` — `À CONSTRUIRE` | la section décrit un existant qui n'existe pas |
| Gestion des bons d'assurance | maquette — `À CONSTRUIRE` | ajout manuel à l'inscription, retrait possible à tout moment |
| Coordonnées de contact | pied de page | `+225 27 22 00 00 00` et `contact@pharmasur.ci` sont des exemples |
| Liens des réseaux sociaux | pied de page | les trois pointent vers `#hero` |
| 16 mentions légales | `mentions-legales/`, `confidentialite/` | raison sociale, RCCM, hébergeur, ARTCI |
| Relecture juridique | les deux pages légales | conformité à la loi n°2013-450, à faire valider |
| Licence de la photo | `assets/hero-officine*` | droits à confirmer avant diffusion |

Deux formulations restent également à trancher : le `+` de « 1 400+ », qui annonce davantage
qu'un chiffre exact, et le libellé « Pharmacies partenaires », inexact si 1 400 désigne le total
des officines du pays plutôt que vos signataires.
