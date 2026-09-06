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
 *
 * C'est la SEULE façon d'installer PharmaSur sur un iPhone. Apple n'autorise
 * aucune installation depuis un site web : il n'existe pas de fichier iOS à
 * télécharger, et un bouton qui le prétendrait mentirait. Un vrai .ipa
 * demanderait macOS, Xcode, un compte développeur payant, et passerait par
 * l'App Store ou TestFlight.
 */
export const APP_PATIENT = '/app/'

/**
 * L'application en un seul fichier, à télécharger et ouvrir dans n'importe
 * quel navigateur — y compris hors ligne, y compris sur iPhone.
 *
 * Elle ne demande aucune requête réseau : bundle, feuille de style et police
 * sont repliés dedans. Assemblée au build par scripts/generer-app-fichier.mjs ;
 * ne pas la modifier à la main, elle serait écrasée.
 */
export const APP_FICHIER = '/pharmasur-application.html'

/**
 * Console pharmacie INSTALLABLE, servie à /console/ : manifeste, icône propre
 * et service worker. Chrome propose « Installer l'application », Safari « Sur
 * l'écran d'accueil », et elle s'ouvre ensuite sans réseau — ce qui compte au
 * comptoir un jour de coupure.
 *
 * Le bouton pointait auparavant sur le fichier à télécharger : l'officine se
 * retrouvait avec « file:///C:/Users/… » dans sa barre d'adresse, sans icône,
 * sans raccourci et sans mise à jour. Le fichier reste disponible, mais comme
 * second choix et sous son vrai nom.
 *
 * Elle n'a pas plus de serveur que le reste : la démonstration est hors ligne
 * et le bandeau du haut le dit.
 */
export const CONSOLE_PHARMACIE = '/console/'

/**
 * La même console en UN fichier, à enregistrer et ouvrir depuis le disque.
 * C'est ce qui s'envoie par WhatsApp à un pharmacien, et ce qui s'ouvre là où
 * il n'y a pas de réseau du tout. Elle ne déclare ni manifeste ni service
 * worker : depuis file://, le navigateur refuse les deux.
 */
export const CONSOLE_FICHIER = '/console-pharmasur.html'

/**
 * Formulaire de rappel, seule action qui engage réellement quelqu'un
 * aujourd'hui : on relève un numéro pour prévenir au lancement.
 */
export const RAPPEL = '#telecharger'
