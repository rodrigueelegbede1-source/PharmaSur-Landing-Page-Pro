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

/** Application patient installable. */
export const APP_PATIENT = '/app/'

/**
 * Console pharmacie, livrée en fichier unique à télécharger : le pharmacien
 * l'enregistre et l'ouvre dans son navigateur, sans installation ni compte.
 * Elle non plus n'a pas de serveur — c'est une démonstration hors ligne.
 */
export const CONSOLE_PHARMACIE = '/console-pharmasur.html'

/**
 * Formulaire de rappel, seule action qui engage réellement quelqu'un
 * aujourd'hui : on relève un numéro pour prévenir au lancement.
 */
export const RAPPEL = '#telecharger'
