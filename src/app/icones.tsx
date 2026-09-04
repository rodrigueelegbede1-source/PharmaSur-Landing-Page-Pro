/*
 * Dictionnaire de tracés SVG, séparé de ui.tsx : un module qui exporte à la
 * fois des composants et des constantes casse le rafraîchissement à chaud.
 */
export const Icone = {
  recherche: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </>
  ),
  liste: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
    </>
  ),
  carte: (
    <>
      <path d="m9 4-6 3v13l6-3 6 3 6-3V4l-6 3-6-3Z" />
      <path d="M9 4v13M15 7v13" />
    </>
  ),
  profil: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </>
  ),
  retour: <path d="M15 5l-7 7 7 7" />,
  fleche: <path d="M5 12h13M13 6l6 6-6 6" />,
  repere: (
    <>
      <path d="M12 21s-7-4.8-7-10a7 7 0 1 1 14 0c0 5.2-7 10-7 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </>
  ),
  telephone: (
    <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4 5.2 2 2 0 0 1 6.5 3Z" />
  ),
  itineraire: <path d="M3 11 21 3l-8 18-2-7-8-3Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  croix: <path d="m6 6 12 12M18 6 6 18" />,
  horloge: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  bouclier: (
    <>
      <path d="M12 3 4 6.2v5.6c0 4.6 3.4 8.6 8 9.2 4.6-.6 8-4.6 8-9.2V6.2L12 3Z" />
      <path d="m8.8 12.2 2.2 2.2 4.2-4.4" />
    </>
  ),
}
