/**
 * Fond du héros : un dessin, plus une photographie.
 *
 * POURQUOI LA PHOTO EST PARTIE. Elle montrait un comptoir d'officine avec un
 * pharmacien et une cliente — une scène convaincante, mais dont les droits
 * n'étaient pas établis : « titulaire des droits sur la photographie » était
 * l'une des deux dernières mentions manquantes des mentions légales. Et les
 * personnes qu'elle met en scène n'existent pas. Un service qui s'interdit
 * d'inventer des témoignages et des chiffres ne devrait pas se présenter
 * derrière des visages fabriqués.
 *
 * CE QUI LA REMPLACE. Le signe que cherche quelqu'un qui a besoin d'une
 * pharmacie la nuit à Abidjan : la croix verte. Elle est ici à l'échelle d'une
 * enseigne, très pâle, et le repère de PharmaSur en occupe le centre — d'où
 * partent les cercles de recherche, qui jusqu'ici émanaient de rien.
 *
 * CE QUE CE FOND NE FAIT PAS. Pas de plan de ville, pas de rues, pas de
 * semis de repères : l'écran Carte de l'application refuse un fond de carte
 * pour la même raison, un décor cartographique se lit comme une donnée. Ici
 * tout est manifestement ornement.
 *
 * Il ne pèse rien — aucun fichier à télécharger, contre 92 ko de photographie
 * — et reste net à toutes les définitions.
 */

const rings = [
  { r: 142, delay: '0s' },
  { r: 252, delay: '1.1s' },
  { r: 368, delay: '2.2s' },
]

/* Le motif est calé à droite, derrière la maquette du téléphone : la colonne
   de gauche porte le titre et doit rester sur un fond uni. */
const CENTER = { x: 1088, y: 404 }

/** Croix de pharmacie, branches égales et extrémités adoucies. */
function Croix({ x, y, taille, epaisseur }: { x: number; y: number; taille: number; epaisseur: number }) {
  const b = (taille - epaisseur) / 2
  const r = epaisseur * 0.12
  return (
    <g transform={`translate(${x - taille / 2} ${y - taille / 2})`}>
      <rect x={b} y="0" width={epaisseur} height={taille} rx={r} />
      <rect x="0" y={b} width={taille} height={epaisseur} rx={r} />
    </g>
  )
}

export function HeroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/*
        Le fond en CSS et non dans le SVG : il doit couvrir toute la largeur
        quelle que soit la forme de l'écran, alors que le motif, lui, peut
        être rogné sans dommage. Il se termine en blanc pour rejoindre la
        section suivante sans arête.
      */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-green-50)_0%,var(--color-green-50)_38%,#fff_92%)]" />

      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Halo doux derrière la maquette : il détache le téléphone du fond
              sans introduire de bord net. */}
          <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="var(--color-green-200)" stopOpacity="0.55" />
            <stop offset="0.55" stopColor="var(--color-green-200)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--color-green-200)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={CENTER.x} cy={CENTER.y} r="560" fill="url(#halo)" />

        {/* L'enseigne, à l'échelle d'une façade et à peine visible. */}
        <g fill="var(--color-green-600)" opacity="0.07">
          <Croix x={CENTER.x} y={CENTER.y} taille={520} epaisseur={168} />
        </g>

        {/* Le repère de PharmaSur au centre : les cercles émanent enfin de
            quelque chose. */}
        <g
          transform={`translate(${CENTER.x - 30} ${CENTER.y - 42}) scale(2.5)`}
          fill="none"
          stroke="var(--color-green-600)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        >
          <path d="M12 21s-7-4.8-7-10a7 7 0 1 1 14 0c0 5.2-7 10-7 10Z" />
          <path d="M12 8v6M9 11h6" />
        </g>

        <g fill="none" stroke="var(--color-green-500)" strokeDasharray="3 9" strokeWidth="1.5">
          {rings.map((ring) => (
            <circle
              key={ring.r}
              cx={CENTER.x}
              cy={CENTER.y}
              r={ring.r}
              opacity="0.45"
              className="origin-center animate-[radar_7s_var(--ease-cine)_infinite] [transform-box:fill-box] motion-reduce:animate-none"
              style={{ animationDelay: ring.delay }}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
