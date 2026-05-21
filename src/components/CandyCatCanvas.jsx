import { useState, useEffect, useRef } from 'react';
import './CandyCatCanvas.css';

const SCENES = [
  {
    id: 'fall',
    title: '掉进糖果世界',
    text: '小猫追蝴蝶，一不小心掉进了彩虹洞…',
    emoji: '🐱',
    duration: 7000,
  },
  {
    id: 'river',
    title: '巧克力河漂流',
    text: '糖果船载着小猫，在巧克力河上漂流～',
    emoji: '🍫',
    duration: 7000,
  },
  {
    id: 'mountain',
    title: '棉花糖山',
    text: '爬上软绵绵的棉花糖山，滑下来真开心！',
    emoji: '🍦',
    duration: 7000,
  },
  {
    id: 'party',
    title: '糖果派对',
    text: '糖果朋友们都来啦！一起庆祝吧！',
    emoji: '🎉',
    duration: 8000,
  },
];

const CANDY_FRIENDS = ['🧸', '🍭', '🐰', '🦄', '🐻'];
const CANDY_TREES = ['🍭', '🍬', '🍒', '🍩', '🧁'];
const CANDY_FISH = ['🐟', '🐠', '🐡', '🦈'];

export default function CandyCatCanvas() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const timerRef = useRef(null);
  const scene = SCENES[sceneIndex];

  useEffect(() => {
    if (!started || showCredits) return;
    timerRef.current = setTimeout(() => {
      if (sceneIndex < SCENES.length - 1) {
        setSceneIndex(prev => prev + 1);
      } else {
        setShowCredits(true);
      }
    }, scene.duration);
    return () => clearTimeout(timerRef.current);
  }, [sceneIndex, started, showCredits, scene.duration]);

  const handleStart = () => setStarted(true);
  const handleReplay = () => {
    setSceneIndex(0);
    setShowCredits(false);
    setStarted(true);
  };

  if (!started) {
    return (
      <div className="candy-canvas candy-canvas--intro">
        <div className="candy-intro">
          <div className="candy-intro-emoji">🐱🍬</div>
          <h1 className="candy-intro-title">小猫的糖果世界冒险</h1>
          <p className="candy-intro-sub">一个甜蜜的小故事</p>
          <div className="candy-intro-decor">
            {CANDY_TREES.map((c, i) => (
              <span key={i} className="candy-float" style={{ '--i': i, '--delay': `${i * 0.3}s` }}>{c}</span>
            ))}
          </div>
          <button className="candy-btn" onClick={handleStart}>开始冒险 🍭</button>
        </div>
      </div>
    );
  }

  if (showCredits) {
    return (
      <div className="candy-canvas candy-canvas--credits">
        <div className="candy-credits">
          <div className="candy-credits-fireworks">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="firework" style={{ '--i': i, '--x': `${Math.random() * 80 + 10}%`, '--y': `${Math.random() * 60 + 10}%` }}>
                {'✦✧★✦✧🌟'[i % 6]}
              </span>
            ))}
          </div>
          <div className="candy-credits-emoji">🐱🍬</div>
          <h2 className="candy-credits-title">甜蜜的冒险，永远不嫌多！</h2>
          <p className="candy-credits-sub">🍬 小猫的糖果世界冒险 🍬</p>
          <div className="candy-credits-friends">
            {CANDY_FRIENDS.map((f, i) => (
              <span key={i} className="friend-bounce" style={{ '--i': i }}>{f}</span>
            ))}
          </div>
          <button className="candy-btn" onClick={handleReplay}>再看一次 🎀</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`candy-canvas candy-canvas--${scene.id}`}>
      {/* Scene 1: Fall into candy world */}
      {scene.id === 'fall' && (
        <div className="scene-fall">
          <div className="fall-sky">
            <div className="fall-rainbow-hole">
              <div className="rainbow-ring ring-1" />
              <div className="rainbow-ring ring-2" />
              <div className="rainbow-ring ring-3" />
              <div className="rainbow-ring ring-4" />
            </div>
            <div className="fall-butterfly">🦋</div>
          </div>
          <div className="fall-cat">🐱</div>
          <div className="fall-candy-land">
            {CANDY_TREES.map((c, i) => (
              <span key={i} className="candy-tree" style={{ '--i': i }}>{c}</span>
            ))}
          </div>
          <div className="fall-chocolate-river" />
        </div>
      )}

      {/* Scene 2: Chocolate river */}
      {scene.id === 'river' && (
        <div className="scene-river">
          <div className="river-sky">
            <div className="cookie-castle">🏰</div>
            <div className="marshmallow-cloud mc-1">☁️</div>
            <div className="marshmallow-cloud mc-2">☁️</div>
            <div className="marshmallow-cloud mc-3">☁️</div>
          </div>
          <div className="river-body">
            <div className="river-boat">
              <span className="boat-candy">🍬</span>
              <span className="boat-cat">🐱</span>
            </div>
            {CANDY_FISH.map((f, i) => (
              <span key={i} className="river-fish" style={{ '--i': i }}>{f}</span>
            ))}
          </div>
          <div className="river-banks">
            <div className="bank-left">
              <span>🍪</span><span>🧁</span><span>🍪</span>
            </div>
            <div className="bank-right">
              <span>🍩</span><span>🍰</span><span>🍩</span>
            </div>
          </div>
        </div>
      )}

      {/* Scene 3: Marshmallow mountain */}
      {scene.id === 'mountain' && (
        <div className="scene-mountain">
          <div className="mountain-sky">
            <div className="ice-cream-top">🍦</div>
          </div>
          <div className="mountain-body">
            <div className="marshmallow-mtn" />
            <div className="mountain-cat climbing">🐱</div>
            <div className="slide-trail" />
          </div>
          <div className="mountain-ground">
            {['🌸', '🌺', '🌸', '🌺', '🌸'].map((f, i) => (
              <span key={i} className="ground-flower" style={{ '--i': i }}>{f}</span>
            ))}
          </div>
        </div>
      )}

      {/* Scene 4: Candy party */}
      {scene.id === 'party' && (
        <div className="scene-party">
          <div className="party-sky">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="party-confetti" style={{ '--i': i, '--x': `${10 + i * 10}%` }}>
                {['🎀', '✨', '🎊', '💫', '🎀', '✨', '🎊', '💫'][i]}
              </span>
            ))}
          </div>
          <div className="party-center">
            <div className="party-cat">🐱</div>
            <div className="party-friends">
              {CANDY_FRIENDS.map((f, i) => (
                <span key={i} className="party-friend" style={{ '--i': i }}>{f}</span>
              ))}
            </div>
          </div>
          <div className="party-fireworks">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="party-firework" style={{ '--i': i, '--x': `${15 + i * 14}%` }}>
                <div className="fw-burst" />
              </div>
            ))}
          </div>
          <div className="party-ground">
            {CANDY_TREES.map((c, i) => (
              <span key={i} className="party-candy" style={{ '--i': i }}>{c}</span>
            ))}
          </div>
        </div>
      )}

      {/* Scene title overlay */}
      <div className="scene-overlay">
        <div className="scene-title">{scene.title}</div>
        <div className="scene-text">{scene.text}</div>
      </div>

      {/* Progress dots */}
      <div className="scene-progress">
        {SCENES.map((s, i) => (
          <span
            key={s.id}
            className={`progress-dot ${i === sceneIndex ? 'active' : ''} ${i < sceneIndex ? 'done' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
