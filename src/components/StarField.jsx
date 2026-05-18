import { useMemo } from 'react';

const STAR_COUNT = 60;

function generateStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 80,
      size: 1 + Math.random() * 3,
      twinkleDuration: 1.5 + Math.random() * 2,
      twinkleDelay: Math.random() * 3,
    });
  }
  return stars;
}

function StarField({ phase }) {
  const stars = useMemo(() => generateStars(STAR_COUNT), []);

  const isVisible = phase >= 1;
  const isBright = phase >= 2;

  return (
    <div className="starfield">
      {stars.map((star) => (
        <div
          key={star.id}
          className={`star${isVisible ? ' visible' : ''}${isBright ? ' bright' : ''}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--twinkle-duration': `${star.twinkleDuration}s`,
            '--twinkle-delay': `${star.twinkleDelay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default StarField;
