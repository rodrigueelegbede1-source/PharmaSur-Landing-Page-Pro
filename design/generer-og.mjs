/*
 * Regénère public/og.jpg : l'aperçu affiché quand le site est partagé sur
 * WhatsApp, Facebook, LinkedIn ou X.
 *
 * Ce fichier existe parce que le titre du héros est GRAVÉ dans l'image. Tant
 * qu'il l'est, changer le héros sans regénérer og.jpg fait mentir l'aperçu :
 * le visiteur lit une promesse dans le partage et en trouve une autre sur la
 * page. Les deux libellés sont donc tenus ensemble ici et dans index.html.
 *
 * Les dépendances ne sont pas dans package.json : elles ne servent qu'à
 * fabriquer un visuel et n'ont rien à faire dans le site livré. Depuis design/ :
 *   npm install sharp @resvg/resvg-js
 *   curl -sL -o PlusJakartaSans.ttf \
 *     "https://raw.githubusercontent.com/google/fonts/main/ofl/plusjakartasans/PlusJakartaSans%5Bwght%5D.ttf"
 *   node generer-og.mjs
 */
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import { existsSync } from 'node:fs'
import { H, L, MARGE, PHOTO_POS, V, VOILE, ZONE } from './og-commun.mjs'

const ICI = new URL('.', import.meta.url).pathname.slice(1)
const PROJET = `${ICI}..`
const FONT = `${ICI}PlusJakartaSans.ttf`
const PHOTO = `${PROJET}/public/hero-officine.jpg`
const SORTIE = `${PROJET}/public/og.jpg`

for (const [chemin, quoi] of [
  [FONT, 'Police absente'],
  [PHOTO, 'Photo du héros absente'],
]) {
  if (!existsSync(chemin)) {
    console.error(`${quoi} : ${chemin}\nVoir les instructions en tête de ce fichier.`)
    process.exit(1)
  }
}

/* Le titre de la carte est celui du héros, mot pour mot. Le découpage suit
   celui de src/components/Hero.tsx pour que le partage et la page se lisent
   de la même façon. */
const TITRE = [
  { texte: 'Trouvez vos médicaments', couleur: V.blanc },
  { texte: 'et les pharmacies proches', couleur: V.vert400 },
  { texte: 'en un clic.', couleur: V.vert400 },
]
const SOUS_TITRE = "Le coût de l'ordonnance avant de sortir · Scan anti-contrefaçon"
const PASTILLE = "Disponible en Côte d'Ivoire"

/* La police est variable et resvg n'expose que son instance par défaut. Un
   contour de la même couleur épaissit le trait et restitue l'extra-bold de la
   charte. 5,5 % du corps : mesuré comme l'équivalent du 800. */
const GRAS = 0.055
const gras = (corps, couleur) =>
  `paint-order="stroke" stroke="${couleur}" stroke-width="${(corps * GRAS).toFixed(2)}" stroke-linejoin="round"`

const repere = (x, y, taille, couleur) => {
  const s = taille / 16
  return `<g transform="translate(${x - 12 * s} ${y - 16.5 * s}) scale(${s})"
    fill="none" stroke="${couleur}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 25s-7-4.8-7-10a7 7 0 1 1 14 0c0 5.2-7 10-7 10Z"/>
    <path d="M12 12v6M9 15h6"/>
  </g>`
}

const rendre = (svg, largeur) =>
  new Resvg(svg, {
    fitTo: { mode: 'width', value: largeur },
    font: { fontFiles: [FONT], loadSystemFonts: false, defaultFontFamily: 'Plus Jakarta Sans' },
    background: 'rgba(0,0,0,0)',
  })
    .render()
    .asPng()

/*
 * Largeur réelle de l'encre, mesurée sur un rendu plutôt qu'estimée : sur ce
 * même projet, une estimation au jugé s'était révélée fausse de 9 %, ce qui
 * suffit à faire déborder une ligne hors de la zone de texte.
 */
