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
 * Il n'est enregistré qu'en production : en développement, il servirait une
 * version en cache et masquerait les modifications en cours.
 */
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/app/sw.js', { scope: '/app/' }).catch(() => {
      /* Refusé par le navigateur ou hors HTTPS : l'application marche quand
         même, simplement sans installation ni hors-ligne. */
    })
  })
}
