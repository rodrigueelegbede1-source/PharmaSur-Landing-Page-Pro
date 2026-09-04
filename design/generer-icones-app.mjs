/*
 * Produit les icônes de l'application installable, dans public/app/.
 *
 * Deux familles, et la distinction compte : l'icône « any » est affichée
 * telle quelle, tandis qu'Android rogne l'icône « maskable » selon la forme
 * du lanceur — cercle, carré arrondi, goutte. Une icône maskable sans marge
 * intérieure se fait donc amputer ses bords. La zone sûre est le cercle
 * central de 80 % du côté ; la tuile est réduite en conséquence.
 *
 * Depuis design/ :
 *   npm install sharp @resvg/resvg-js
 *   node generer-icones-app.mjs
 */
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { rendre, V } from './og-commun.mjs'

const SORTIE = new URL('../public/app/', import.meta.url).pathname.slice(1)
mkdirSync(SORTIE, { recursive: true })

const repere = (cx, cy, taille, couleur) => {
  const s = taille / 16
  return `<g transform="translate(${cx - 12 * s} ${cy - 16.5 * s}) scale(${s})"
    fill="none" stroke="${couleur}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 25s-7-4.8-7-10a7 7 0 1 1 14 0c0 5.2-7 10-7 10Z"/>
    <path d="M12 12v6M9 15h6"/>
  </g>`
}

/** @param part fraction du côté occupée par la tuile (1 = bord à bord). */
const icone = (cote, part) => {
  const tuile = cote * part
  const x = (cote - tuile) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cote}" height="${cote}" viewBox="0 0 ${cote} ${cote}">
    <defs><linearGradient id="d" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${V.vert500}"/><stop offset="1" stop-color="${V.vert700}"/>
    </linearGradient></defs>
    <rect width="${cote}" height="${cote}" fill="${V.blanc}"/>
    <rect x="${x}" y="${x}" width="${tuile}" height="${tuile}" rx="${tuile * 0.28}" fill="url(#d)"/>
    ${repere(cote / 2, cote / 2, tuile * 0.47, V.blanc)}
  </svg>`
}

const fichiers = [
  ['icone-192.png', 192, 1],
  ['icone-512.png', 512, 1],
  /* 0,78 : la tuile tient dans le cercle sûr de 80 %, marge comprise. */
  ['icone-maskable-512.png', 512, 0.78],
]

for (const [nom, cote, part] of fichiers) {
  const info = await sharp(rendre(icone(cote, part), cote))
    .png({ compressionLevel: 9 })
    .toFile(`${SORTIE}${nom}`)
  console.log(`${nom.padEnd(26)} ${info.width}×${info.height}  ${Math.round(info.size / 1024)} ko`)
}
