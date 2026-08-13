/**
 * Fond du héros : la photo d'officine fournie par le client, ramenée dans la
 * charte par un voile vert (utilitaires `hero-photo` / `hero-veil` dans
 * `src/index.css`). Elle se fond au blanc avant « Comment ça marche » plutôt
 * que de s'arrêter net.
 *
 * Le plan urbain dessiné qui occupait cette place a été retiré : superposé à
 * une photographie déjà dense en détails, il faisait du bruit. Seuls subsistent
 * les cercles de recherche, du côté droit où le voile est le plus clair — ils
 * disent la géolocalisation sans encombrer la scène.
 */

const rings = [
  { r: 142, delay: '0s' },
  { r: 252, delay: '1.1s' },
  { r: 368, delay: '2.2s' },
]

const CENTER = { x: 1088, y: 404 }

export function HeroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <div className="hero-photo absolute inset-0" />
      <div className="hero-veil absolute inset-0" />

      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" stroke="#fff" strokeDasharray="3 9" strokeWidth="1.5">
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
