import { useState, useEffect, useRef } from 'react';
import './DinoGardenCanvas.css';

const SCENES = [
  {
    id: 'garden-morning',
    title: '花园清晨',
    text: '小恐龙在花园里醒来，花朵一朵朵绽放～',
    emoji: '🦖',
    duration: 6000,
  },
  {
    id: 'prepare-party',
    title: '准备派对',
    text: '小恐龙挂起彩旗，摆好蛋糕，气球飘起来！',
    emoji: '🎉',
    duration: 6000,
  },
  {
    id: 'friends-arrive',
    title: '朋友们来了',
    text: '小兔子、小猫、小狐狸都来啦！',
    emoji: '🐰',
    duration: 6000,
  },
  {
    id: 'party-time',
    title: '派对开始',
    text: '大家一起跳舞，烟花绽放，彩虹出现！',
    emoji: '🎆',
    duration: 8000,
  },
];

const FLOWERS = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🌼'];
const FRIENDS = [
  { emoji: '🐰', name: '小兔子', delay: 0 },
  { emoji: '🐱', name: '小猫', delay: 0.8 },
  { emoji: '🦊', name: '小狐狸', delay: 1.6 },
  { emoji: '🐼', name: '熊猫', delay: 2.4 },
];

const FIREWORK_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bff', '#ff9f43'];

