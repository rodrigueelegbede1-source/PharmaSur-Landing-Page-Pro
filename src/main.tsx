import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

/*
 * En production le HTML est pré-rendu : on l'hydrate au lieu de le reconstruire,
 * sinon React jetterait le contenu déjà affiché pour le recréer à l'identique.
 * En développement le conteneur est vide, d'où les deux chemins.
 */
if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
