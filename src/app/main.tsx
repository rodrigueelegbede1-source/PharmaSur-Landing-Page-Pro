import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/*
 * Le service worker rend l'application installable et utilisable hors ligne.
 *
 * Il n'est enregistré qu'en production servie en http(s). En développement, il
 * servirait une version en cache et masquerait les modifications en cours ; et
 * dans la version en un fichier, ouverte depuis file://, il ne s'enregistre
 * pas — sans rien y perdre, puisque tout le contenu est déjà dans le fichier.
 */
declare const __FICHIER_LOCAL__: boolean | undefined
const fichierLocal = typeof __FICHIER_LOCAL__ !== 'undefined' && __FICHIER_LOCAL__

if (
  'serviceWorker' in navigator &&
  import.meta.env.PROD &&
  !fichierLocal &&
  location.protocol.startsWith('http')
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/app/sw.js', { scope: '/app/' }).catch(() => {
      /* Refusé par le navigateur ou hors HTTPS : l'application marche quand
         même, simplement sans installation ni hors-ligne. */
    })
  })
}
