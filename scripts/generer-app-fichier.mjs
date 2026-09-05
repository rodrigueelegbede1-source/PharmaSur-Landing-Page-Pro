/*
 * Assemble public/pharmasur-application.html : l'application patient en UN
 * fichier, que le visiteur télécharge et ouvre dans n'importe quel navigateur.
 *
 * Pourquoi ce fichier existe : l'APK ne sert qu'aux Android, et sur iPhone
 * rien ne s'installe depuis un site — Apple l'interdit. Un fichier unique, lui,
 * s'ouvre partout, s'envoie par WhatsApp et fonctionne sans réseau une fois
 * enregistré.
 *
 * Il consomme la sortie de vite.config.fichier.ts, qui produit un bundle
 * unique au format iife : le build principal émet des modules ES qui
 * s'importent entre eux, et ces imports échouent depuis file:// — le
 * navigateur les traite comme des requêtes inter-origines.
 *
 *   npx vite build --config vite.config.fichier.ts
 *   node scripts/generer-app-fichier.mjs
 *
 * Les deux sont enchaînés par le script « build » de package.json : regénérer
 * l'un sans l'autre livrerait une version périmée.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync, readdirSync } from 'node:fs'
import { isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = fileURLToPath(new URL('..', import.meta.url))
const BUILD = join(RACINE, 'dist-fichier')
const JS = join(BUILD, 'application.js')
const CSS = join(BUILD, 'style.css')
const POLICE = join(RACINE, 'public/fonts/plus-jakarta-sans.woff2')
const SORTIE = join(RACINE, 'public/pharmasur-application.html')

/*
 * Le message d'erreur disait « Lancez vite build d'abord » — conseil inutile
 * pendant un build de production, où cette commande vient de s'exécuter à la
 * ligne précédente du script « build ». Il a fait croire à une manipulation
 * oubliée alors que la vraie cause était ailleurs : un chemin racine calculé
 * de travers sur Linux, qui cherchait « vercel/path0/… » sans sa barre oblique
 * initiale. Le message montre donc maintenant ce qu'il a réellement trouvé.
 */
for (const [chemin, quoi] of [
  [JS, 'le bundle'],
  [CSS, 'la feuille de style'],
  [POLICE, 'la police'],
]) {
  if (existsSync(chemin)) continue

  const lignes = [`Introuvable — ${quoi} : ${chemin}`, '']
  if (!isAbsolute(chemin)) {
    lignes.push(
      'Ce chemin n\'est pas absolu : la racine du projet a été mal calculée.',
      'Utilisez fileURLToPath(new URL(...)) et non .pathname, qui laisse une',
      'barre oblique initiale sur Windows et la retire à tort ailleurs.',
    )
  } else if (chemin.startsWith(BUILD)) {
    lignes.push(
      existsSync(BUILD)
        ? `Le dossier ${BUILD} existe mais ne contient que : ${readdirSync(BUILD).join(', ') || '(rien)'}`
        : `Le dossier ${BUILD} n'existe pas : « vite build --config vite.config.fichier.ts » n'a rien produit.`,
    )
  } else {
    lignes.push('Ce fichier est versionné : vérifiez qu\'il n\'a pas été déplacé.')
  }
  console.error(lignes.join('\n'))
  process.exit(1)
}

const js = await readFile(JS, 'utf8')
let css = await readFile(CSS, 'utf8')
const police = await readFile(POLICE)

/* La police devient une donnée : sans cela le fichier s'afficherait dans la
   police système, et la charte typographique disparaîtrait hors ligne. */
const avant = css
css = css.replace(
  /url\((['"]?)\/fonts\/plus-jakarta-sans\.woff2\1\)/g,
  `url(data:font/woff2;base64,${police.toString('base64')})`,
)
if (css === avant) {
  console.error(
    "La police n'a pas été repliée : le chemin @font-face de src/index.css a changé.\n" +
      'Sans cela le fichier téléchargé perdrait sa typographie hors ligne.',
  )
  process.exit(1)
}

/* « </script> » dans une chaîne du bundle fermerait la balise avant l'heure. */
const echapper = (s) => s.replace(/<\/script>/gi, '<\\/script>')

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#ffffff">
<title>PharmaSur — Application patient (démonstration)</title>
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${echapper(js)}</script>
</body>
</html>
`

await writeFile(SORTIE, html, 'utf8')

const ko = Math.round(Buffer.byteLength(html) / 1024)

/*
 * La page annonce au visiteur « moins de 500 ko » : sur une connexion
 * ivoirienne facturée au volume, le poids d'un téléchargement se dit avant,
 * pas après. Le build échoue plutôt que de laisser cette phrase devenir fausse
 * sans que personne le remarque.
 *
 * Le plafond n'est pas théorique : la feuille de style pèse plus lourd sur le
 * serveur de build que sur cette machine — 111 ko contre 44 — parce que
 * Tailwind y balaie des fichiers générés en plus. C'est ce qui a motivé
 * d'annoncer une borne plutôt qu'un chiffre exact.
 */
const PLAFOND_KO = 500
if (ko > PLAFOND_KO) {
  console.error(
    `pharmasur-application.html pèse ${ko} ko, au-dessus des ${PLAFOND_KO} ko annoncés sur le site.\n` +
      "Allégez le fichier, ou corrigez la mention dans src/components/CtaPhone.tsx — mais ne laissez pas la page mentir sur le poids d'un téléchargement.",
  )
  process.exit(1)
}

console.log(
  `pharmasur-application.html  ${ko} ko sur ${PLAFOND_KO} annoncés  ` +
    '(un seul script, police intégrée, aucune ressource externe)',
)
