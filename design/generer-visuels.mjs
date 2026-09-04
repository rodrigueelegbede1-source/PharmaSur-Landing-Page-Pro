/*
 * Génère le logo décliné et les couvertures des réseaux sociaux.
 *
 * Ces deux dépendances ne sont pas dans package.json : elles ne servent qu'à
 * fabriquer des visuels, et n'ont rien à faire dans le site livré au visiteur.
 * Depuis design/ :
 *   npm install sharp @resvg/resvg-js
 *   curl -sL -o PlusJakartaSans.ttf \
 *     "https://raw.githubusercontent.com/google/fonts/main/ofl/plusjakartasans/PlusJakartaSans%5Bwght%5D.ttf"
 *   node generer-visuels.mjs
 */
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'

const ICI = new URL('.', import.meta.url).pathname.slice(1)
const PROJECT = `${ICI}..`
const FONT = `${ICI}PlusJakartaSans.ttf`

if (!existsSync(FONT)) {
  console.error(`Police absente : ${FONT}\nVoir les instructions en tête de ce fichier.`)
  process.exit(1)
}

const V = {
  vert500: '#16a06f',
  vert700: '#10714f',
  vert400: '#2fbc86',
  vert200: '#a8e6c9',
  vert900: '#0b3d2c',
  encre: '#0e1b16',
  blanc: '#ffffff',
}

/* La police est variable : resvg n'expose que l'instance par défaut. Un contour
   de la même couleur épaissit le trait et restitue l'extra-bold de la charte.
   5,5 % du corps : mesuré comme l'équivalent du 800 ; au-delà, les contreformes
   du « a » et du « e » se referment. */
const GRAS = 0.055
const gras = (corps, couleur) =>
  `paint-order="stroke" stroke="${couleur}" stroke-width="${(corps * GRAS).toFixed(2)}" stroke-linejoin="round"`

/** Pictogramme du repère, tracé dans un repère 24×24. */
const repere = (x, y, taille, couleur) => {
  const s = taille / 16 // 16 = largeur locale du pictogramme, contour compris
  return `<g transform="translate(${x - 12 * s} ${y - 16.5 * s}) scale(${s})"
    fill="none" stroke="${couleur}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 25s-7-4.8-7-10a7 7 0 1 1 14 0c0 5.2-7 10-7 10Z"/>
    <path d="M12 12v6M9 15h6"/>
  </g>`
}

/** Carré arrondi contenant le repère : la « tuile » du logo. */
const tuile = (cx, cy, cote, { fond, trait }) => {
  const r = cote / 2
  return `<g>
    <rect x="${cx - r}" y="${cy - r}" width="${cote}" height="${cote}" rx="${cote * 0.28}" fill="${fond}"/>
    ${repere(cx, cy, cote * 0.47, trait)}
  </g>`
}

const rendre = (svg, largeur) =>
  new Resvg(svg, {
    fitTo: { mode: 'width', value: largeur },
    font: { fontFiles: [FONT], loadSystemFonts: false, defaultFontFamily: 'Plus Jakarta Sans' },
  })
    .render()
    .asPng()

const ko = (n) => `${Math.round(n / 1024)} ko`

/*
 * Largeur réelle du mot-symbole, mesurée une fois sur un rendu : l'estimer au
 * jugé décalait le verrou, et le contour de simulation du gras élargit encore
 * les glyphes. Le rapport largeur/corps sert ensuite à toutes les tailles.
 */
async function mesurerRatioMot() {
  const corps = 200
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="400">
    <text x="40" y="280" font-family="Plus Jakarta Sans" font-size="${corps}"
          letter-spacing="${-corps * 0.02}" fill="#000" ${gras(corps, '#000')}>PharmaSur</text></svg>`
  const png = rendre(svg, 2400)
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true })
  let minX = 1e9
  let maxX = -1
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * info.channels + 3] > 40) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
      }
    }
  return (maxX - minX + 1) / corps
}

/** Même mesure pour le slogan, en graisse normale. */
async function mesurerRatioSlogan(texte) {
  const corps = 100
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="3000" height="240">
    <text x="20" y="150" font-family="Plus Jakarta Sans" font-size="${corps}" fill="#000">${texte}</text></svg>`
  const { data, info } = await sharp(rendre(svg, 3000)).raw().toBuffer({ resolveWithObject: true })
  let minX = 1e9
  let maxX = -1
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * info.channels + 3] > 40) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
      }
    }
  return (maxX - minX + 1) / corps
}

const SLOGAN = 'Trouvez vos médicaments. Vérifiez leur authenticité.'
const RATIO_MOT = await mesurerRatioMot()
const RATIO_SLOGAN = await mesurerRatioSlogan(SLOGAN)

/* Largeur du verrou exprimée en multiples du côté de la tuile. */
const K_VERROU = 1.36 + 0.72 * RATIO_MOT

