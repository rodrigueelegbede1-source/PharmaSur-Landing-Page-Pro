import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  /*
   * Sans endpoint, le formulaire affiche une confirmation sans rien envoyer —
   * comportement voulu en développement, désastreux en production : chaque
   * prospect serait perdu pendant qu'on l'assure de son inscription. Le build
   * de production échoue donc plutôt que de produire ce piège silencieux.
   */
  if (command === 'build' && mode === 'production' && !env.VITE_LEAD_ENDPOINT) {
    throw new Error(
      'VITE_LEAD_ENDPOINT est absente.\n' +
        "Sans elle, le formulaire confirmerait l'inscription sans envoyer aucun " +
        'numéro. Build interrompu volontairement.\n' +
        'Renseignez-la dans .env en local, ou dans les variables du projet Vercel.',
    )
  }

  /*
   * Les métadonnées de partage (og:image, canonical) exigent des URL absolues :
   * un chemin relatif n'est pas résolu par WhatsApp ni Facebook. Le domaine est
   * injecté dans index.html à la place de %SITE_URL%, et se règle au build via
   * VITE_SITE_URL (voir .env.example).
   */
  const siteUrl = (env.VITE_SITE_URL || 'https://pharmasur.ci').trim().replace(/\/+$/, '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'pharmasur:site-url',
        transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
      },
    ],
    build: {
      // Les pages légales sont des entrées à part entière : une URL propre,
      // indexable et partageable, comme l'exige un document opposable.
      //
      // L'application patient en est une aussi, à /app/ : c'est une
      // application installable, avec son manifeste, son service worker et son
      // propre point d'entrée. Elle ne partage avec le site que la charte
      // (src/index.css) et la police déjà servie.
      rollupOptions: {
        input: {
          index: resolve(import.meta.dirname,'index.html'),
          mentions: resolve(import.meta.dirname,'mentions-legales/index.html'),
          confidentialite: resolve(import.meta.dirname,'confidentialite/index.html'),
          aide: resolve(import.meta.dirname,'aide/index.html'),
          app: resolve(import.meta.dirname,'app/index.html'),
        },
      },
    },
  }
})
