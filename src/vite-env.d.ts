/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Endpoint qui reçoit les numéros du formulaire CTA (POST JSON).
   * Non défini : le formulaire répond localement, rien n'est envoyé.
   */
  readonly VITE_LEAD_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
