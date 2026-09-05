/*
 * Regénère public/og.jpg : l'aperçu affiché quand le site est partagé sur
 * WhatsApp, Facebook, LinkedIn ou X.
 *
 * Ce fichier existe parce que le titre du héros est GRAVÉ dans l'image. Tant
 * qu'il l'est, changer le héros sans regénérer og.jpg fait mentir l'aperçu :
 * le visiteur lit une promesse dans le partage et en trouve une autre sur la
 * page. Les deux libellés sont donc tenus ensemble ici et dans index.html.
 *
 * Le voile, les textes et la mise en page vivent dans og-commun.mjs, partagés
 * avec mesurer-og.mjs — à lancer après toute retouche.
 *
 * Les dépendances ne sont pas dans package.json : elles ne servent qu'à
 * fabriquer un visuel et n'ont rien à faire dans le site livré. Depuis design/ :
 *   npm install sharp @resvg/resvg-js
 *   curl -sL -o PlusJakartaSans.ttf \
 *     "https://raw.githubusercontent.com/google/fonts/main/ofl/plusjakartasans/PlusJakartaSans%5Bwght%5D.ttf"
 *   node generer-og.mjs
 */
import sharp from 'sharp'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  disposer,
  FONT,
  gras,
  H,
  L,
  MARGE,
  PASTILLE,
  PHOTO,
  PHOTO_POS,
  rendre,
  SOUS_TITRE,
  TITRE,
  V,
  VOILE,
  ZONE,
} from './og-commun.mjs'

for (const [chemin, quoi] of [
  [FONT, 'Police absente'],
  [PHOTO, 'Photo du héros absente'],
]) {
  if (!existsSync(chemin)) {
    console.error(`${quoi} : ${chemin}\nVoir les instructions en tête de ce fichier.`)
    process.exit(1)
  }
}

const SORTIE = fileURLToPath(new URL('../public/og.jpg', import.meta.url))

const repere = (x, y, taille, couleur) => {
  const s = taille / 16
  return `<g transform="translate(${x - 12 * s} ${y - 16.5 * s}) scale(${s})"
    fill="none" stroke="${couleur}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 25s-7-4.8-7-10a7 7 0 1 1 14 0c0 5.2-7 10-7 10Z"/>
    <path d="M12 12v6M9 15h6"/>
  </g>`
}

const g = await disposer()

for (const b of g.boites) {
  console.log(
    `${b.nom.padEnd(16)} ${String(b.w).padStart(4)} px de large sur ${ZONE} disponibles`,
  )
}
if (g.deborde.length) {
  console.error(`\nDébordement hors de la zone de texte : ${g.deborde.map((b) => b.nom).join(', ')}`)
  process.exit(1)
}

const lignes = TITRE.map(
  (l, i) =>
    `<text x="${MARGE}" y="${g.yTitre + i * g.INTERLIGNE}" font-family="Plus Jakarta Sans"
      font-size="${g.CORPS}" letter-spacing="${-g.CORPS * 0.02}" fill="${l.couleur}"
      ${gras(g.CORPS, l.couleur)}>${l.texte}</text>`,
).join('')

const cxTuile = MARGE + g.coteTuile / 2

const calque = `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${H}" viewBox="0 0 ${L} ${H}">
  <defs>
    ${VOILE}
    <linearGradient id="tuile" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${V.vert500}"/><stop offset="1" stop-color="${V.vert400}"/>
    </linearGradient>
  </defs>

  <rect width="${L}" height="${H}" fill="url(#voile)"/>

  <rect x="${MARGE}" y="${g.yLogo - g.coteTuile / 2}" width="${g.coteTuile}" height="${g.coteTuile}"
    rx="${g.coteTuile * 0.28}" fill="url(#tuile)"/>
  ${repere(cxTuile, g.yLogo, g.coteTuile * 0.47, V.blanc)}
  <text x="${MARGE + g.coteTuile + 20}" y="${g.yLogo + g.corpsMot * 0.36}"
    font-family="Plus Jakarta Sans" font-size="${g.corpsMot}"
    letter-spacing="${-g.corpsMot * 0.02}" fill="${V.blanc}" ${gras(g.corpsMot, V.blanc)}
    >Pharma<tspan fill="${V.vert400}" ${gras(g.corpsMot, V.vert400)}>Sur</tspan></text>

  ${lignes}

  <text x="${MARGE}" y="${g.ySous}" font-family="Plus Jakarta Sans" font-size="${g.CORPS_SOUS}"
    fill="${V.vert200}">${SOUS_TITRE}</text>

  <rect x="${MARGE}" y="${g.yPastille}" width="${g.largeurPastille}" height="${g.hPastille}"
    rx="${g.hPastille / 2}" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.30)" stroke-width="1.5"/>
  <circle cx="${MARGE + 24}" cy="${g.yPastille + g.hPastille / 2}" r="5" fill="${V.vert400}"/>
  <text x="${MARGE + 42}" y="${g.yPastille + g.hPastille / 2 + 7}" font-family="Plus Jakarta Sans"
    font-size="${g.CORPS_PASTILLE}" fill="${V.blanc}">${PASTILLE}</text>
</svg>`

const fond = await sharp(PHOTO).resize(L, H, PHOTO_POS).toBuffer()

const info = await sharp(fond)
  .composite([{ input: rendre(calque, L), top: 0, left: 0 }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(SORTIE)

console.log(`\nog.jpg  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} ko`)
