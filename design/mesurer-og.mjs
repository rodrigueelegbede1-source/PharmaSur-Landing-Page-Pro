/*
 * Mesure le contraste réel des textes de public/og.jpg.
 *
 * On ne juge pas un voile à l'oeil : sur ce projet, un chapô qui paraissait
 * lisible sur la photo du héros mesurait 2,2:1. On reconstruit donc le fond
 * seul — photo plus voile, sans les textes — et on relève le pixel le plus
 * clair sous chaque bloc, cas le plus défavorable pour un texte clair.
 *
 * Les boîtes viennent de la même mise en page que le rendu (og-commun.mjs) :
 * les recopier ici les avait déjà fait diverger une fois, et une boîte qui ne
 * couvre plus son texte donne un verdict rassurant sur rien.
 *
 *   node mesurer-og.mjs
 */
import sharp from 'sharp'
import { disposer, H, L, PHOTO, PHOTO_POS, rendre, VOILE } from './og-commun.mjs'

const voile = `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${H}">
  <defs>${VOILE}</defs>
  <rect width="${L}" height="${H}" fill="url(#voile)"/></svg>`

const fond = await sharp(PHOTO).resize(L, H, PHOTO_POS).toBuffer()
const { data, info } = await sharp(fond)
  .composite([{ input: rendre(voile, L), top: 0, left: 0 }])
  .raw()
  .toBuffer({ resolveWithObject: true })

const canal = (c) => {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
const lum = (r, g, b) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)
const contraste = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))

const { boites } = await disposer()

console.log('Bloc              seuil   pire fond          contraste')
console.log('-'.repeat(58))
let plancher = Infinity
for (const b of boites) {
  const [tr, tg, tb] = hex(b.couleur)
  const lTexte = lum(tr, tg, tb)
  let pire = Infinity
  let pirePixel = null
  for (let y = Math.max(0, b.y); y < Math.min(H, b.y + b.h); y++) {
    for (let x = Math.max(0, b.x); x < Math.min(L, b.x + b.w); x++) {
      const i = (y * info.width + x) * info.channels
      const c = contraste(lTexte, lum(data[i], data[i + 1], data[i + 2]))
      if (c < pire) {
        pire = c
        pirePixel = [data[i], data[i + 1], data[i + 2]]
      }
    }
  }
  plancher = Math.min(plancher, pire)
  /* 3:1 pour un grand texte (>= 24 px gras), 4,5:1 sinon. */
  const seuil = b.h >= 30 ? 3 : 4.5
  console.log(
    b.nom.padEnd(18) +
      String(seuil).padEnd(8) +
      `rgb(${pirePixel.join(',')})`.padEnd(19) +
      `${pire.toFixed(2)}:1  ${pire >= seuil ? 'OK' : 'INSUFFISANT'}`,
  )
}
console.log('-'.repeat(58))
console.log(`plancher de la carte : ${plancher.toFixed(2)}:1`)
