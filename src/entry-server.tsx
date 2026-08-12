import { renderToString } from 'react-dom/server'
import App from './App'

/**
 * Rendu du site en HTML au moment du build. Aucun serveur n'est nécessaire à
 * l'exécution : le résultat est injecté une fois pour toutes dans dist/index.html
 * par scripts/prerender.mjs, et le site reste un ensemble de fichiers statiques.
 */
export function render() {
  return renderToString(<App />)
}
