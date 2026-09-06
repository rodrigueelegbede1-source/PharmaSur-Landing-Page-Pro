/*
 * Tout ce que generer-og.mjs et mesurer-og.mjs partagent : le voile, les
 * textes, la mesure d'encre et la mise en page qui en découle.
 *
 * Tout est ici parce que les deux scripts avaient chacun leur copie, et que
 * les copies ont divergé : le sous-titre a grandi jusqu'à 825 px pour une
 * zone de 760, hors de la boîte que la mesure croyait couvrir. Une mesure
 * faite sur une géométrie qui n'est plus celle du rendu ne mesure rien.
 */
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

export const L = 1200
export const H = 630

/* Jetons repris de src/index.css. */
export const V = {
  vert950: '#062a1d',
  vert900: '#0b3d2c',
  vert500: '#16a06f',
  vert400: '#2fbc86',
  vert200: '#b9e8d3',
  blanc: '#ffffff',
}

/*
 * La carte de partage n'a plus de photographie sous son voile.
 *
 * Elle reposait sur hero-officine.jpg, dont les droits n'étaient pas établis
 * — c'était l'une des deux dernières mentions manquantes — et qui mettait en
 * scène des personnes inexistantes. Le fond est désormais dessiné : la croix
 * de pharmacie à l'échelle d'une enseigne et les cercles de recherche, le
 * même motif que le héros du site. Le lien partagé sur WhatsApp montre donc
 * ce que montre la page qu'il ouvre.
 *
 * Le voile est conservé tel quel : c'est lui qui garantit le contraste du
 * titre, mesuré par mesurer-og.mjs, et le changer relancerait ce calcul.
 */
export const FOND = (L, H) => `
  <rect width="${L}" height="${H}" fill="${V.vert900}"/>
  <g fill="${V.vert500}" opacity="0.30">
    <rect x="${L * 0.72 - H * 0.12}" y="${H * 0.06}" width="${H * 0.24}" height="${H * 0.88}" rx="${H * 0.03}"/>
    <rect x="${L * 0.72 - H * 0.44}" y="${H * 0.38}" width="${H * 0.88}" height="${H * 0.24}" rx="${H * 0.03}"/>
  </g>
  <g fill="none" stroke="${V.vert400}" stroke-width="2" stroke-dasharray="4 12" opacity="0.45">
    <circle cx="${L * 0.72}" cy="${H * 0.5}" r="${H * 0.22}"/>
    <circle cx="${L * 0.72}" cy="${H * 0.5}" r="${H * 0.36}"/>
    <circle cx="${L * 0.72}" cy="${H * 0.5}" r="${H * 0.5}"/>
  </g>`

export const FONT = fileURLToPath(new URL('./PlusJakartaSans.ttf', import.meta.url))

/* Zone de texte : le motif doit rester lisible sur sa droite. */
export const MARGE = 72
export const ZONE = 760

/*
 * Le palier sombre court jusqu'à 72 % de la largeur parce que les textes
 * s'arrêtent à x = 832 (69 %). Avec une chute plus tôt, la deuxième ligne du
 * titre, en vert 400, tombait à 2,64:1 sur les zones claires de la photo.
 * Toute retouche de ce dégradé doit être suivie de mesurer-og.mjs.
 */
export const VOILE = `<linearGradient id="voile" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="${V.vert950}" stop-opacity="0.97"/>
  <stop offset="0.45" stop-color="${V.vert950}" stop-opacity="0.94"/>
  <stop offset="0.72" stop-color="${V.vert900}" stop-opacity="0.90"/>
  <stop offset="1" stop-color="${V.vert900}" stop-opacity="0.62"/>
</linearGradient>`

/*
 * Le titre de la carte est celui du héros de la page, mot pour mot, découpé
 * comme dans src/components/Hero.tsx. Le sous-titre annonçait autrefois un
 * scan anti-contrefaçon : retiré avec la fonctionnalité, faute de base de
 * codes authentiques.
 */
export const TITRE = [
  { texte: 'Trouvez vos médicaments', couleur: V.blanc },
  { texte: 'et les pharmacies proches', couleur: V.vert400 },
  { texte: 'en un clic.', couleur: V.vert400 },
]
export const SOUS_TITRE = "Le coût de l'ordonnance avant de sortir · Stocks confirmés"
export const PASTILLE = "Disponible en Côte d'Ivoire"

/* La police est variable et resvg n'expose que son instance par défaut. Un
   contour de la même couleur épaissit le trait et restitue l'extra-bold de la
   charte. 5,5 % du corps : mesuré comme l'équivalent du 800. */
