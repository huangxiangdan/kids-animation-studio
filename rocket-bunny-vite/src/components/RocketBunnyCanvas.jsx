import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const W = 520, H = 700;
const GROUND_Y = H - 80;

function createState() {
  return {
    t: 0,
    phase: 0,
    rocketX: W / 2,
    rocketY: GROUND_Y - 110,
    rocketVY: 0,
    moonX: W / 2 + 40,
    moonY: 110,
    particles: [],
    meteors: [],
    stars: Array.from({ length: 140 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.04 + 0.01,
    })),
  };
}

function emitFlame(state, x, y, intensity) {
  for (let i = 0; i < intensity; i++) {
    state.particles.push({
      x: x + (Math.random() - 0.5) * 14,
      y,
      vx: (Math.random() - 0.5) * 1.2,
      vy: Math.random() * 2.5 + 1.5,
      life: 1,
      decay: 0.04 + Math.random() * 0.04,
      size: Math.random() * 8 + 3,
      hue: Math.random() * 40,
    });
  }
}

function spawnMeteor(state) {
  state.meteors.push({
    x: Math.random() * W * 0.8 + 50,
    y: Math.random() * H * 0.4,
    vx: -(Math.random() * 3 + 2),
    vy: Math.random() * 1.5 + 0.5,
    life: 0,
    maxLife: 40 + Math.random() * 20,
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ── 绘制函数 ────────────────────────────────────────────

function drawBg(ctx, phase) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  const dark = phase >= 2 ? '#02010f' : '#0a0030';
  grad.addColorStop(0, dark);
  grad.addColorStop(1, phase < 2 ? '#1a0050' : '#010510');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
}

function drawStars(ctx, stars, t) {
  for (const s of stars) {
    const alpha = 0.45 + 0.55 * Math.sin(s.phase + t * s.speed);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,220,${alpha})`;
    ctx.fill();
  }
}

function drawMeteors(ctx, meteors) {
  for (const m of meteors) {
    const prog = m.life / m.maxLife;
    const alpha = prog < 0.3 ? prog / 0.3 : 1 - (prog - 0.3) / 0.7;
    const len = 32 * (1 - prog * 0.4);
    ctx.save();
    const grd = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * len / 3, m.y - m.vy * len / 3);
    grd.addColorStop(0, `rgba(255,255,255,${alpha})`);
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = grd;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - m.vx * len / 3, m.y - m.vy * len / 3);
    ctx.stroke();
    ctx.restore();
  }
}

function drawGround(ctx, phase, t) {
  if (phase > 1) return;
  const alpha = phase === 1 ? Math.max(0, 1 - t * 0.018) : 1;
  ctx.save();
  ctx.globalAlpha = alpha;
  const g = ctx.createLinearGradient(0, GROUND_Y, 0, H);
  g.addColorStop(0, '#1a4a1a');
  g.addColorStop(1, '#0a2a0a');
  ctx.fillStyle = g;
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
  // 发射台
  ctx.fillStyle = '#888';
  ctx.fillRect(W / 2 - 22, GROUND_Y - 24, 44, 28);
  ctx.fillStyle = '#aaa';
  ctx.fillRect(W / 2 - 28, GROUND_Y - 4, 56, 8);
  // 支架
  ctx.strokeStyle = '#777';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(W / 2 - 22, GROUND_Y - 20); ctx.lineTo(W / 2 - 40, GROUND_Y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W / 2 + 22, GROUND_Y - 20); ctx.lineTo(W / 2 + 40, GROUND_Y); ctx.stroke();
  ctx.restore();
}

function drawMoon(ctx, mx, my) {
  ctx.save();
  const glow = ctx.createRadialGradient(mx, my, 38, mx, my, 90);
  glow.addColorStop(0, 'rgba(255,250,180,0.25)');
  glow.addColorStop(1, 'rgba(255,250,180,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(mx, my, 90, 0, Math.PI * 2);
  ctx.fill();

  const moon = ctx.createRadialGradient(mx - 10, my - 10, 5, mx, my, 48);
  moon.addColorStop(0, '#fffde0');
  moon.addColorStop(0.6, '#f5e87a');
  moon.addColorStop(1, '#d4b800');
  ctx.fillStyle = moon;
  ctx.beginPath();
  ctx.arc(mx, my, 48, 0, Math.PI * 2);
  ctx.fill();

  const craters = [{ x: -15, y: -12, r: 9 }, { x: 14, y: 10, r: 6 }, { x: -5, y: 20, r: 5 }, { x: 20, y: -18, r: 7 }];
  for (const c of craters) {
    ctx.beginPath();
    ctx.arc(mx + c.x, my + c.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(160,120,0,0.25)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,90,0,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();
}

function drawRocket(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  // 主体
  ctx.beginPath();
  ctx.moveTo(0, -54);
  ctx.bezierCurveTo(18, -40, 20, -10, 20, 16);
  ctx.lineTo(-20, 16);
  ctx.bezierCurveTo(-20, -10, -18, -40, 0, -54);
  ctx.closePath();
  const bodyGrad = ctx.createLinearGradient(-20, 0, 20, 0);
  bodyGrad.addColorStop(0, '#c0c8ff');
  bodyGrad.addColorStop(0.5, '#ffffff');
  bodyGrad.addColorStop(1, '#8890e0');
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.strokeStyle = '#9090cc';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 舷窗
  ctx.beginPath();
  ctx.arc(0, -18, 9, 0, Math.PI * 2);
  ctx.fillStyle = '#a0eaff';
  ctx.fill();
  ctx.strokeStyle = '#7abcd0';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(-3, -21, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fill();

  // 左翼
  ctx.beginPath();
  ctx.moveTo(-20, 10);
  ctx.lineTo(-38, 30);
  ctx.lineTo(-20, 22);
  ctx.closePath();
  ctx.fillStyle = '#ff6644';
  ctx.fill();

  // 右翼
  ctx.beginPath();
  ctx.moveTo(20, 10);
  ctx.lineTo(38, 30);
  ctx.lineTo(20, 22);
  ctx.closePath();
  ctx.fillStyle = '#ff6644';
  ctx.fill();

  // 喷口
  ctx.beginPath();
  ctx.moveTo(-12, 16);
  ctx.lineTo(12, 16);
  ctx.lineTo(8, 26);
  ctx.lineTo(-8, 26);
  ctx.closePath();
  ctx.fillStyle = '#888';
  ctx.fill();

  // 装饰星
  ctx.fillStyle = '#ffdd00';
  ctx.font = 'bold 11px serif';
  ctx.textAlign = 'center';
  ctx.fillText('★', 0, 2);

  ctx.restore();
}

function drawBunny(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  const s = 0.78;
  ctx.scale(s, s);

  // 身体
  ctx.beginPath();
  ctx.ellipse(0, 6, 11, 13, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#f5f0eb';
  ctx.fill();

  // 头
  ctx.beginPath();
  ctx.ellipse(0, -14, 10, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#f5f0eb';
  ctx.fill();

  // 左耳
  ctx.beginPath();
  ctx.ellipse(-5, -28, 3.5, 9, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#f5f0eb';
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-5, -28, 1.8, 6.5, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#ffc0cb';
  ctx.fill();

  // 右耳
  ctx.beginPath();
  ctx.ellipse(5, -28, 3.5, 9, 0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#f5f0eb';
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(5, -28, 1.8, 6.5, 0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#ffc0cb';
  ctx.fill();

  // 眼睛
  ctx.beginPath();
  ctx.arc(-3.5, -16, 2, 0, Math.PI * 2);
  ctx.fillStyle = '#333';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3.5, -16, 2, 0, Math.PI * 2);
  ctx.fillStyle = '#333';
  ctx.fill();
  // 高光
  ctx.beginPath();
  ctx.arc(-2.5, -17, 0.8, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(4.5, -17, 0.8, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();

  // 鼻子
  ctx.beginPath();
  ctx.arc(0, -12, 1.5, 0, Math.PI * 2);
  ctx.fillStyle = '#ff9999';
  ctx.fill();

  // 嘴
  ctx.beginPath();
  ctx.arc(0, -10.5, 2.5, 0.2, Math.PI - 0.2);
  ctx.strokeStyle = '#d08080';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 头盔
  ctx.beginPath();
  ctx.arc(0, -14, 12, Math.PI, Math.PI * 2);
  ctx.strokeStyle = 'rgba(180,220,255,0.6)';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -14, 12, Math.PI, Math.PI * 2);
  ctx.fillStyle = 'rgba(200,235,255,0.18)';
  ctx.fill();

  // 挥手
  ctx.beginPath();
  ctx.ellipse(-14, -2, 5, 3.5, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = '#f5f0eb';
  ctx.fill();

  // 脚
  ctx.beginPath();
  ctx.ellipse(-5, 17, 5, 3.5, 0.3, 0, Math.PI * 2);
  ctx.fillStyle = '#f5f0eb';
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(5, 17, 5, 3.5, -0.3, 0, Math.PI * 2);
  ctx.fillStyle = '#f5f0eb';
  ctx.fill();

  ctx.restore();
}

function drawFlameParticles(ctx, particles) {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = p.life * 0.9;
    const hue = 10 + p.hue;
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    grd.addColorStop(0, `hsl(${hue + 20},100%,95%)`);
    grd.addColorStop(0.4, `hsl(${hue},100%,60%)`);
    grd.addColorStop(1, `hsla(${hue - 10},100%,40%,0)`);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawCredits(ctx, progress, moonX, moonY) {
  ctx.save();
  ctx.globalAlpha = Math.min(progress * 2, 1);
  drawBunny(ctx, moonX, moonY + 36);

  ctx.globalAlpha = Math.min(progress * 1.8, 0.75);
  const bx = W / 2, by = H * 0.62;
  ctx.fillStyle = 'rgba(10,5,40,0.7)';
  roundRect(ctx, bx - 170, by - 34, 340, 140, 18);
  ctx.fill();

  ctx.globalAlpha = Math.min(progress * 2.5, 1);
  ctx.textAlign = 'center';

  ctx.font = 'bold 32px "Microsoft YaHei","PingFang SC",sans-serif';
  ctx.fillStyle = '#ffe566';
  ctx.shadowColor = 'rgba(255,200,0,0.8)';
  ctx.shadowBlur = 18;
  ctx.fillText('到达月亮啦！🌙', bx, by + 8);

  ctx.font = '18px "Microsoft YaHei","PingFang SC",sans-serif';
  ctx.fillStyle = '#cce8ff';
  ctx.shadowColor = 'rgba(100,180,255,0.6)';
  ctx.shadowBlur = 10;
  ctx.fillText('小兔子完成了太空之旅', bx, by + 40);

  ctx.font = '14px "Microsoft YaHei","PingFang SC",sans-serif';
  ctx.fillStyle = 'rgba(200,200,255,0.85)';
  ctx.shadowBlur = 6;
  ctx.fillText('勇敢的小兔子，梦想成真 ✨', bx, by + 68);

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawCountdown(ctx, t) {
  const count = Math.max(0, Math.ceil((80 - t) / 27));
  if (count <= 0) return;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = 'bold 48px "Microsoft YaHei",sans-serif';
  ctx.fillStyle = `rgba(255,220,80,${0.5 + 0.5 * Math.sin(t * 0.18)})`;
  ctx.shadowColor = '#ffaa00';
  ctx.shadowBlur = 20;
  ctx.fillText(count.toString(), W / 2, H * 0.38);
  ctx.font = '18px "Microsoft YaHei",sans-serif';
  ctx.fillStyle = 'rgba(200,200,255,0.85)';
  ctx.shadowBlur = 8;
  ctx.fillText('发射倒计时…', W / 2, H * 0.38 + 36);
  ctx.restore();
}

// ── React 组件 ──────────────────────────────────────────

export default function RocketBunnyCanvas() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const stateRef = useRef(createState());
  const rafRef = useRef(null);

  const startLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;

    function tick() {
      s.t++;

      // 阶段转换
      if (s.phase === 0 && s.t > 80) s.phase = 1;
      if (s.phase === 1 && s.rocketY < -60) s.phase = 2;
      if (s.phase === 2 && s.rocketY <= s.moonY + 70) s.phase = 3;
      if (s.phase === 3 && s.rocketVY === 0) { s.phase = 4; s.t = 0; }

      // 物理
      if (s.phase === 1) {
        s.rocketVY -= 0.28;
        s.rocketY += s.rocketVY;
        emitFlame(s, s.rocketX, s.rocketY + 42, 5);
      } else if (s.phase === 2) {
        s.rocketVY -= 0.08;
        s.rocketY += s.rocketVY;
        if (s.rocketY < -100) s.rocketY = H + 80;
        emitFlame(s, s.rocketX, s.rocketY + 42, 3);
      } else if (s.phase === 3) {
        s.rocketVY = Math.max(s.rocketVY, -2.5);
        s.rocketY += s.rocketVY;
        if (s.rocketY >= s.moonY + 55) { s.rocketY = s.moonY + 55; s.rocketVY = 0; }
        emitFlame(s, s.rocketX, s.rocketY + 42, 2);
      }

      // 更新粒子
      for (const p of s.particles) { p.x += p.vx; p.y += p.vy; p.life -= p.decay; }
      s.particles = s.particles.filter(p => p.life > 0);

      // 流星
      if (s.phase >= 1 && Math.random() < 0.015) spawnMeteor(s);
      for (const m of s.meteors) { m.x += m.vx; m.y += m.vy; m.life++; }
      s.meteors = s.meteors.filter(m => m.life < m.maxLife);

      // 绘制
      drawBg(ctx, s.phase);
      drawStars(ctx, s.stars, s.t);
      drawMeteors(ctx, s.meteors);
      drawMoon(ctx, s.moonX, s.moonY);
      drawGround(ctx, s.phase, s.t);
      drawFlameParticles(ctx, s.particles);

      if (s.phase < 4) {
        drawRocket(ctx, s.rocketX, s.rocketY);
        drawBunny(ctx, s.rocketX, s.rocketY - 34);
      }

      if (s.phase === 4) drawCredits(ctx, Math.min(s.t / 80, 1), s.moonX, s.moonY);
      if (s.phase === 0) drawCountdown(ctx, s.t);

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handleRestart = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    stateRef.current = createState();
    startLoop();
  }, [startLoop]);

  useEffect(() => {
    startLoop();
    return () => cancelAnimationFrame(rafRef.current);
  }, [startLoop]);

  const btnStyle = {
    padding: '10px 28px',
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    border: '1.5px solid rgba(255,255,255,0.35)',
    borderRadius: 30,
    fontSize: 15,
    cursor: 'pointer',
    letterSpacing: 2,
  };

  return (
    <div style={{ background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 16 }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ borderRadius: 12, boxShadow: '0 0 60px rgba(120,80,255,0.4)', display: 'block' }}
      />
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => navigate('/')} style={btnStyle}>← 返回首页</button>
        <button onClick={handleRestart} style={btnStyle}>重新播放 ↺</button>
      </div>
    </div>
  );
}
