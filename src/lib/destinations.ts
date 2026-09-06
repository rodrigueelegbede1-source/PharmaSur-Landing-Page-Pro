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
 * Le mode d'emploi iPhone. Le bouton menait directement à /app/ : le visiteur
 * arrivait sur l'application dans Safari sans savoir que la suite se passe
 * dans le menu Partager. Il découvrait une page web, pas une installation.
 *
 * Cette page montre les trois gestes, puis renvoie vers /app/. Elle explique
 * aussi pourquoi il n'y a pas de .ipa à télécharger : iOS n'installe rien
 * depuis un site, et un bouton qui le prétendrait ferait enregistrer un
 * fichier inerte.
 */
export const GUIDE_IPHONE = '/iphone/'

/**
 * L'application en un seul fichier, à télécharger et ouvrir dans n'importe
 * quel navigateur — y compris hors ligne, y compris sur iPhone.
 *
 * Elle ne demande aucune requête réseau : bundle, feuille de style et police
 * sont repliés dedans. Assemblée au build par scripts/generer-app-fichier.mjs ;
 * ne pas la modifier à la main, elle serait écrasée.
 *
 * ELLE ET console-pharmasur.html SONT SERVIES EN « Content-Disposition:
 * attachment », réglé dans vercel.json. Sans cet en-tête, un fichier .html
 * s'OUVRE dans le navigateur au lieu de s'enregistrer : l'attribut download
 * des boutons du site l'évite, mais pas quand le lien est copié, partagé par
 * WhatsApp, ou ouvert par un navigateur qui ignore l'attribut.
 *
 * Ne pas étendre cet en-tête à /console/ ni à /app/ : ce sont des pages, elles
 * doivent s'afficher. vercel.json étant du JSON, il ne peut pas porter ce
 * commentaire — d'où sa place ici. Une tentative de l'y écrire sous une clé
 * « // » a fait échouer un déploiement : le schéma refuse les clés inconnues.
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
 * APK Android de la console. Comme celui des patients, c'est une coquille qui
 * ouvre /console/ en plein écran : elle n'embarque aucun code, et affichera
 * donc les officines réelles le jour où elles seront référencées, sans qu'il
 * faille republier un APK.
 *
 * Elle porte son propre identifiant — ci.pharmasur.console — et sa propre
 * icône sombre : un pharmacien peut avoir les deux applications sur le même
 * téléphone, et deux paquets de même nom ne s'installent pas côte à côte.
 *
 * Signée avec la clé de débogage : installable sur un téléphone, refusée par
 * le Play Store. Android demandera d'autoriser l'installation depuis cette
 * source, comme pour tout APK hors magasin.
 */
export const APK_CONSOLE = '/pharmasur-console-1.0.0.apk'

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