const GRAS = 0.055
export const gras = (corps, couleur) =>
  `paint-order="stroke" stroke="${couleur}" stroke-width="${(corps * GRAS).toFixed(2)}" stroke-linejoin="round"`

export const rendre = (svg, largeur) =>
  new Resvg(svg, {
    fitTo: { mode: 'width', value: largeur },
    font: { fontFiles: [FONT], loadSystemFonts: false, defaultFontFamily: 'Plus Jakarta Sans' },
    background: 'rgba(0,0,0,0)',
  })
    .render()
    .asPng()

/*
 * Largeur réelle de l'encre, mesurée sur un rendu plutôt qu'estimée : sur ce
 * projet, une estimation au jugé s'est révélée fausse de 9 %, ce qui suffit à
 * faire déborder une ligne hors de la zone de texte.
 */
export async function ratioLargeur(texte, { extraGras }) {
  const corps = 120
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="4000" height="300">
    <text x="30" y="200" font-family="Plus Jakarta Sans" font-size="${corps}"
      letter-spacing="${-corps * 0.02}" fill="#000"
      ${extraGras ? gras(corps, '#000') : ''}>${texte}</text></svg>`
  const { data, info } = await sharp(rendre(svg, 4000)).raw().toBuffer({ resolveWithObject: true })
  let minX = 1e9
  let maxX = -1
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * info.channels + 3] > 40) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
      }
    }
  }
  return (maxX - minX + 1) / corps
}

/**
 * Mise en page complète, déduite de la largeur d'encre réelle de chaque texte.
 * Aucun corps n'est fixé à la main : chacun est plafonné pour que sa ligne
 * tienne dans la zone, seul moyen d'empêcher un libellé plus long de déborder
 * silencieusement sur la partie claire de la photo.
 */
export async function disposer() {
  const rTitre = await Promise.all(TITRE.map((l) => ratioLargeur(l.texte, { extraGras: true })))
  const rSous = await ratioLargeur(SOUS_TITRE, { extraGras: false })
  const rPastille = await ratioLargeur(PASTILLE, { extraGras: false })

  const CORPS = Math.min(66, Math.floor(ZONE / Math.max(...rTitre)))
  const INTERLIGNE = Math.round(CORPS * 1.16)
  const CORPS_SOUS = Math.min(25, Math.floor(ZONE / rSous))
  const CORPS_PASTILLE = 19

  const hTitre = INTERLIGNE * TITRE.length
  const yTitre = Math.round((H - hTitre) / 2) + CORPS * 0.36
  const ySous = Math.round(yTitre + hTitre - INTERLIGNE + CORPS * 0.28 + 62)
  const yPastille = ySous + 54
  const hPastille = 44
  const largeurPastille = Math.round(rPastille * CORPS_PASTILLE) + 68

  const yLogo = 96
  const coteTuile = 56
  const corpsMot = 40

  /* Boîtes d'encre, servant telles quelles au relevé de contraste. */
  const boites = [
    ...TITRE.map((l, i) => ({
      nom: `Titre ligne ${i + 1}`,
      couleur: l.couleur,
      x: MARGE,
      y: Math.round(yTitre + i * INTERLIGNE - CORPS * 0.78),
      w: Math.ceil(rTitre[i] * CORPS),
      h: Math.round(CORPS * 1.02),
    })),
    {
      nom: 'Sous-titre',
      couleur: V.vert200,
      x: MARGE,
      y: Math.round(ySous - CORPS_SOUS * 0.78),
      w: Math.ceil(rSous * CORPS_SOUS),
      h: Math.round(CORPS_SOUS * 1.02),
    },
    {
      nom: 'Pastille',
      couleur: V.blanc,
      x: MARGE,
      y: yPastille,
      w: largeurPastille,
      h: hPastille,
    },
    {
      nom: 'Mot-symbole',
      couleur: V.blanc,
      x: MARGE + coteTuile + 20,
      y: yLogo - Math.round(corpsMot * 0.78),
      w: Math.ceil((await ratioLargeur('PharmaSur', { extraGras: true })) * corpsMot),
      h: Math.round(corpsMot * 1.02),
    },
  ]

  const deborde = boites.filter((b) => b.x + b.w > MARGE + ZONE)

  return {
    CORPS,
    INTERLIGNE,
    CORPS_SOUS,
    CORPS_PASTILLE,
    yTitre,
    ySous,
    yPastille,
    hPastille,
    largeurPastille,
    yLogo,
    coteTuile,
    corpsMot,
    boites,
    deborde,
  }
}