console.log(`mot-symbole : ${RATIO_MOT.toFixed(3)} × le corps`)
console.log(`slogan      : ${RATIO_SLOGAN.toFixed(3)} × le corps`)
console.log(`verrou      : ${K_VERROU.toFixed(3)} × le côté de la tuile\n`)

/* ------------------------------------------------------------------ */
/* 1. Logo horizontal : tuile + mot-symbole                            */
/* ------------------------------------------------------------------ */

function logoHorizontal({ surSombre }) {
  const H = 240
  const cote = 168
  const cx = 20 + cote / 2
  const cy = H / 2
  const xTexte = 20 + cote + 44
  const taille = 118
  const couleurPharma = surSombre ? V.blanc : V.encre
  const couleurSur = surSombre ? V.vert400 : '#12855d'
  const fondTuile = surSombre ? V.blanc : `url(#deg)`
  const traitTuile = surSombre ? V.vert500 : V.blanc

  const largeurTexte = RATIO_MOT * taille
  const W = Math.round(xTexte + largeurTexte + 24)

  return {
    W,
    H,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <defs><linearGradient id="deg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${V.vert500}"/><stop offset="1" stop-color="${V.vert700}"/>
      </linearGradient></defs>
      ${tuile(cx, cy, cote, { fond: fondTuile, trait: traitTuile })}
      <text x="${xTexte}" y="${cy + taille * 0.36}" font-family="Plus Jakarta Sans"
            font-size="${taille}" letter-spacing="${(-taille*0.02).toFixed(1)}" fill="${couleurPharma}" ${gras(taille, couleurPharma)}>Pharma<tspan
            fill="${couleurSur}" stroke="${couleurSur}">Sur</tspan></text>
    </svg>`,
  }
}

/* ------------------------------------------------------------------ */
/* 2. Couvertures réseaux sociaux                                      */
/* ------------------------------------------------------------------ */

/** Générateur pseudo-aléatoire déterministe : mêmes visuels à chaque exécution. */
const alea = (graine) => () => {
  graine = (graine * 1103515245 + 12345) % 2147483648
  return graine / 2147483648
}

/** Gélules dispersées, en évitant la zone centrale réservée au verrou. */
function gelules(W, H, sur) {
  const u = Math.min(W, H)
  const r = alea(Math.round(W * 7 + H))
  const formes = []
  const teintes = [
    { f: V.blanc, o: 0.16 },
    { f: V.blanc, o: 0.1 },
    { f: V.vert200, o: 0.3 },
    { f: V.vert400, o: 0.35 },
  ]
  let essais = 0
  while (formes.length < 16 && essais < 400) {
    essais++
    const long = u * (0.1 + r() * 0.22)
    const epais = long * (0.3 + r() * 0.12)
    const x = r() * W
    const y = r() * H
    // rejet si la gélule mord la zone protégée
    if (
      x + long / 2 > sur.x0 - u * 0.04 &&
      x - long / 2 < sur.x1 + u * 0.04 &&
      y + epais > sur.y0 - u * 0.04 &&
      y - epais < sur.y1 + u * 0.04
    )
      continue
    const t = teintes[Math.floor(r() * teintes.length)]
    const angle = Math.round(-60 + r() * 120)
    formes.push(`<g transform="rotate(${angle} ${x.toFixed(0)} ${y.toFixed(0)})">
      <rect x="${(x - long / 2).toFixed(0)}" y="${(y - epais / 2).toFixed(0)}"
            width="${long.toFixed(0)}" height="${epais.toFixed(0)}" rx="${(epais / 2).toFixed(0)}"
            fill="${t.f}" fill-opacity="${t.o}"/>
      <rect x="${(x - long / 2).toFixed(0)}" y="${(y - epais / 2).toFixed(0)}"
            width="${(long / 2).toFixed(0)}" height="${epais.toFixed(0)}" rx="${(epais / 2).toFixed(0)}"
            fill="${t.f}" fill-opacity="${(t.o * 0.55).toFixed(2)}"/>
    </g>`)
  }
  return formes.join('\n')
}

function couverture(W, H, { sansSlogan = false, zoneSure } = {}) {
  // Zone réellement visible : YouTube rogne fortement, d'où le paramètre.
  const zone = zoneSure ?? { w: W, h: H }
  const ultraLarge = zone.h / zone.w < 0.22

  /*
   * Le verrou se dimensionne sur la LARGEUR de la zone visible, jamais sur son
   * petit côté : sur un carré comme sur la bande étroite de YouTube, partir du
   * petit côté donne soit un verrou qui déborde, soit un verrou minuscule.
   * La hauteur ne sert qu'à plafonner.
   */
  const cote = Math.min(
    (zone.w * 0.66) / K_VERROU,
    zone.h * (ultraLarge ? 0.55 : 0.45),
  )
  const taille = cote * 0.72
  const largeurMot = RATIO_MOT * taille
  const ecart = cote * 0.36
  const largeurVerrou = cote + ecart + largeurMot

  const slogan = SLOGAN
  const montrerSlogan = !sansSlogan && !ultraLarge
  // Le corps du slogan est plafonné par sa propre largeur mesurée.
  const tailleSlogan = Math.min(taille * 0.4, (zone.w * 0.78) / RATIO_SLOGAN)

  const cx = W / 2
  const cyVerrou = montrerSlogan ? H / 2 - cote * 0.42 : H / 2
  const xTuile = cx - largeurVerrou / 2 + cote / 2
  const xMot = cx - largeurVerrou / 2 + cote + ecart

  const largeurSlogan = RATIO_SLOGAN * tailleSlogan
  const ySlogan = cyVerrou + cote * 0.62 + tailleSlogan

  const sur = {
    x0: cx - Math.max(largeurVerrou, montrerSlogan ? largeurSlogan : 0) / 2,
    x1: cx + Math.max(largeurVerrou, montrerSlogan ? largeurSlogan : 0) / 2,
    y0: cyVerrou - cote * 0.7,
    y1: montrerSlogan ? ySlogan + tailleSlogan * 0.4 : cyVerrou + cote * 0.7,
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="fond" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#18a874"/>
        <stop offset="0.55" stop-color="#12855d"/>
        <stop offset="1" stop-color="#0c6144"/>
      </linearGradient>
      <radialGradient id="lueur" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#5fe0aa" stop-opacity="0.55"/>
        <stop offset="1" stop-color="#5fe0aa" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <rect width="${W}" height="${H}" fill="url(#fond)"/>
    <ellipse cx="${W * 0.5}" cy="${H * 0.42}" rx="${W * 0.45}" ry="${H * 0.55}" fill="url(#lueur)"/>
    ${gelules(W, H, sur)}

    ${tuile(xTuile, cyVerrou, cote, { fond: V.blanc, trait: V.vert500 })}
    <text x="${xMot}" y="${cyVerrou + taille * 0.36}" font-family="Plus Jakarta Sans"
          font-size="${taille}" letter-spacing="${(-taille * 0.024).toFixed(1)}"
          fill="${V.blanc}" ${gras(taille, V.blanc)}>Pharma<tspan
          fill="${V.vert400}" stroke="${V.vert400}">Sur</tspan></text>

    ${
      montrerSlogan
        ? `<text x="${cx}" y="${ySlogan}" text-anchor="middle" font-family="Plus Jakarta Sans"
             font-size="${tailleSlogan}" fill="#d9f2e7" fill-opacity="0.95">${slogan}</text>`
        : ''
    }
  </svg>`
}

/* ------------------------------------------------------------------ */

const dossierLogo = `${PROJECT}/design/logo`
const dossierReseaux = `${PROJECT}/design/reseaux-sociaux`
mkdirSync(dossierLogo, { recursive: true })
mkdirSync(dossierReseaux, { recursive: true })

console.log('— Logo —')
for (const [nom, sombre] of [
  ['pharmasur-logo-fond-clair', false],
  ['pharmasur-logo-fond-sombre', true],
]) {
  const { svg, W, H } = logoHorizontal({ surSombre: sombre })
  writeFileSync(`${dossierLogo}/${nom}.svg`, svg)
  const png = rendre(svg, 2400)
  const info = await sharp(png).png({ compressionLevel: 9 }).toFile(`${dossierLogo}/${nom}.png`)
  console.log(`${nom}  ${info.width}×${info.height}  ${ko(info.size)}`)
}

for (const taille of [512, 1024]) {
  const svgMarque = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <defs><linearGradient id="d" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${V.vert500}"/><stop offset="1" stop-color="${V.vert700}"/>
    </linearGradient></defs>
    ${tuile(256, 256, 512, { fond: 'url(#d)', trait: V.blanc })}</svg>`
  const info = await sharp(rendre(svgMarque, taille))
    .png({ compressionLevel: 9 })
    .toFile(`${dossierLogo}/pharmasur-marque-${taille}.png`)
  console.log(`pharmasur-marque-${taille}  ${info.width}×${info.height}  ${ko(info.size)}`)
}

console.log('\n— Couvertures —')
const formats = [
  ['facebook-couverture', 1640, 856, {}],
  ['x-banniere', 1500, 500, {}],
  ['linkedin-couverture', 1128, 191, {}],
  ['youtube-banniere', 2560, 1440, { zoneSure: { w: 1546, h: 423 } }],
  ['instagram-carre', 1080, 1080, {}],
  ['story-verticale', 1080, 1920, {}],
]

for (const [nom, W, H, opts] of formats) {
  const svg = couverture(W, H, opts)
  const info = await sharp(rendre(svg, W)).jpeg({ quality: 92, mozjpeg: true }).toFile(`${dossierReseaux}/${nom}.jpg`)
  console.log(`${nom}  ${info.width}×${info.height}  ${ko(info.size)}`)
}
