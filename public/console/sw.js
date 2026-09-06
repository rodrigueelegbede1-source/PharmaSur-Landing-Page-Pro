/*
 * Service worker de la console pharmacie.
 *
 * Objectif : que la console s'ouvre sans réseau une fois installée. Une
 * officine dont la connexion tombe doit pouvoir consulter ses horaires, sa
 * garde et ses stocks — c'est justement au comptoir, un jour de coupure, que
 * l'outil doit répondre.
 *
 * La console est UNE page : tout son contenu, sa feuille de style, sa police
 * et son script tiennent dans /console/index.html. Le socle se réduit donc à
 * ce fichier et à son manifeste — il n'y a aucune ressource à aller chercher
 * ensuite, contrairement à l'application patient qui charge ses modules.
 *
 * Même stratégie que l'application : réseau d'abord pour la navigation, afin
 * de recevoir la dernière version quand elle est joignable, cache en secours
 * pour ne jamais montrer un écran blanc.
 *
 * Le nom du cache porte une version. La changer à chaque déploiement force la
 * purge : sans cela, un correctif resterait invisible sur les appareils déjà
 * installés.
 */
const CACHE = 'pharmasur-console-v1'
const SOCLE = ['/console/', '/console/index.html', '/console/manifest.webmanifest']

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(SOCLE))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((noms) => Promise.all(noms.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const requete = e.request
  if (requete.method !== 'GET') return

  const url = new URL(requete.url)
  if (url.origin !== self.location.origin) return

  if (requete.mode === 'navigate') {
    e.respondWith(
      fetch(requete)
        .then((reponse) => {
          const copie = reponse.clone()
          caches.open(CACHE).then((c) => c.put('/console/index.html', copie))
          return reponse
        })
        .catch(() => caches.match('/console/index.html').then((r) => r ?? Response.error())),
    )
    return
  }

  e.respondWith(
    caches.match(requete).then(
      (enCache) =>
        enCache ??
        fetch(requete).then((reponse) => {
          if (reponse.ok && reponse.type === 'basic') {
            const copie = reponse.clone()
            caches.open(CACHE).then((c) => c.put(requete, copie))
          }
          return reponse
        }),
    ),
  )
})
