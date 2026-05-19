import { useState, useEffect, useCallback } from 'react';
import './RainbowDragonCanvas.css';

const SCENES = [
  {
    id: 'wake',
    title: '灰色的早晨',
    text: '小龙在云朵上醒来，发现天空失去了颜色…',
    duration: 6000,
  },
  {
    id: 'fly',
    title: '寻找色彩',
    text: '小龙飞过灰蒙蒙的天空，遇到了一朵哭泣的小云。',
    duration: 7000,
  },
  {
    id: 'paint',
    title: '画出彩虹',
    text: '小龙用尾巴在天空中画出一道彩虹！',
    duration: 8000,
  },
  {
    id: 'celebrate',
    title: '彩色世界',
    text: '天空变回彩色，朋友们都出来庆祝啦！',
    duration: 7000,
  },
];

const RAINBOW_COLORS = ['#ff0000', '#ff8800', '#ffff00', '#00cc44', '#0088ff', '#8800ff', '#ff00ff'];

const ANIMAL_FRIENDS = ['🐰', '🐱', '🐶', '🦊', '🐼', '🦋'];

export default function RainbowDragonCanvas() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [rainbowProgress, setRainbowProgress] = useState(0);
  const [cloudTear, setCloudTear] = useState(false);
  const [friendsVisible, setFriendsVisible] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  const currentScene = SCENES[sceneIndex];

  const goNext = useCallback(() => {
    if (sceneIndex < SCENES.length - 1) {
      setSceneIndex(prev => prev + 1);
    } else {
      setShowCredits(true);
    }
  }, [sceneIndex]);

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(goNext, SCENES[sceneIndex].duration);
    return () => clearTimeout(timer);
  }, [started, sceneIndex, goNext]);

  // Scene-specific effects
  useEffect(() => {
    if (!started) return;

    if (currentScene.id === 'fly') {
      setCloudTear(true);
    } else {
      setCloudTear(false);
    }

    if (currentScene.id === 'paint') {
      setRainbowProgress(0);
      const interval = setInterval(() => {
        setRainbowProgress(prev => {
          if (prev >= 7) {
            clearInterval(interval);
            return 7;
          }
          return prev + 0.05;
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      setRainbowProgress(currentScene.id === 'celebrate' ? 7 : 0);
    }
  }, [started, currentScene.id]);

  useEffect(() => {
    if (!started) return;
    if (currentScene.id === 'celebrate') {
      const timer = setTimeout(() => setFriendsVisible(true), 500);
      return () => clearTimeout(timer);
    }
    setFriendsVisible(false);
  }, [started, currentScene.id]);

  const handleStart = () => {
    setStarted(true);
    setSceneIndex(0);
    setShowCredits(false);
    setRainbowProgress(0);
  };

  const isGray = currentScene?.id === 'wake' || currentScene?.id === 'fly';

  return (
    <div className={`rd-stage ${isGray ? 'rd-stage--gray' : ''} ${currentScene?.id === 'celebrate' ? 'rd-stage--colorful' : ''}`}>
      {/* Stars */}
      <div className="rd-stars">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className={`rd-star ${isGray ? 'rd-star--dim' : ''}`}
            style={{
              left: `${5 + (i * 37) % 90}%`,
              top: `${5 + (i * 23) % 40}%`,
              animationDelay: `${(i * 0.3) % 2}s`,
              fontSize: `${8 + (i % 3) * 4}px`,
            }}
          >
            ✦
          </span>
        ))}
      </div>

      {/* Clouds */}
      <div className="rd-clouds">
        <div className={`rd-cloud rd-cloud--1 ${isGray ? 'rd-cloud--gray' : ''}`}>☁️</div>
        <div className={`rd-cloud rd-cloud--2 ${isGray ? 'rd-cloud--gray' : ''}`}>☁️</div>
        <div className={`rd-cloud rd-cloud--3 ${isGray ? 'rd-cloud--gray' : ''}`}>☁️</div>
      </div>

      {/* Crying cloud (scene 2) */}
      {cloudTear && (
        <div className="rd-sad-cloud">
          <span className="rd-sad-cloud-emoji">☁️</span>
          <div className="rd-tears">
            <span className="rd-tear" style={{ animationDelay: '0s' }}>💧</span>
            <span className="rd-tear" style={{ animationDelay: '0.5s' }}>💧</span>
            <span className="rd-tear" style={{ animationDelay: '1s' }}>💧</span>
          </div>
        </div>
      )}

      {/* Rainbow (scene 3 & 4) */}
      {rainbowProgress > 0 && (
        <div className="rd-rainbow">
          <svg viewBox="0 0 400 200" className="rd-rainbow-svg">
            {RAINBOW_COLORS.map((color, i) => {
              const r = 180 - i * 20;
              const progress = Math.min(1, (rainbowProgress - i) / 1.5);
              if (progress <= 0) return null;
              return (
                <path
                  key={i}
                  d={`M ${200 - r} ${200} A ${r} ${r} 0 0 1 ${200 + r} ${200}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="18"
                  strokeDasharray={`${Math.PI * r * progress} ${Math.PI * r}`}
                  opacity={0.85}
                  className="rd-rainbow-arc"
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Dragon */}
      {started && !showCredits && (
        <div className={`rd-dragon rd-dragon--${currentScene.id}`}>
          <span className="rd-dragon-emoji">🐉</span>
          {/* Tail sparkle when painting */}
          {currentScene.id === 'paint' && (
            <div className="rd-tail-sparkle">
              ✨
            </div>
          )}
        </div>
      )}

      {/* Animal friends (scene 4) */}
      {friendsVisible && (
        <div className="rd-friends">
          {ANIMAL_FRIENDS.map((animal, i) => (
            <span
              key={i}
              className="rd-friend"
              style={{
                animationDelay: `${i * 0.3}s`,
                left: `${10 + i * 15}%`,
              }}
            >
              {animal}
            </span>
          ))}
        </div>
      )}

      {/* Confetti (scene 4) */}
      {currentScene?.id === 'celebrate' && (
        <div className="rd-confetti">
          {Array.from({ length: 30 }).map((_, i) => (
            <span
              key={i}
              className="rd-confetti-piece"
              style={{
                left: `${(i * 13) % 100}%`,
                animationDelay: `${(i * 0.15) % 3}s`,
                backgroundColor: RAINBOW_COLORS[i % 7],
              }}
            />
          ))}
        </div>
      )}

      {/* Scene title & text */}
      {started && !showCredits && (
        <div className="rd-narration">
          <h2 className="rd-scene-title">{currentScene.title}</h2>
          <p className="rd-scene-text">{currentScene.text}</p>
        </div>
      )}

      {/* Progress dots */}
      {started && !showCredits && (
        <div className="rd-progress">
          {SCENES.map((_, i) => (
            <span
              key={i}
              className={`rd-dot ${i === sceneIndex ? 'rd-dot--active' : ''} ${i < sceneIndex ? 'rd-dot--done' : ''}`}
            />
          ))}
        </div>
      )}

      {/* Start screen */}
      {!started && (
        <div className="rd-start">
          <div className="rd-start-emoji">🐉</div>
          <h1 className="rd-start-title">小龙的彩虹桥</h1>
          <p className="rd-start-desc">天空失去了颜色，小龙决定画出彩虹！</p>
          <button className="rd-start-btn" onClick={handleStart}>
            开始观看 ✨
          </button>
        </div>
      )}

      {/* Credits */}
      {showCredits && (
        <div className="rd-credits">
          <div className="rd-credits-emoji">🌈</div>
          <h2 className="rd-credits-title">每个人都能画出自己的彩虹</h2>
          <p className="rd-credits-sub">小龙的彩虹桥 · 完</p>
          <button className="rd-start-btn" onClick={handleStart}>
            再看一次 🔄
          </button>
        </div>
      )}
    </div>
  );
}
