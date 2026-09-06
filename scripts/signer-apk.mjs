/*
 * Aligne et signe l'APK produit par Gradle, puis vérifie la signature.
 *
 * Ce script existe parce que « bubblewrap build » échoue sur Windows quand le
 * JDK est installé dans un chemin contenant une espace — « C:\Program
 * Files\... » : Bubblewrap concatène la commande sans guillemets, et cmd tente
 * d'exécuter « C:\Program ». Gradle, lui, va jusqu'au bout ; ne manquent que
 * l'alignement et la signature, que Bubblewrap aurait faits ensuite.
 *
 * L'alignement sur 4 octets n'est pas cosmétique : sans lui, Android ne peut
 * pas lire les ressources directement depuis le fichier et les recopie en
 * mémoire à chaque ouverture.
 *
 * Après « cd <projet> && gradlew.bat assembleRelease » :
 *   node scripts/signer-apk.mjs [--projet android] [--keystore <chemin>] [--alias <nom>]
 *
 * « --projet » existe depuis qu'il y a deux applications à emballer : celle
 * des patients dans android/, celle des officines dans android-console/. Le
 * nom du fichier produit vient du manifeste, pas d'une constante — deux APK
 * nommés pareil finiraient par s'écraser.
 *
 * Le mot de passe est lu dans APK_KEYSTORE_PASSWORD / APK_KEY_PASSWORD, et
 * jamais écrit ici : la clé de release est l'identité définitive de
 * l'application sur le Play Store.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = fileURLToPath(new URL('..', import.meta.url))

const arg = (nom, defaut) => {
  const i = process.argv.indexOf(`--${nom}`)
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : defaut
}

const ANDROID = join(RACINE, arg('projet', 'android'))

const JAVA = join(
  process.env.JAVA_HOME ?? 'C:/Program Files/Microsoft/jdk-17.0.20.101-hotspot',
  'bin/java.exe',
)
const SDK = process.env.ANDROID_HOME ?? join(process.env.LOCALAPPDATA ?? '', 'Android/Sdk')
const BUILD_TOOLS = arg('buildTools', '36.1.0')
const APKSIGNER = join(SDK, `build-tools/${BUILD_TOOLS}/lib/apksigner.jar`)

const keystore = arg('keystore', join(process.env.USERPROFILE ?? '', '.android/debug.keystore'))
const alias = arg('alias', 'androiddebugkey')
/* Le mot de passe de la clé de DÉBOGAGE est « android », convention publique
   documentée par Google. Pour une clé de release, passez-le par l'environnement. */
const motDePasse = process.env.APK_KEYSTORE_PASSWORD ?? 'android'
const motDePasseCle = process.env.APK_KEY_PASSWORD ?? motDePasse

const ZIPALIGN = join(SDK, `build-tools/${BUILD_TOOLS}/zipalign.exe`)
const brut = join(ANDROID, 'app/build/outputs/apk/release/app-release-unsigned.apk')
const entree = join(ANDROID, 'app-release-unsigned-aligned.apk')
const manifeste = JSON.parse(readFileSync(join(ANDROID, 'twa-manifest.json'), 'utf8'))
/* « ci.pharmasur.console » donne « pharmasur-console-1.0.0.apk ». Le nom se
   lit dans le dossier Téléchargements d'un pharmacien sans l'ouvrir. */
const suffixe = manifeste.packageId.replace(/^ci.pharmasur.?/, '').replace(/^app$/, '')
const sortie = join(
  ANDROID,
  `pharmasur${suffixe ? '-' + suffixe : ''}-${manifeste.appVersion}.apk`,
)

for (const [chemin, quoi] of [
  [JAVA, 'java'],
  [APKSIGNER, 'apksigner'],
  [ZIPALIGN, 'zipalign'],
  [keystore, 'le fichier de clés'],
  [brut, "l'APK produit par Gradle (lancez d'abord gradlew.bat assembleRelease)"],
]) {
  if (!existsSync(chemin)) {
    console.error(`Introuvable — ${quoi} : ${chemin}`)
    process.exit(1)
  }
}

execFileSync(ZIPALIGN, ['-p', '-f', '4', brut, entree], { stdio: 'inherit' })

execFileSync(
  JAVA,
  ['-Xmx1024M', '-Xss1m', '-jar', APKSIGNER, 'sign',
    '--ks', keystore, '--ks-key-alias', alias,
    '--ks-pass', `pass:${motDePasse}`, '--key-pass', `pass:${motDePasseCle}`,
    '--out', sortie, entree],
  { stdio: 'inherit' },
)

const rapport = execFileSync(
  JAVA,
  ['-jar', APKSIGNER, 'verify', '--verbose', '--print-certs', sortie],
  { encoding: 'utf8' },
)

const ligne = (motif) => rapport.split('\n').find((l) => l.includes(motif))?.trim() ?? '—'
console.log(`\n${sortie}`)
console.log(`  ${ligne('Verified using v2')}`)
console.log(`  ${ligne('Verified using v3')}`)
console.log(`  ${ligne('SHA-256 digest')}`)
console.log(
  "\nL'empreinte ci-dessus doit figurer dans public/.well-known/assetlinks.json,",
)
console.log("sinon Android coiffe l'application d'une barre d'adresse.")
