/*
 * Mesure le contraste réel des textes de public/og.jpg.
 *
 * On ne juge pas un voile à l'oeil : sur ce projet, un chapô qui paraissait
 * lisible sur la photo du héros mesurait 2,2:1. On reconstruit donc le fond
 * seul — photo plus voile, sans les textes — et on relève le pixel le plus
 * clair sous chaque bloc, cas le plus défavorable pour un texte clair.
 *
 *   node mesurer-og.mjs
 */
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import { H, L, PHOTO_POS, VOILE } from './og-commun.mjs'

const ICI = new URL('.', import.meta.url).pathname.slice(1)
const FONT = `${ICI}PlusJakartaSans.ttf`
const PHOTO = `${ICI}../public/hero-officine.jpg`

const voile = `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${H}">
  <defs>${VOILE}</defs>
  <rect width="${L}" height="${H}" fill="url(#voile)"/></svg>`

const png = new Resvg(voile, {
  fitTo: { mode: 'width', value: L },
  font: { fontFiles: [FONT], loadSystemFonts: false },
  background: 'rgba(0,0,0,0)',
})
  .render()
  .asPng()

const fond = await sharp(PHOTO).resize(L, H, PHOTO_POS).toBuffer()
const { data, info } = await sharp(fond)
  .composite([{ input: png, top: 0, left: 0 }])
  .raw()
  .toBuffer({ resolveWithObject: true })

const canal = (c) => {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
const lum = (r, g, b) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)
const contraste = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))

/* Boîtes déduites de la géométrie de generer-og.mjs : corps 64, interligne 74,
   première ligne de base à 227. */
const blocs = [
  { nom: 'Titre ligne 1 (blanc)', couleur: '#ffffff', x: 72, y: 181, w: 760, h: 60 },
  { nom: 'Titre ligne 2 (vert 400)', couleur: '#2fbc86', x: 72, y: 255, w: 760, h: 60 },
  { nom: 'Titre ligne 3 (vert 400)', couleur: '#2fbc86', x: 72, y: 329, w: 300, h: 60 },
  { nom: 'Sous-titre (vert 200)', couleur: '#b9e8d3', x: 72, y: 434, w: 710, h: 30 },
  { nom: 'Pastille (blanc)', couleur: '#ffffff', x: 72, y: 509, w: 330, h: 44 },
  { nom: 'Mot-symbole (blanc)', couleur: '#ffffff', x: 148, y: 76, w: 220, h: 42 },
]

console.log('Bloc                        seuil   pire fond   contraste')
console.log('-'.repeat(60))
let plancher = Infinity
for (const b of blocs) {
  const [tr, tg, tb] = hex(b.couleur)
  const lTexte = lum(tr, tg, tb)
  let pire = Infinity
  let pirePixel = null
  for (let y = b.y; y < b.y + b.h; y++) {
    for (let x = b.x; x < b.x + b.w; x++) {
      const i = (y * info.width + x) * info.channels
      const c = contraste(lTexte, lum(data[i], data[i + 1], data[i + 2]))
      if (c < pire) {
        pire = c
        pirePixel = [data[i], data[i + 1], data[i + 2]]
      }
    }
  }
  plancher = Math.min(plancher, pire)
  const seuil = b.h >= 40 ? 3 : 4.5
  const verdict = pire >= seuil ? 'OK' : 'INSUFFISANT'
  console.log(
    `${b.nom.padEnd(28)}${String(seuil).padEnd(8)}rgb(${pirePixel.join(',')})`.padEnd(52) +
      `${pire.toFixed(2)}:1  ${verdict}`,
  )
}
console.log('-'.repeat(60))
console.log(`plancher de la carte : ${plancher.toFixed(2)}:1`)
