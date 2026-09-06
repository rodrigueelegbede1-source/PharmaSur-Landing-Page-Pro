import { APK_PATIENT, APP_FICHIER, GUIDE_IPHONE } from './destinations'

/*
 * Que doit donner un bouton « Télécharger » qui n'a la place de rien dire ?
 *
 * Celui de la barre de navigation livrait l'APK à tout le monde. Sur un
 * ordinateur, l'utilisateur récupérait un fichier Android qu'aucun logiciel
 * n'ouvre ; sur un iPhone, la même chose, en pire — iOS ne sait même pas quoi
 * en faire. Le bouton marchait, et ne servait qu'à un visiteur sur deux.
 *
 * Ailleurs sur la page, les trois voies sont montrées côte à côte et le
 * visiteur choisit : c'est le bon parti quand on a la place de les nommer, et
 * il ne change pas. Ici il n'y a la place que d'un mot, donc il faut choisir
 * pour lui — mais sans jamais l'enfermer : la section de téléchargement reste
 * à un défilement, avec les trois routes.
 *
 * Sur iPhone il n'y a rien à télécharger : Apple interdit l'installation
 * depuis un site. Le bouton y mène donc au mode d'emploi, et son libellé passe
 * à « Installer » plutôt que de promettre un fichier qui n'existe pas.
 */
export type Telechargement = {
  href: string
  /** Absent quand la cible est une page, pas un fichier. */
  download?: string
  label: string
}

/**
 * Valeur rendue au prérendu, avant que le navigateur ait dit qui il est.
 * Elle mène à la section qui montre les trois voies : sans JavaScript, le
 * visiteur choisit lui-même — ce qui est correct, pas dégradé.
 */
export const PAR_DEFAUT: Telechargement = { href: '#telecharger', label: 'Télécharger' }

export function detecter(ua: string, tactile: number, plateforme: string): Telechargement {
  /* Un iPad récent se déclare « Macintosh » : seul le nombre de points de
     contact le trahit. Sans ce test, un iPad recevrait le fichier de bureau. */
  const iOS = /iPad|iPhone|iPod/.test(ua) || (plateforme === 'MacIntel' && tactile > 1)
  if (iOS) return { href: GUIDE_IPHONE, label: 'Installer' }

  if (/Android/.test(ua)) {
    return { href: APK_PATIENT, download: 'pharmasur-1.0.0.apk', label: 'Télécharger' }
  }

  /* Ordinateur, ou tout appareil non reconnu : le fichier unique s'ouvre dans
     n'importe quel navigateur, ce qui en fait le choix le moins risqué quand
     on ne sait pas. */
  return { href: APP_FICHIER, download: 'pharmasur-application.html', label: 'Télécharger' }
}

export function telechargementLocal(): Telechargement {
  const n = navigator
  return detecter(n.userAgent, n.maxTouchPoints ?? 0, n.platform ?? '')
}
