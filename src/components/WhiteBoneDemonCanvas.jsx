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
    text: '悟空火眼金睛识破妖怪，一棒打去！白骨精化作青烟逃走！',
    duration: 6000,
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
    text: '悟空再次识破，金箍棒落下！白骨精又化作青烟逃走！',
    duration: 6000,
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
    text: '悟空第三次举起金箍棒，这次一定要消灭妖怪！',
    duration: 7000,
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

  // Determine phase for CSS
  const phase = currentScene.id;

  return (
    <div className="wbd-wrapper">
      <div className="wbd-stage">
        {/* Background */}
        <div className={`wbd-bg ${phase}`} />

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
      {/* Wukong on the left */}
      <div className="char wukong left-side">
        <span className="char-emoji">🐒</span>
        <span className="char-name">悟空</span>
        <span className="golden-eyes active">👁️✨</span>
      </div>

      {/* Disguised demon on the right */}
      <div className={`disguised-demon ${disguise}`}>
        <div className="demon-glow" />
        <span className="demon-emoji">{config.emoji}</span>
        <span className="demon-name">{config.name}</span>
        <span className="demon-basket">{config.basket}</span>
        <div className="demon-shadow-hint" />
      </div>

      {/* Wukong's thought bubble */}
      <div className="thought-bubble">
        <span>是妖怪！</span>
      </div>
    </div>
  );
}

function StrikeScene({ strike }) {
  return (
    <div className="strike-scene">
      {/* Wukong attacking */}
      <div className={`wukong-attack strike-${strike}`}>
        <span className="attack-emoji">🐒</span>
        <div className="golden-club">
          <span>🔱</span>
          <div className="club-trail" />
        </div>
      </div>

      {/* Impact effect */}
      <div className={`impact-effect strike-${strike}`}>
        <div className="impact-flash" />
        <div className="impact-ring" />
        <div className="impact-sparks">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="spark" style={{ '--i': i }} />
          ))}
        </div>
      </div>

      {/* Demon escaping as smoke */}
      {strike < 3 && (
        <div className="demon-escape">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="smoke-puff" style={{ '--i': i }} />
          ))}
          <span className="escape-emoji">💨</span>
        </div>
      )}

      {/* Demon defeated - strike 3 */}
      {strike === 3 && (
        <div className="demon-defeated">
          <div className="bone-pile">
            <span>💀</span>
            <span>🦴</span>
            <span>🦴</span>
          </div>
          <div className="victory-light" />
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
