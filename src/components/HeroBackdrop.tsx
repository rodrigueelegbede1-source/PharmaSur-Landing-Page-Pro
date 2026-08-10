/**
 * Fond du héros, entièrement dessiné : trame de plan urbain, artères, cercles de
 * recherche et repères d'officine. Il raconte la géolocalisation au lieu de la
 * mettre en scène, reste dans le vert de la charte, et s'efface complètement
 * avant la section « Comment ça marche » (masque de dégradé vertical).
 */

/* Repères posés sur les artères, en coordonnées du viewBox 1440 × 900. */
const markers = [
  { x: 268, y: 528 },
  { x: 604, y: 296 },
  { x: 852, y: 612 },
  { x: 1196, y: 262 },
  { x: 1326, y: 520 },
]

/* Cercles de recherche, centrés derrière la maquette téléphone. */
const rings = [
  { r: 142, delay: '0s' },
  { r: 252, delay: '1.1s' },
  { r: 368, delay: '2.2s' },
]

const CENTER = { x: 1088, y: 404 }

export function HeroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* Lueur verte et fondu au blanc, hérités de la version d'origine */}
      <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_85%_-12%,var(--color-green-100),transparent_62%),linear-gradient(180deg,var(--color-green-50),#fff_74%)]" />

      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="ps-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0v48" fill="none" stroke="var(--color-green-100)" strokeWidth="1" />
          </pattern>

          {/* Le fond meurt avant la section suivante */}
          <linearGradient id="ps-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.8" />
            <stop offset="0.86" stopColor="#fff" stopOpacity="0.25" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="ps-fade-mask">
            <rect width="1440" height="900" fill="url(#ps-fade)" />
          </mask>
        </defs>

        <g mask="url(#ps-fade-mask)">
          <rect width="1440" height="900" fill="url(#ps-grid)" opacity="0.75" />

          {/* Artères : deux voies courbes et une diagonale, très basse intensité */}
          <g
            fill="none"
            stroke="var(--color-green-200)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          >
            <path d="M-40 268C168 268 262 148 470 148s372 96 604 44 372-52 456-96" />
            <path d="M-40 636C210 636 336 700 556 700s356-88 560-88 300 44 404 96" />
            <path d="M196 940 452 484 690 300 1010 96" />
          </g>

          {/* Cercles de recherche autour du repère principal */}
          <g fill="none" stroke="var(--color-green-400)" strokeDasharray="3 9" strokeWidth="1.5">
            {rings.map((ring) => (
              <circle
                key={ring.r}
                cx={CENTER.x}
                cy={CENTER.y}
                r={ring.r}
                opacity="0.4"
                className="origin-center animate-[radar_7s_var(--ease-cine)_infinite] [transform-box:fill-box] motion-reduce:animate-none"
                style={{ animationDelay: ring.delay }}
              />
            ))}
          </g>

          {/* Repère principal : pastille pleine avec croix de pharmacie */}
          <g transform={`translate(${CENTER.x - 17} ${CENTER.y - 17})`} opacity="0.9">
            <rect width="34" height="34" rx="11" fill="var(--color-green-500)" />
            <path
              d="M17 10v14M10 17h14"
              stroke="#fff"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </g>

          {/* Officines alentour */}
          <g opacity="0.55">
            {markers.map((m) => (
              <g key={`${m.x}-${m.y}`} transform={`translate(${m.x - 12} ${m.y - 12})`}>
                <rect
                  width="24"
                  height="24"
                  rx="8"
                  fill="#fff"
                  stroke="var(--color-green-400)"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 7v10M7 12h10"
                  stroke="var(--color-green-500)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
}
