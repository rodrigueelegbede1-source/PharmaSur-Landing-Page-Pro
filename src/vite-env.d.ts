/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Domaine public, injecté dans `index.html` à la place de `%SITE_URL%`.
   * Lu uniquement par `vite.config.ts`, jamais par le code de l'application.
   */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
