import { useMemo } from 'react';

function Rocket({ phase }) {
  const showFlame = phase >= 1 && phase < 4;
  const showWaving = phase === 0;

  const smokeParticles = useMemo(() => {
    if (phase !== 1) return [];
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: -20 + Math.random() * 40,
      y: 80 + Math.random() * 20,
      size: 15 + Math.random() * 25,
      delay: i * 0.2,
    }));
  }, [phase]);

  return (
    <div className={`rocket-container phase-${phase}`}>
      {/* Smoke during launch */}
      {phase === 1 &&
        smokeParticles.map((p) => (
          <div
            key={p.id}
            className="smoke-puff"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

      <svg width="80" height="140" viewBox="0 0 80 140">
        <defs>
          <linearGradient id="rocketBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e8302a" />
            <stop offset="40%" stopColor="#ff4040" />
            <stop offset="80%" stopColor="#ff5252" />
            <stop offset="100%" stopColor="#cc2020" />
          </linearGradient>
          <linearGradient id="rocketNose" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#e8302a" />
          </linearGradient>
          <radialGradient id="windowGlass" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#b0e0ff" />
            <stop offset="60%" stopColor="#4da6ff" />
            <stop offset="100%" stopColor="#2060a0" />
          </radialGradient>
        </defs>

        {/* Fins */}
        <path d="M 15,105 L 5,130 L 20,118 Z" fill="#ffa500" stroke="#e89000" strokeWidth="1" />
        <path d="M 65,105 L 75,130 L 60,118 Z" fill="#ffa500" stroke="#e89000" strokeWidth="1" />
        <path d="M 35,115 L 40,135 L 45,115 Z" fill="#ffa500" stroke="#e89000" strokeWidth="1" />

        {/* Body */}
        <rect x="20" y="40" width="40" height="80" rx="4" fill="url(#rocketBody)" />

        {/* Nose cone */}
        <path d="M 20,40 Q 20,15 40,5 Q 60,15 60,40 Z" fill="url(#rocketNose)" />

        {/* Body stripe */}
        <rect x="20" y="60" width="40" height="5" fill="#ffd700" opacity="0.8" />
        <rect x="20" y="100" width="40" height="5" fill="#ffd700" opacity="0.8" />

        {/* Window */}
        <circle cx="40" cy="55" r="11" fill="#1a3a5c" stroke="#ffd700" strokeWidth="2" />
        <circle cx="40" cy="55" r="9" fill="url(#windowGlass)" />

        {/* Bunny in window */}
        <g transform="translate(40, 55)">
          {/* Face */}
          <circle cx="0" cy="0" r="7" fill="#fff" />
          {/* Ears poking up */}
          <ellipse cx="-3" cy="-9" rx="2" ry="5" fill="#fff" />
          <ellipse cx="3" cy="-9" rx="2" ry="5" fill="#fff" />
          <ellipse cx="-3" cy="-9" rx="1" ry="3.5" fill="#ffb6c1" />
          <ellipse cx="3" cy="-9" rx="1" ry="3.5" fill="#ffb6c1" />
          {/* Eyes */}
          <circle cx="-2.5" cy="-1" r="1.5" fill="#333" />
          <circle cx="2.5" cy="-1" r="1.5" fill="#333" />
          <circle cx="-2" cy="-1.5" r="0.5" fill="#fff" />
          <circle cx="3" cy="-1.5" r="0.5" fill="#fff" />
          {/* Nose */}
          <circle cx="0" cy="1" r="0.8" fill="#ffb6c1" />
          {/* Mouth */}
          <path d="M -1.5,2 Q 0,3.5 1.5,2" fill="none" stroke="#333" strokeWidth="0.5" />
          {/* Cheeks */}
          <circle cx="-4.5" cy="1" r="1.5" fill="#ffb6c1" opacity="0.4" />
          <circle cx="4.5" cy="1" r="1.5" fill="#ffb6c1" opacity="0.4" />

          {/* Waving hand (phase 0 only) */}
          {showWaving && (
            <g className="bunny-wave">
              <line x1="6" y1="3" x2="11" y2="-3" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              {/* Little paw */}
              <circle cx="11" cy="-3" r="1.5" fill="#fff" />
            </g>
          )}
        </g>

        {/* Flame */}
        <g className={`flame-group${showFlame ? ' active' : ''}`} transform="translate(40, 122)">
          {/* Outer flame */}
          <ellipse className="flame-outer" cx="0" cy="12" rx="14" ry="18" fill="#ff6600" opacity="0.7" />
          {/* Middle flame */}
          <ellipse className="flame-inner" cx="0" cy="10" rx="10" ry="14" fill="#ff9900" opacity="0.85" />
          {/* Inner flame */}
          <ellipse className="flame-inner" cx="0" cy="8" rx="6" ry="10" fill="#ffcc00" />
          {/* Core */}
          <ellipse cx="0" cy="6" rx="3" ry="6" fill="#fff8dc" />
        </g>
      </svg>
    </div>
  );
}

export default Rocket;
