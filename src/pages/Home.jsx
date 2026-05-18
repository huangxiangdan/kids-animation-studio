import { useNavigate } from 'react-router-dom';
import './Home.css';

const ANIMATIONS = [
  {
    id: 'rocket-bunny',
    title: '小兔子的月亮之旅',
    desc: '勇敢的小兔子坐火箭飞向月亮，星星为它喝彩！',
    emoji: '🚀',
    bg: 'linear-gradient(135deg, #0a0030 0%, #1a0050 50%, #3a1080 100%)',
    accent: '#a78bfa',
  },
  {
    id: 'white-bone-demon',
    title: '三打白骨精',
    desc: '悟空火眼金睛识破妖怪三次变化，保护师父！',
    emoji: '🐒',
    bg: 'linear-gradient(135deg, #3d1a00 0%, #5c2d0e 50%, #8b4513 100%)',
    accent: '#ffd700',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <header className="home-header">
        <div className="home-logo">🎬</div>
        <h1 className="home-title">小动画工作室</h1>
        <p className="home-sub">每一帧，都是一个小故事</p>
      </header>

      <main className="home-grid">
        {ANIMATIONS.map(anim => (
          <button
            key={anim.id}
            className="anim-card"
            style={{ '--card-bg': anim.bg, '--card-accent': anim.accent }}
            onClick={() => navigate(`/${anim.id}`)}
          >
            <div className="card-preview">
              <span className="card-emoji">{anim.emoji}</span>
              <div className="card-sparkles">
                {['✦', '✧', '✦', '✧', '✦'].map((s, i) => (
                  <span key={i} className="sparkle" style={{ '--i': i }}>{s}</span>
                ))}
              </div>
            </div>
            <div className="card-info">
              <h2 className="card-title">{anim.title}</h2>
              <p className="card-desc">{anim.desc}</p>
              <span className="card-cta">立即观看 →</span>
            </div>
          </button>
        ))}

        <div className="anim-card anim-card--coming">
          <div className="card-preview">
            <span className="card-emoji">🐉</span>
          </div>
          <div className="card-info">
            <h2 className="card-title">更多故事…</h2>
            <p className="card-desc">新的动画正在制作中，敬请期待！</p>
            <span className="card-cta coming-tag">即将上线</span>
          </div>
        </div>
      </main>
    </div>
  );
}
