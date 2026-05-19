import { useState, useEffect, useCallback } from 'react';
import './WhiteBoneDemonCanvas.css';

const SCENES = [
  {
    id: 'intro',
    title: '西行路上',
    text: '唐僧师徒四人走在荒山野岭，天色渐暗……',
    duration: 6000,
  },
  {
    id: 'disguise1',
    title: '第一变·村姑',
    text: '白骨精变成一个美丽的村姑，提着饭篮走来……',
    duration: 7000,
  },
  {
    id: 'strike1',
    title: '一打白骨精',
    text: '悟空火眼金睛识破妖怪，金箍棒呼啸而出！',
    duration: 8000,
  },
  {
    id: 'disguise2',
    title: '第二变·老奶奶',
    text: '白骨精又变成一个老奶奶，哭着来找女儿……',
    duration: 7000,
  },
  {
    id: 'strike2',
    title: '二打白骨精',
    text: '悟空再次识破，金箍棒带着雷霆之力砸下！',
    duration: 8000,
  },
  {
    id: 'disguise3',
    title: '第三变·老爷爷',
    text: '白骨精变成一个老爷爷，念着经来寻妻女……',
    duration: 7000,
  },
  {
    id: 'strike3',
    title: '三打白骨精',
    text: '悟空怒喝一声，金箍棒化作万道金光，此妖必灭！',
    duration: 9000,
  },
  {
    id: 'victory',
    title: '妖怪消灭！',
    text: '白骨精终于现出原形，化作一堆白骨！师父明白了悟空的苦心。',
    duration: 7000,
  },
  {
    id: 'ending',
    title: '',
    text: '',
    duration: 6000,
  },
];

