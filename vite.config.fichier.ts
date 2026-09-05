import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/*
 * Build dédié à la version en un fichier de l'application patient.
 *
 * Le build principal produit des modules ES qui s'importent les uns les
 * autres. Ouverts depuis file://, ces imports échouent : le navigateur les
 * traite comme des requêtes inter-origines et les refuse. Un fichier
 * téléchargé doit donc contenir UN seul script, sans import — d'où le format
 * « iife » et l'absence de découpage.
 *
 * La feuille de style n'est pas découpée non plus : elle sera repliée dans le
 * HTML par scripts/generer-app-fichier.mjs, avec la police.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    /* Le service worker ne s'enregistre pas depuis file:// et n'aurait rien à
       mettre en cache : tout est déjà dans le fichier. */
    __FICHIER_LOCAL__: 'true',
    /*
     * En mode bibliothèque, Vite ne remplace pas process.env.NODE_ENV comme il
     * le fait pour un build d'application. React le lit au démarrage : sans
     * cette ligne, le fichier s'ouvre sur un écran blanc et « process is not
     * defined » dans la console. La valeur « production » embarque en prime la
     * version allégée de React.
     */
    'process.env.NODE_ENV': '"production"',
  },
  /* Sans cela, Vite recopie tout public/ — dont l'APK de 1,3 Mo — dans un
     dossier qui ne sert qu'à produire deux fichiers. */
  publicDir: false,
  build: {
    outDir: 'dist-fichier',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: 'src/app/main.tsx',
      formats: ['iife'],
      name: 'PharmaSurApplication',
      fileName: () => 'application.js',
    },
    rollupOptions: {
      output: { assetFileNames: 'style.css' },
    },
  },
})
