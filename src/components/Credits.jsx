import { useMemo } from 'react';

const SPARKLE_COUNT = 20;

function generateSparkles(count) {
  const sparkles = [];
  for (let i = 0; i < count; i++) {
    sparkles.push({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      delay: Math.random() * 2,
      size: 2 + Math.random() * 4,
    });
  }
  return sparkles;
}

function Credits({ phase, onReplay }) {
  const sparkles = useMemo(() => generateSparkles(SPARKLE_COUNT), []);
  const isVisible = phase >= 4;

  return (
    <div className={`credits-overlay${isVisible ? ' visible' : ''}`}>
      <div className="credits-stars">
        {sparkles.map((s) => (
          <div
            key={s.id}
            className="credit-sparkle"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="credits-title">The End</div>
      <div className="credits-subtitle">小兔子的月亮之旅</div>

      <button className="replay-btn" onClick={onReplay}>
        再看一次
      </button>
    </div>
  );
}

export default Credits;
