/*
 * Mesure le contraste du dégradé qui colore le titre du héros.
 *
 * Le dégradé va du vert 600 au vert 400 sur fond blanc. L'oeil ne voit qu'un
 * beau vert ; le rapport de contraste, lui, chute le long de la course. Ce
 * script le calcule aux deux extrémités et à quelques points intermédiaires,
 * et le compare au seuil de 3:1 exigé pour un grand texte.
 *
 *   node mesurer-titre.mjs [#debut] [#fin]
 */
const canal = (c) => {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
const lum = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)
const contraste = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const melange = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t))

const debut = process.argv[2] ?? '#12855d'
const fin = process.argv[3] ?? '#2fbc86'
const FOND = lum(hex('#ffffff'))
const SEUIL = 3 /* grand texte : >= 24 px normal ou >= 18,66 px gras */

console.log(`Dégradé ${debut} → ${fin} sur blanc, seuil ${SEUIL}:1\n`)
let pire = Infinity
for (const t of [0, 0.25, 0.5, 0.75, 1]) {
  const c = melange(hex(debut), hex(fin), t)
  const r = contraste(lum(c), FOND)
  pire = Math.min(pire, r)
  const teinte = '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('')
  console.log(
    `  ${String(Math.round(t * 100)).padStart(3)} %  ${teinte}  ${r.toFixed(2)}:1  ${r >= SEUIL ? 'OK' : 'INSUFFISANT'}`,
  )
}
console.log(`\nplancher : ${pire.toFixed(2)}:1 — ${pire >= SEUIL ? 'conforme' : 'NON CONFORME'}`)