export default function WhiteBoneDemonCanvas() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const [shaking, setShaking] = useState(false);

  const currentScene = SCENES[sceneIndex];

  const goNext = useCallback(() => {
    setSceneIndex(prev => {
      if (prev >= SCENES.length - 1) {
        setIsPlaying(false);
        setShowReplay(true);
        return prev;
      }
      return prev + 1;
    });
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(goNext, currentScene.duration);
    return () => clearTimeout(timer);
  }, [sceneIndex, isPlaying, currentScene.duration, goNext]);

  // Screen shake on strike scenes
  useEffect(() => {
    if (currentScene.id.startsWith('strike')) {
      const strikeNum = currentScene.id.replace('strike', '');
      const shakeDelay = strikeNum === '3' ? 800 : 600;
      const shakeDuration = strikeNum === '3' ? 1500 : 800;
      const timer = setTimeout(() => {
        setShaking(true);
        setTimeout(() => setShaking(false), shakeDuration);
      }, shakeDelay);
      return () => clearTimeout(timer);
    }
  }, [sceneIndex, currentScene.id]);

  const handleStart = () => {
    setSceneIndex(0);
    setIsPlaying(true);
    setShowReplay(false);
  };

  const handleReplay = () => {
    setSceneIndex(0);
    setIsPlaying(true);
    setShowReplay(false);
  };

  const phase = currentScene.id;

  return (
    <div className="wbd-wrapper">
      <div className={`wbd-stage ${shaking ? 'screen-shake' : ''}`}>
        {/* Background */}
        <div className={`wbd-bg ${phase}`} />

        {/* Lightning overlay for strikes */}
        {phase.startsWith('strike') && <LightningOverlay strike={parseInt(phase.replace('strike', ''))} />}

        {/* Mountains */}
        <div className="wbd-mountains">
          <div className="mountain mountain-1" />
          <div className="mountain mountain-2" />
          <div className="mountain mountain-3" />
        </div>

        {/* Ground */}
        <div className={`wbd-ground ${phase}`} />

        {/* Mist */}
        <div className={`wbd-mist ${phase}`} />

        {/* Scene-specific content */}
        {phase === 'intro' && <IntroScene />}
        {phase === 'disguise1' && <DisguiseScene disguise="villager" />}
        {phase === 'strike1' && <StrikeScene strike={1} />}
        {phase === 'disguise2' && <DisguiseScene disguise="grandma" />}
        {phase === 'strike2' && <StrikeScene strike={2} />}
        {phase === 'disguise3' && <DisguiseScene disguise="grandpa" />}
        {phase === 'strike3' && <StrikeScene strike={3} />}
        {phase === 'victory' && <VictoryScene />}
        {phase === 'ending' && <EndingScene />}

        {/* Title bar */}
        {isPlaying && currentScene.title && (
          <div className="wbd-title-bar">
            <span className="wbd-scene-title">{currentScene.title}</span>
          </div>
        )}

        {/* Subtitle */}
        {isPlaying && currentScene.text && (
          <div className="wbd-subtitle">
            <p>{currentScene.text}</p>
          </div>
        )}

        {/* Start screen */}
        {!isPlaying && !showReplay && (
          <div className="wbd-start-overlay" onClick={handleStart}>
            <div className="start-content">
              <div className="start-emoji">🐒</div>
              <h1 className="start-title">三打白骨精</h1>
              <p className="start-desc">西游记经典故事</p>
              <button className="start-btn">开始观看</button>
            </div>
          </div>
        )}

        {/* Replay */}
        {showReplay && (
          <div className="wbd-replay-overlay" onClick={handleReplay}>
            <div className="replay-content">
              <div className="replay-emoji">✨</div>
              <h2 className="replay-title">故事结束啦</h2>
              <p className="replay-desc">火眼金睛辨真假，正义勇敢护师父！</p>
              <button className="replay-btn">再看一遍</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== Lightning Overlay ===== */
function LightningOverlay({ strike }) {
  const bolts = strike === 3 ? 5 : strike === 2 ? 3 : 2;
  return (
    <div className="lightning-overlay">
      {[...Array(bolts)].map((_, i) => (
        <div key={i} className="lightning-bolt" style={{ '--bolt': i, '--bolts': bolts }}>
          <svg viewBox="0 0 100 200" className="bolt-svg">
            <path
              d={`M${30 + i * 10} 0 L${25 + i * 8} 60 L${40 + i * 5} 65 L${20 + i * 6} 130 L${35 + i * 4} 135 L${15 + i * 5} 200`}
              fill="none"
              stroke="rgba(255, 230, 100, 0.9)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d={`M${30 + i * 10} 0 L${25 + i * 8} 60 L${40 + i * 5} 65 L${20 + i * 6} 130 L${35 + i * 4} 135 L${15 + i * 5} 200`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="6"
              strokeLinecap="round"
              filter="blur(3px)"
            />
          </svg>
        </div>
      ))}
      <div className="lightning-flash" />
    </div>
  );
}

/* ===== Sub-components ===== */

function IntroScene() {
  return (
    <div className="intro-scene">
      <div className="character-group">
        <div className="char monk">
          <span className="char-emoji">🧑‍🦲</span>
          <span className="char-name">唐僧</span>
        </div>
        <div className="char wukong main-char">
          <span className="char-emoji">🐒</span>
          <span className="char-name">悟空</span>
          <span className="golden-eyes">👁️✨</span>
        </div>
        <div className="char bajie">
          <span className="char-emoji">🐷</span>
          <span className="char-name">八戒</span>
        </div>
        <div className="char wujing">
          <span className="char-emoji">🧔</span>
          <span className="char-name">沙僧</span>
        </div>
      </div>
      <div className="walking-path">
        <div className="path-dust" />
      </div>
    </div>
  );
}

function DisguiseScene({ disguise }) {
  const config = {
    villager: { emoji: '👩‍🌾', name: '村姑', basket: '🧺' },
    grandma: { emoji: '👵', name: '老奶奶', basket: '🕯️' },
    grandpa: { emoji: '👴', name: '老爷爷', basket: '📿' },
  }[disguise];

  return (
    <div className="disguise-scene">
      <div className="char wukong left-side">
        <span className="char-emoji">🐒</span>
        <span className="char-name">悟空</span>
        <span className="golden-eyes active">👁️✨</span>
      </div>

      <div className={`disguised-demon ${disguise}`}>
        <div className="demon-glow" />
        <span className="demon-emoji">{config.emoji}</span>
        <span className="demon-name">{config.name}</span>
        <span className="demon-basket">{config.basket}</span>
        <div className="demon-shadow-hint" />
      </div>

      <div className="thought-bubble">
        <span>是妖怪！</span>
      </div>
    </div>
  );
}

function StrikeScene({ strike }) {
  const intensity = strike; // 1, 2, 3 - increasing intensity

  return (
    <div className="strike-scene">
      {/* Wukong battle pose - bigger and more dynamic */}
      <div className={`wukong-battle strike-${strike}`}>
        <div className="battle-aura" />
        <span className="battle-emoji">🐒</span>
        <div className="battle-shout">
          {strike === 1 && '嘿！'}
          {strike === 2 && '哈！'}
          {strike === 3 && '灭！'}
        </div>
        {/* Golden Club - bigger and more dramatic */}
        <div className={`golden-club-v2 strike-${strike}`}>
          <div className="club-glow" />
          <div className="club-body">
            <div className="club-head">🔱</div>
            <div className="club-shaft" />
          </div>
          <div className="club-trail-v2" />
          <div className="club-trail-v2 trail-2" />
          <div className="club-trail-v2 trail-3" />
        </div>
      </div>

      {/* Multi-layer impact */}
      <div className={`impact-zone strike-${strike}`}>
        {/* Central explosion */}
        <div className="explosion-core" />
        <div className="explosion-ring ring-1" />
        <div className="explosion-ring ring-2" />
        <div className="explosion-ring ring-3" />

        {/* Shockwave */}
        <div className="shockwave" />
        <div className="shockwave sw-2" />

        {/* Sparks - more for higher strikes */}
        {[...Array(8 + intensity * 4)].map((_, i) => (
          <span key={i} className="battle-spark" style={{
            '--i': i,
            '--angle': `${(360 / (8 + intensity * 4)) * i}deg`,
            '--distance': `${60 + intensity * 30}px`,
            '--size': `${3 + intensity * 2}px`,
            '--color': i % 3 === 0 ? '#ffd700' : i % 3 === 1 ? '#ff6b00' : '#fff',
          }} />
        ))}

        {/* Fire particles */}
        {[...Array(4 + intensity * 2)].map((_, i) => (
          <div key={i} className="fire-particle" style={{
            '--i': i,
            '--angle': `${(360 / (4 + intensity * 2)) * i + 20}deg`,
          }} />
        ))}

        {/* Debris flying */}
        {[...Array(3 + intensity * 2)].map((_, i) => (
          <span key={i} className="debris" style={{ '--i': i, '--strike': strike }}>
            {['💥', '✦', '⚡', '🔥', '💫'][i % 5]}
          </span>
        ))}
      </div>

      {/* Demon being hit */}
      <div className={`demon-hit strike-${strike}`}>
        {strike < 3 ? (
          <>
            {/* Demon flying back */}
            <span className="hit-demon-emoji">
              {strike === 1 ? '👩‍🌾' : '👵'}
            </span>
            {/* Transform back to skeleton briefly */}
            <span className="demon-reveal">💀</span>
            {/* Smoke escape - more dramatic */}
            <div className="smoke-burst">
              {[...Array(6 + strike * 2)].map((_, i) => (
                <div key={i} className="smoke-cloud" style={{ '--i': i }} />
              ))}
            </div>
            <span className="escape-trail">💨💨💨</span>
          </>
        ) : (
          <>
            {/* Final defeat - most dramatic */}
            <span className="final-demon">👴</span>
            <span className="final-reveal">💀</span>
            <div className="final-explosion">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="final-burst-ray" style={{ '--i': i }} />
              ))}
            </div>
            <div className="bone-scatter">
              <span className="bone-fly" style={{ '--bx': '-60px', '--by': '-80px' }}>🦴</span>
              <span className="bone-fly" style={{ '--bx': '80px', '--by': '-60px' }}>🦴</span>
              <span className="bone-fly" style={{ '--bx': '-40px', '--by': '-120px' }}>💀</span>
              <span className="bone-fly" style={{ '--bx': '50px', '--by': '-100px' }}>🦴</span>
              <span className="bone-fly" style={{ '--bx': '-80px', '--by': '-40px' }}>🦴</span>
              <span className="bone-fly" style={{ '--bx': '70px', '--by': '-30px' }}>💀</span>
            </div>
            <div className="purify-light" />
          </>
        )}
      </div>

      {/* Energy waves for strike 3 */}
      {strike === 3 && (
        <div className="energy-waves">
          <div className="energy-wave ew-1" />
          <div className="energy-wave ew-2" />
          <div className="energy-wave ew-3" />
        </div>
      )}
    </div>
  );
}

