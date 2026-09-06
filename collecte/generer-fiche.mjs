/*
 * Assemble collecte/fiche-de-collecte.html : la fiche de terrain en UN fichier,
 * qu'on envoie par WhatsApp à la personne qui fait la tournée.
 *
 *   node collecte/generer-fiche.mjs
 *
 * Pourquoi ce fichier existe alors que la fiche est déjà publiée en Artifact :
 * la tournée se fait à pied, dans des quartiers où la connexion tombe. Une page
 * hébergée ne s'ouvre pas sans réseau ; ce fichier-ci, si — police comprise,
 * sans aucune ressource externe, comme la console et l'application patient.
 *
 * La source est collecte/fiche.html, qui est aussi ce qui est publié en
 * Artifact. Elle est écrite sans doctype ni <head> parce que l'Artifact
 * fournit cette enveloppe ; ce script l'ajoute pour le fichier autonome. Une
 * seule source, deux sorties : elles ne peuvent pas diverger.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const SOURCE = join(RACINE, 'collecte/fiche.html')
const SORTIE = join(RACINE, 'collecte/fiche-de-collecte.html')
const POLICE = join(RACINE, 'public/fonts/plus-jakarta-sans.woff2')

const source = await readFile(SOURCE, 'utf8')
const police = await readFile(POLICE)

/*
 * Le lien Google Fonts saute : il ne servirait à rien hors ligne, et laisserait
 * le navigateur attendre un serveur injoignable avant de rendre le texte.
 * Plus Jakarta Sans est intégrée en données ; l'IBM Plex Mono des codes et des
 * coordonnées retombe sur la police à chasse fixe du système, déclarée dans
 * chaque pile.
 */
const LIEN = /<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>\n?/
if (!LIEN.test(source)) {
  console.error(
    "Le lien vers Google Fonts est introuvable dans collecte/fiche.html.\n" +
      "S'il a été retiré ou réécrit, ce script laisserait passer une ressource\n" +
      'externe dans un fichier censé fonctionner sans réseau.',
  )
  process.exit(1)
}

const corps = source.replace(LIEN, '')

const fichier = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0f7250">
<style>
@font-face {
  font-family:'Plus Jakarta Sans';
  src:url(data:font/woff2;base64,${police.toString('base64')}) format('woff2');
  font-weight:200 800;
  font-display:swap;
}
body { margin:0; }
</style>
${corps}
</body>
</html>
`

await writeFile(SORTIE, fichier, 'utf8')

const ko = Math.round(Buffer.byteLength(fichier) / 1024)
console.log(`fiche-de-collecte.html  ${ko} ko  (police intégrée, aucune ressource externe)`)
