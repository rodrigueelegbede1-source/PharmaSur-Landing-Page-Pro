# PharmaSur — Landing page (version statique)

Landing page de PharmaSur : géolocalisation des médicaments disponibles dans les pharmacies de
Côte d'Ivoire et authentification anti-contrefaçon par scan.

Aucune dépendance, aucune étape de build : ouvrir `index.html` suffit.

## Fichiers

```
index.html     structure et contenu
styles.css     design system (tokens verts), mises en page, animations
script.js      menu mobile, révélations au scroll, compteurs, recherche jouée, formulaire
assets/        photo d'officine du héros (WebP + repli JPEG, 2 définitions)
```

## Servir en local

Un double-clic sur `index.html` fonctionne. Pour un serveur local :

```bash
npx serve -l 4173 .
```

## Repères d'implémentation

- **Tokens** : toutes les couleurs et ombres sont des variables CSS dans `:root`.
- **Mouvement** : un seul easing pour tout le site, `--ease: cubic-bezier(.16, 1, .3, 1)`.
- **Accessibilité** : `prefers-reduced-motion` neutralise animations et transitions, et applique
  directement les états finaux.
- **Fond du héros** : `.hero__photo` est masquée vers le bas (`mask-image`) pour disparaître avant
  la section « Comment ça marche ». Le format est choisi via `image-set()` (WebP, repli JPEG) et
  la variante 1200 px est servie sous 1024 px.
- **Formulaire** : validation d'un numéro ivoirien côté client uniquement, aucun envoi réel.
  Brancher l'appel API dans le gestionnaire `submit` de `script.js`.

## À vérifier avant mise en ligne

- Licence de la photo d'officine (`assets/officine.*`).
- Chiffres du héros, tarifs et témoignages, repris de la version initiale.
