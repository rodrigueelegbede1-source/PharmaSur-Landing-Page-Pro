/*
 * Service worker de l'application patient.
 *
 * Objectif : que l'application s'ouvre sans réseau une fois installée. En
 * Côte d'Ivoire, un patient qui cherche une pharmacie le fait souvent avec
 * une connexion faible ou un forfait épuisé ; une application qui exige le
 * réseau pour afficher son premier écran ne sert à rien au moment où l'on en
 * a besoin.
 *
 * Stratégie volontairement simple, faute de données serveur à arbitrer :
 *   - navigation : réseau d'abord, cache en secours (on veut la dernière
 *     version quand elle est joignable, mais jamais un écran blanc) ;
 *   - reste : cache d'abord, réseau en secours et mise en cache au passage.
 *
 * Le nom du cache porte une version. La changer à chaque déploiement force
 * la purge : sans cela, un correctif resterait invisible sur les appareils
 * déjà installés.
 */
const CACHE = 'pharmasur-app-v1'
const SOCLE = ['/app/', '/app/index.html', '/app/manifest.webmanifest', '/fonts/plus-jakarta-sans.woff2']

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
          caches.open(CACHE).then((c) => c.put('/app/index.html', copie))
          return reponse
        })
        .catch(() => caches.match('/app/index.html').then((r) => r ?? Response.error())),
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
