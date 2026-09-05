/*
 * Destinations des appels à l'action du site.
 *
 * Elles sont ici, et pas dispersées dans les composants, parce qu'elles vont
 * changer : le jour où un APK signé ou une fiche Play Store existe, c'est
 * cette seule ligne qu'il faut modifier.
 *
 * ÉTAT ACTUEL — à lire avant de toucher quoi que ce soit :
 *
 * L'application patient est une application web installable (PWA) servie à
 * /app/. Sur Android, Chrome propose « Installer l'application » ; sur iOS,
 * Safari propose « Sur l'écran d'accueil ». Elle fonctionne hors ligne une
 * fois installée. Ce n'est PAS un fichier .apk : produire un APK demande la
 * chaîne d'outils Android (JDK, SDK, Gradle) et une clé de signature. Le
 * chemin le plus court, une fois cette PWA en ligne en HTTPS, est de
 * l'emballer en TWA avec Bubblewrap — l'application reste celle-ci, l'APK
 * n'en est que l'emballage pour le Play Store.
 *
 * Ses données sont FICTIVES : ni catalogue de médicaments, ni référentiel
 * d'officines, ni stock réel. Elle porte un bandeau qui le dit sur chaque
 * écran, et elle est en noindex. Ne pas retirer l'un sans l'autre.
 */

/**
 * APK Android de l'application patient. Le bouton le télécharge directement.
 *
 * L'APK n'embarque aucun code : c'est une coquille qui ouvre /app/ en plein
 * écran. Il est signé avec la clé de débogage — installable sur un téléphone,
 * refusé par le Play Store.
 *
 * Le nom du fichier porte la version : le changer ici suppose de déposer le
 * nouvel APK dans public/ et de laisser l'ancien, pour ne pas casser les liens
 * déjà partagés.
 */
export const APK_PATIENT = '/pharmasur-1.0.0.apk'

/**
 * Version web de l'application, pour qui n'est pas sur Android : un iPhone ou
 * un ordinateur ne fait rien d'un APK. Safari propose « Sur l'écran
 * d'accueil », Chrome « Installer l'application ».
 */
export const APP_PATIENT = '/app/'

/**
 * Console pharmacie, livrée en fichier unique à télécharger : le pharmacien
 * l'enregistre et l'ouvre dans son navigateur, sans installation ni compte.
 * Elle non plus n'a pas de serveur — c'est une démonstration hors ligne.
 * La mise en page s'adapte du téléphone au grand écran.
 */
export const CONSOLE_PHARMACIE = '/console-pharmasur.html'

/**
 * Formulaire de rappel, seule action qui engage réellement quelqu'un
 * aujourd'hui : on relève un numéro pour prévenir au lancement.
 */
export const RAPPEL = '#telecharger'
