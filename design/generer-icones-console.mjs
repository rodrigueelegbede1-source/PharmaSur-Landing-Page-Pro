/*
 * Produit les icônes de la console installable, dans public/console/.
 *
 * Elles doivent se distinguer de celles de l'application patient AU PREMIER
 * COUP D'ŒIL : un pharmacien peut avoir les deux sur le même écran d'accueil,
 * et deux tuiles vertes portant un repère de carte seraient indiscernables à
 * la taille d'une icône. La console prend donc le fond sombre de la charte et
 * le tiroir du comptoir ; le patient garde le vert clair et le repère.
 *
 * Comme pour l'application, deux familles : « any » est affichée telle quelle,
 * « maskable » est rognée par Android selon la forme du lanceur — cercle,
 * carré arrondi, goutte. La zone sûre est le cercle central de 80 % du côté.
 *
 * Depuis design/ :  node generer-icones-console.mjs
 */
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { rendre, V } from './og-commun.mjs'
import { fileURLToPath } from 'node:url'

const SORTIE = fileURLToPath(new URL('../public/console/', import.meta.url))
mkdirSync(SORTIE, { recursive: true })

/* Le tiroir à médicaments : c'est ce que la console sert à tenir à jour. */
const tiroir = (cx, cy, taille, couleur) => {
  const s = taille / 24
  return `<g transform="translate(${cx - 12 * s} ${cy - 12 * s}) scale(${s})"
    fill="none" stroke="${couleur}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 8h18M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/>
    <path d="M10 14h4"/>
  </g>`
}

/** @param part fraction du côté occupée par la tuile (1 = bord à bord). */
const icone = (cote, part) => {
  const tuile = cote * part
  const x = (cote - tuile) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cote}" height="${cote}" viewBox="0 0 ${cote} ${cote}">
    <defs><linearGradient id="d" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${V.vert900}"/><stop offset="1" stop-color="${V.vert950}"/>
    </linearGradient></defs>
    <rect width="${cote}" height="${cote}" fill="${V.blanc}"/>
    <rect x="${x}" y="${x}" width="${tuile}" height="${tuile}" rx="${tuile * 0.28}" fill="url(#d)"/>
    ${tiroir(cote / 2, cote / 2, tuile * 0.5, V.vert400)}
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