async function ratioLargeur(texte, { extraGras }) {
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

const ratios = await Promise.all(TITRE.map((l) => ratioLargeur(l.texte, { extraGras: true })))
const ratioMax = Math.max(...ratios)
const CORPS = Math.min(66, Math.floor(ZONE / ratioMax))
const INTERLIGNE = Math.round(CORPS * 1.16)

const ratioMot = await ratioLargeur('PharmaSur', { extraGras: true })
const ratioSous = await ratioLargeur(SOUS_TITRE, { extraGras: false })
const ratioPastille = await ratioLargeur(PASTILLE, { extraGras: false })

console.log(`corps du titre : ${CORPS} px (la ligne la plus large occupe ${Math.round(ratioMax * CORPS)} px sur ${ZONE})`)
console.log(`sous-titre     : ${Math.round(ratioSous * 25)} px de large`)

/* Composition verticale, calée sur la hauteur réelle du bloc de titre. */
const CORPS_SOUS = 25
const hTitre = INTERLIGNE * TITRE.length
const yLogo = 96
const yTitre = Math.round((H - hTitre) / 2) + CORPS * 0.36
const ySous = yTitre + hTitre - INTERLIGNE + CORPS * 0.28 + 62
const yPastille = ySous + 54

const lignes = TITRE.map(
  (l, i) =>
    `<text x="${MARGE}" y="${yTitre + i * INTERLIGNE}" font-family="Plus Jakarta Sans"
      font-size="${CORPS}" letter-spacing="${-CORPS * 0.02}" fill="${l.couleur}"
      ${gras(CORPS, l.couleur)}>${l.texte}</text>`,
).join('')

const coteTuile = 56
const cxTuile = MARGE + coteTuile / 2
const corpsMot = 40
const xMot = MARGE + coteTuile + 20

const largeurPastille = Math.round(ratioPastille * 19) + 30 + 24 + 14
const hPastille = 44

const calque = `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${H}" viewBox="0 0 ${L} ${H}">
  <defs>
    ${VOILE}
    <linearGradient id="tuile" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${V.vert500}"/><stop offset="1" stop-color="${V.vert400}"/>
    </linearGradient>
  </defs>

  <rect width="${L}" height="${H}" fill="url(#voile)"/>

  <rect x="${MARGE}" y="${yLogo - coteTuile / 2}" width="${coteTuile}" height="${coteTuile}"
    rx="${coteTuile * 0.28}" fill="url(#tuile)"/>
  ${repere(cxTuile, yLogo, coteTuile * 0.47, V.blanc)}
  <text x="${xMot}" y="${yLogo + corpsMot * 0.36}" font-family="Plus Jakarta Sans"
    font-size="${corpsMot}" letter-spacing="${-corpsMot * 0.02}" fill="${V.blanc}"
    ${gras(corpsMot, V.blanc)}>Pharma<tspan fill="${V.vert400}" ${gras(corpsMot, V.vert400)}>Sur</tspan></text>

  ${lignes}

  <text x="${MARGE}" y="${ySous}" font-family="Plus Jakarta Sans" font-size="${CORPS_SOUS}"
    fill="${V.vert200}">${SOUS_TITRE}</text>

  <rect x="${MARGE}" y="${yPastille}" width="${largeurPastille}" height="${hPastille}"
    rx="${hPastille / 2}" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.30)" stroke-width="1.5"/>
  <circle cx="${MARGE + 24}" cy="${yPastille + hPastille / 2}" r="5" fill="${V.vert400}"/>
  <text x="${MARGE + 42}" y="${yPastille + hPastille / 2 + 7}" font-family="Plus Jakarta Sans"
    font-size="19" fill="${V.blanc}">${PASTILLE}</text>
</svg>`

const fond = await sharp(PHOTO).resize(L, H, PHOTO_POS).toBuffer()

const info = await sharp(fond)
  .composite([{ input: rendre(calque, L), top: 0, left: 0 }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(SORTIE)

console.log(`\nog.jpg  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} ko`)