function VictoryScene() {
  return (
    <div className="victory-scene">
      <div className="victory-group">
        <div className="char wukong victory-pose">
          <span className="char-emoji">🐒</span>
          <span className="char-name">悟空</span>
        </div>
        <div className="char monk understanding">
          <span className="char-emoji">🧑‍🦲</span>
          <span className="char-name">唐僧</span>
        </div>
      </div>
      <div className="victory-effects">
        {[...Array(12)].map((_, i) => (
          <span key={i} className="victory-star" style={{ '--i': i }}>⭐</span>
        ))}
      </div>
      <div className="victory-fireworks">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="firework" style={{ '--i': i }}>
            {[...Array(8)].map((_, j) => (
              <span key={j} className="firework-spark" style={{ '--j': j, '--fi': i }} />
            ))}
          </div>
        ))}
      </div>
      <div className="bone-remains">
        <span>💀</span>
        <span>🦴</span>
        <span>🦴</span>
      </div>
    </div>
  );
}

function EndingScene() {
  return (
    <div className="ending-scene">
      <div className="ending-content">
        <div className="ending-title">三打白骨精</div>
        <div className="ending-divider">✦ ✦ ✦</div>
        <div className="ending-moral">火眼金睛辨真假</div>
        <div className="ending-moral2">正义勇敢护师父</div>
        <div className="ending-characters">
          <span>🐒</span>
          <span>🧑‍🦲</span>
          <span>🐷</span>
          <span>🧔</span>
        </div>
      </div>
    </div>
  );
}
