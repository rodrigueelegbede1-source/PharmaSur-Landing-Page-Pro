/*
 * Ce que generer-og.mjs et mesurer-og.mjs doivent absolument partager.
 *
 * Le voile et la géométrie vivent ici parce qu'une mesure de contraste faite
 * sur un fond qui n'est plus celui du rendu ne mesure rien. Les dupliquer,
 * c'est se garantir qu'ils divergeront un jour sans que personne le voie.
 */

/* Jetons repris de src/index.css. */
export const V = {
  vert950: '#062a1d',
  vert900: '#0b3d2c',
  vert500: '#16a06f',
  vert400: '#2fbc86',
  vert200: '#b9e8d3',
  blanc: '#ffffff',
}

export const L = 1200
export const H = 630

export const PHOTO_POS = { fit: 'cover', position: 'attention' }

/*
 * Le palier à 0,90 court jusqu'à 72 % de la largeur parce que le titre
 * s'étend jusqu'à x = 832 (69 %). Avec l'ancienne chute dès 52 %, la
 * deuxième ligne en vert 400 tombait à 2,64:1 sur les zones claires de la
 * photo. Toute retouche de ce dégradé doit être suivie de mesurer-og.mjs.
 */
export const VOILE = `<linearGradient id="voile" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="${V.vert950}" stop-opacity="0.97"/>
  <stop offset="0.45" stop-color="${V.vert950}" stop-opacity="0.94"/>
  <stop offset="0.72" stop-color="${V.vert900}" stop-opacity="0.90"/>
  <stop offset="1" stop-color="${V.vert900}" stop-opacity="0.62"/>
</linearGradient>`

/* Zone de texte : la photo doit rester lisible sur sa droite. */
export const MARGE = 72
export const ZONE = 760