export default function DinoGardenCanvas() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const timerRef = useRef(null);

  const currentScene = SCENES[sceneIndex];

  useEffect(() => {
    if (!started) return;
    if (sceneIndex >= SCENES.length) {
      setTimeout(() => setShowCredits(true), 500);
      return;
    }
    timerRef.current = setTimeout(() => {
      setSceneIndex(prev => prev + 1);
    }, SCENES[sceneIndex].duration);
    return () => clearTimeout(timerRef.current);
  }, [sceneIndex, started]);

  const handleStart = () => setStarted(true);
  const handleReplay = () => {
    setSceneIndex(0);
    setShowCredits(false);
    setStarted(true);
  };

  // Generate random flowers
  const flowerPositions = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      emoji: FLOWERS[i % FLOWERS.length],
      left: 5 + (i * 8) % 90,
      bottom: 2 + (i * 7) % 15,
      delay: i * 0.3,
      size: 1.2 + (i % 3) * 0.4,
    }))
  ).current;

  // Generate balloons
  const balloons = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      color: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bff', '#ff9f43'][i],
      left: 15 + i * 14,
      delay: i * 0.5,
    }))
  ).current;

  // Generate fireworks
  const fireworks = useRef(
    Array.from({ length: 8 }, (_, i) => ({
      left: 10 + (i * 12) % 80,
      top: 10 + (i * 8) % 30,
      delay: i * 0.6,
      color: FIREWORK_COLORS[i % FIREWORK_COLORS.length],
    }))
  ).current;

  // Generate bunting flags
  const flags = useRef(
    Array.from({ length: 9 }, (_, i) => ({
      color: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bff', '#ff9f43', '#ff6b6b', '#ffd93d', '#6bcb77'][i],
      left: 8 + i * 10,
    }))
  ).current;

  if (!started) {
    return (
      <div className="dino-garden dino-garden--intro">
        <div className="dino-intro-bg">
          <div className="intro-sun">☀️</div>
          <div className="intro-clouds">
            <span className="intro-cloud" style={{ left: '10%', animationDelay: '0s' }}>☁️</span>
            <span className="intro-cloud" style={{ left: '60%', animationDelay: '2s' }}>☁️</span>
          </div>
          <div className="intro-flowers">
            {FLOWERS.slice(0, 5).map((f, i) => (
              <span key={i} className="intro-flower" style={{ left: `${10 + i * 20}%`, animationDelay: `${i * 0.2}s` }}>{f}</span>
            ))}
          </div>
          <div className="intro-dino">🦖</div>
        </div>
        <div className="dino-intro-content">
          <h1 className="dino-intro-title">小恐龙的花园派对</h1>
          <p className="dino-intro-sub">🦖🌸 一个关于友谊和快乐的小故事</p>
          <button className="dino-start-btn" onClick={handleStart}>
            开始观看 ▶
          </button>
        </div>
      </div>
    );
  }

  if (showCredits) {
    return (
      <div className="dino-garden dino-garden--credits">
        <div className="credits-bg">
          <div className="credits-rainbow">🌈</div>
          <div className="credits-sparkles">
            {Array.from({ length: 15 }, (_, i) => (
              <span key={i} className="credit-sparkle" style={{
                left: `${5 + (i * 7) % 90}%`,
                top: `${10 + (i * 13) % 70}%`,
                animationDelay: `${i * 0.3}s`,
              }}>✨</span>
            ))}
          </div>
        </div>
        <div className="credits-content">
          <div className="credits-emoji">🦖🎉</div>
          <h2 className="credits-title">好朋友在一起</h2>
          <h2 className="credits-title">每天都是派对！</h2>
          <div className="credits-friends">
            {FRIENDS.map((f, i) => (
              <span key={i} className="credits-friend" style={{ animationDelay: `${i * 0.2}s` }}>
                {f.emoji}
              </span>
            ))}
            <span className="credits-friend" style={{ animationDelay: '0.8s' }}>🦖</span>
          </div>
          <button className="dino-replay-btn" onClick={handleReplay}>
            再看一次 🔄
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dino-garden">
      {/* Sky background */}
      <div className="dino-sky">
        <div className="dino-sun">☀️</div>
        <div className="dino-clouds">
          <span className="dino-cloud" style={{ left: '5%', animationDelay: '0s' }}>☁️</span>
          <span className="dino-cloud" style={{ left: '35%', animationDelay: '3s' }}>☁️</span>
          <span className="dino-cloud" style={{ left: '70%', animationDelay: '6s' }}>☁️</span>
        </div>
      </div>

      {/* Ground */}
      <div className="dino-ground">
        <div className="dino-grass"></div>
        {flowerPositions.map((f, i) => (
          <span
            key={i}
            className={`dino-flower ${sceneIndex >= 0 ? 'dino-flower--bloom' : ''}`}
            style={{
              left: `${f.left}%`,
              bottom: `${f.bottom}%`,
              animationDelay: `${f.delay}s`,
              fontSize: `${f.size}rem`,
            }}
          >
            {f.emoji}
          </span>
        ))}
      </div>

      {/* Scene 0: Garden Morning - Dino wakes up */}
      {sceneIndex === 0 && (
        <div className="dino-scene dino-scene--morning">
          <div className="dino-character dino-character--waking">
            <span className="dino-emoji">🦖</span>
            <div className="dino-zzz">💤</div>
          </div>
          <div className="dino-butterflies">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} className="dino-butterfly" style={{
                left: `${20 + i * 20}%`,
                animationDelay: `${i * 0.8}s`,
              }}>🦋</span>
            ))}
          </div>
        </div>
      )}

      {/* Scene 1: Prepare Party */}
      {sceneIndex === 1 && (
        <div className="dino-scene dino-scene--prepare">
          <div className="dino-character dino-character--busy">
            <span className="dino-emoji">🦖</span>
          </div>
          {/* Bunting flags */}
          <div className="dino-bunting">
            <div className="bunting-line"></div>
            {flags.map((f, i) => (
              <span
                key={i}
                className="bunting-flag"
                style={{
                  left: `${f.left}%`,
                  backgroundColor: f.color,
                  animationDelay: `${i * 0.15}s`,
                }}
              ></span>
            ))}
          </div>
          {/* Balloons */}
          <div className="dino-balloons">
            {balloons.map((b, i) => (
              <div
                key={i}
                className="dino-balloon"
                style={{
                  left: `${b.left}%`,
                  animationDelay: `${b.delay}s`,
                }}
              >
                <div className="balloon-body" style={{ backgroundColor: b.color }}></div>
                <div className="balloon-string"></div>
              </div>
            ))}
          </div>
          {/* Cake */}
          <div className="dino-cake">🎂</div>
        </div>
      )}

      {/* Scene 2: Friends Arrive */}
      {sceneIndex === 2 && (
        <div className="dino-scene dino-scene--friends">
          <div className="dino-character dino-character--waving">
            <span className="dino-emoji">🦖</span>
            <span className="dino-wave-hand">👋</span>
          </div>
          <div className="dino-friends">
            {FRIENDS.map((f, i) => (
              <div
                key={i}
                className="dino-friend"
                style={{ animationDelay: `${f.delay}s` }}
              >
                <span className="friend-emoji">{f.emoji}</span>
                <span className="friend-name">{f.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scene 3: Party Time */}
      {sceneIndex === 3 && (
        <div className="dino-scene dino-scene--party">
          <div className="dino-party-group">
            <span className="party-dino">🦖</span>
            {FRIENDS.map((f, i) => (
              <span key={i} className="party-friend" style={{ animationDelay: `${i * 0.3}s` }}>
                {f.emoji}
              </span>
            ))}
          </div>
          {/* Fireworks */}
          <div className="dino-fireworks">
            {fireworks.map((fw, i) => (
              <div
                key={i}
                className="dino-firework"
                style={{
                  left: `${fw.left}%`,
                  top: `${fw.top}%`,
                  animationDelay: `${fw.delay}s`,
                }}
              >
                <div className="firework-burst" style={{ '--fw-color': fw.color }}></div>
              </div>
            ))}
          </div>
          {/* Rainbow */}
          <div className="dino-rainbow">🌈</div>
          {/* Confetti */}
          <div className="dino-confetti">
            {Array.from({ length: 20 }, (_, i) => (
              <span
                key={i}
                className="confetti-piece"
                style={{
                  left: `${(i * 5) % 100}%`,
                  animationDelay: `${i * 0.15}s`,
                  backgroundColor: FIREWORK_COLORS[i % FIREWORK_COLORS.length],
                }}
              ></span>
            ))}
          </div>
        </div>
      )}

      {/* Scene title & subtitle */}
      <div className="dino-overlay">
        <div className="dino-scene-title" key={currentScene?.id}>
          {currentScene?.title}
        </div>
        <div className="dino-scene-text" key={`text-${currentScene?.id}`}>
          {currentScene?.text}
        </div>
      </div>

      {/* Progress dots */}
      <div className="dino-progress">
        {SCENES.map((s, i) => (
          <span
            key={i}
            className={`dino-dot ${i === sceneIndex ? 'dino-dot--active' : ''} ${i < sceneIndex ? 'dino-dot--done' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
