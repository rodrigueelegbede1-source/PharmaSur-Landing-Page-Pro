import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  /*
   * Il y avait ici un garde-fou : le build de production échouait si
   * VITE_LEAD_ENDPOINT était absente, parce que le formulaire de rappel aurait
   * alors confirmé une inscription sans envoyer le moindre numéro — un piège
   * silencieux. Le formulaire ayant été retiré le 6 septembre 2026, la
   * variable n'existe plus et le garde-fou n'a plus rien à protéger.
   */

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
          iphone: resolve(import.meta.dirname,'iphone/index.html'),
          app: resolve(import.meta.dirname,'app/index.html'),
        },
      },
    },
  }
})
