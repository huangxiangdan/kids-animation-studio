function Moon({ phase }) {
  const phaseClass = `moon-wrapper phase-${phase}`;
  const showBunnyOnMoon = phase >= 3;
  const showChangeBunny = phase >= 3;

  return (
    <div className={phaseClass}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {/* Moon body */}
        <defs>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8dc" />
            <stop offset="60%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#daa520" />
          </radialGradient>
          <filter id="moonShadow">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#ffd700" floodOpacity="0.4" />
          </filter>
        </defs>

        <circle cx="80" cy="80" r="70" fill="url(#moonGlow)" filter="url(#moonShadow)" />

        {/* Craters */}
        <circle cx="55" cy="50" r="12" fill="#d4a820" opacity="0.4" />
        <circle cx="95" cy="65" r="8" fill="#d4a820" opacity="0.35" />
        <circle cx="70" cy="95" r="10" fill="#d4a820" opacity="0.3" />
        <circle cx="105" cy="45" r="6" fill="#d4a820" opacity="0.3" />
        <circle cx="45" cy="80" r="7" fill="#d4a820" opacity="0.25" />

        {/* Chang'e bunny (gray bunny already on the moon) */}
        <g className={`change-bunny${showChangeBunny ? ' visible' : ''}`} transform="translate(100, 100)">
          {/* Body */}
          <ellipse cx="0" cy="10" rx="10" ry="12" fill="#c0c0c0" />
          {/* Head */}
          <circle cx="0" cy="-5" r="8" fill="#d0d0d0" />
          {/* Ears */}
          <ellipse cx="-4" cy="-18" rx="3" ry="8" fill="#d0d0d0" />
          <ellipse cx="4" cy="-18" rx="3" ry="8" fill="#d0d0d0" />
          <ellipse cx="-4" cy="-18" rx="1.5" ry="5" fill="#f0b0c0" />
          <ellipse cx="4" cy="-18" rx="1.5" ry="5" fill="#f0b0c0" />
          {/* Eyes */}
          <circle cx="-3" cy="-6" r="2" fill="#333" />
          <circle cx="3" cy="-6" r="2" fill="#333" />
          <circle cx="-2.5" cy="-6.5" r="0.7" fill="#fff" />
          <circle cx="3.5" cy="-6.5" r="0.7" fill="#fff" />
          {/* Smile */}
          <path d="M -3,-2 Q 0,1 3,-2" fill="none" stroke="#666" strokeWidth="0.8" />
          {/* Waving arm */}
          <line x1="-8" y1="5" x2="-16" y2="-5" stroke="#c0c0c0" strokeWidth="3" strokeLinecap="round"
            className="bunny-wave" />
        </g>

        {/* Our bunny arriving on moon */}
        {showBunnyOnMoon && (
          <g className="bunny-jump" transform="translate(55, 105)">
            {/* Body */}
            <ellipse cx="0" cy="5" rx="7" ry="9" fill="#fff" />
            {/* Head */}
            <circle cx="0" cy="-6" r="6" fill="#fff" />
            {/* Ears */}
            <ellipse cx="-3" cy="-16" rx="2.5" ry="6" fill="#fff" />
            <ellipse cx="3" cy="-16" rx="2.5" ry="6" fill="#fff" />
            <ellipse cx="-3" cy="-16" rx="1.2" ry="4" fill="#ffb6c1" />
            <ellipse cx="3" cy="-16" rx="1.2" ry="4" fill="#ffb6c1" />
            {/* Eyes */}
            <circle cx="-2" cy="-7" r="1.8" fill="#333" />
            <circle cx="2" cy="-7" r="1.8" fill="#333" />
            <circle cx="-1.5" cy="-7.5" r="0.6" fill="#fff" />
            <circle cx="2.5" cy="-7.5" r="0.6" fill="#fff" />
            {/* Blush */}
            <circle cx="-5" cy="-4" r="2" fill="#ffb6c1" opacity="0.5" />
            <circle cx="5" cy="-4" r="2" fill="#ffb6c1" opacity="0.5" />
            {/* Smile */}
            <path d="M -2,-3 Q 0,-1 2,-3" fill="none" stroke="#333" strokeWidth="0.6" />
          </g>
        )}
      </svg>
    </div>
  );
}

export default Moon;
