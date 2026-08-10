import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  /*
   * Les métadonnées de partage (og:image, canonical) exigent des URL absolues :
   * un chemin relatif n'est pas résolu par WhatsApp ni Facebook. Le domaine est
   * injecté dans index.html à la place de %SITE_URL%, et se règle au build via
   * VITE_SITE_URL (voir .env.example).
   */
  const siteUrl = (loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_URL || 'https://pharmasur.ci')
    .trim()
    .replace(/\/+$/, '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'pharmasur:site-url',
        transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
      },
    ],
  }
})
