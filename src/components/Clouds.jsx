import { useMemo } from 'react';

const CLOUD_COUNT = 8;

function generateClouds(count) {
  const clouds = [];
  for (let i = 0; i < count; i++) {
    clouds.push({
      id: i,
      x: 10 + Math.random() * 80,
      startY: -80 - Math.random() * 200,
      scale: 0.5 + Math.random() * 0.8,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2,
    });
  }
  return clouds;
}

function CloudSvg({ scale }) {
  return (
    <svg
      width={120 * scale}
      height={50 * scale}
      viewBox="0 0 120 50"
    >
      <ellipse cx="60" cy="35" rx="50" ry="15" fill="#fff" opacity="0.9" />
      <ellipse cx="40" cy="25" rx="25" ry="18" fill="#fff" opacity="0.95" />
      <ellipse cx="70" cy="22" rx="30" ry="20" fill="#fff" opacity="0.92" />
      <ellipse cx="55" cy="20" rx="20" ry="16" fill="#f8f8ff" />
    </svg>
  );
}

function Clouds({ phase }) {
  const clouds = useMemo(() => generateClouds(CLOUD_COUNT), []);
  const showClouds = phase === 1 || phase === 2;

  return (
    <div className="clouds-layer">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className={`cloud${showClouds ? ' visible' : ''}`}
          style={{
            left: `${cloud.x}%`,
            '--cloud-start': `${cloud.startY}px`,
            '--cloud-duration': `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
          }}
        >
          <CloudSvg scale={cloud.scale} />
        </div>
      ))}
    </div>
  );
}

export default Clouds;
