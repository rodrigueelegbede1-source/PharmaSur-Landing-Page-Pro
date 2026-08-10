/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Endpoint qui reçoit les numéros du formulaire CTA (POST JSON).
   * Non défini : le formulaire répond localement, rien n'est envoyé.
   */
  readonly VITE_LEAD_ENDPOINT?: string

  /**
   * Domaine public, injecté dans `index.html` à la place de `%SITE_URL%`.
   * Lu uniquement par `vite.config.ts`, jamais par le code de l'application.
   */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
