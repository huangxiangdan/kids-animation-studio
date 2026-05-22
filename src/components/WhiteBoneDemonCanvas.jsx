import { useEffect, useRef, useCallback } from 'react';
import { Application, Container, Graphics, Text, TextStyle, Sprite, Texture, BlurFilter, AlphaFilter } from 'pixi.js';
import gsap from 'gsap';

/* ============================================================
   孙悟空三打白骨精 — PixiJS + GSAP 多层场景动画
   ============================================================ */

// ── 常量 ──
const W = 800;
const H = 600;
const GROUND_Y = 480;

// ── 颜色 ──
const C = {
  skyTop: 0x1a1a4e,
  skyBot: 0x4a2c8a,
  mountain1: 0x3d2b1f,
  mountain2: 0x4a3628,
  mountain3: 0x3a2818,
  ground: 0x5a4030,
  groundDark: 0x2a1a0f,
  gold: 0xffd700,
  fire: 0xff6b00,
  white: 0xffffff,
  red: 0xff3333,
  mist: 0xc8b4a0,
  green: 0x4a8a2a,
};

// ── 分镜数据 ──
const SCENES = [
  { id: 'intro',     title: '西行路上',       text: '唐僧师徒四人走在荒山野岭，天色渐暗……',       dur: 7 },
  { id: 'disguise1', title: '第一变·村姑',     text: '白骨精变成一个美丽的村姑，提着饭篮走来……',   dur: 7 },
  { id: 'strike1',   title: '一打白骨精',      text: '悟空火眼金睛识破妖怪，金箍棒呼啸而出！',     dur: 8 },
  { id: 'disguise2', title: '第二变·老奶奶',   text: '白骨精又变成一个老奶奶，哭着来找女儿……',     dur: 7 },
  { id: 'strike2',   title: '二打白骨精',      text: '悟空再次识破，金箍棒带着雷霆之力砸下！',     dur: 8 },
  { id: 'disguise3', title: '第三变·老爷爷',   text: '白骨精变成一个老爷爷，念着经来寻妻女……',     dur: 7 },
  { id: 'strike3',   title: '三打白骨精',      text: '悟空怒喝一声，金箍棒化作万道金光，此妖必灭！', dur: 9 },
  { id: 'victory',   title: '妖怪消灭！',       text: '白骨精终于现出原形，化作一堆白骨！师父明白了悟空的苦心。', dur: 7 },
  { id: 'ending',    title: '',                text: '',                                           dur: 6 },
];

export default function WhiteBoneDemonCanvas() {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const tlRef = useRef(null);
  const stateRef = useRef({ sceneIndex: 0, playing: false, layers: {} });

  // ── 初始化 PixiJS ──
  useEffect(() => {
    if (appRef.current) return;

    const app = new Application();
    appRef.current = app;

    (async () => {
      await app.init({
        width: W,
        height: H,
        backgroundAlpha: 0,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        autoDensity: true,
      });

      if (containerRef.current) {
        containerRef.current.appendChild(app.canvas);
        app.canvas.style.width = '100%';
        app.canvas.style.height = '100%';
        app.canvas.style.objectFit = 'contain';
      }

      buildLayers(app);
    })();

    return () => {
      tlRef.current?.kill();
      app.destroy(true, { children: true });
      appRef.current = null;
    };
  }, []);

  // ── 构建多层场景 ──
  function buildLayers(app) {
    const layers = {};

    // 1) 天空背景
    layers.sky = new Graphics();
    drawSky(layers.sky, 'intro');
    app.stage.addChild(layers.sky);

    // 2) 远山层 (parallax far)
    layers.mountainsFar = new Container();
    drawMountains(layers.mountainsFar, 0.5);
    app.stage.addChild(layers.mountainsFar);

    // 3) 近山层 (parallax near)
    layers.mountainsNear = new Container();
    drawMountains(layers.mountainsNear, 1.0);
    layers.mountainsNear.y = 30;
    app.stage.addChild(layers.mountainsNear);

    // 4) 地面
    layers.ground = new Graphics();
    drawGround(layers.ground, 'intro');
    app.stage.addChild(layers.ground);

    // 5) 迷雾层
    layers.mist = new Graphics();
    drawMist(layers.mist, 'intro');
    app.stage.addChild(layers.mist);

    // 6) 角色层
    layers.characters = new Container();
    app.stage.addChild(layers.characters);

    // 7) 特效层
    layers.effects = new Container();
    app.stage.addChild(layers.effects);

    // 8) 闪电层
    layers.lightning = new Container();
    layers.lightning.visible = false;
    app.stage.addChild(layers.lightning);

    // 9) UI层 (标题/字幕)
    layers.ui = new Container();
    app.stage.addChild(layers.ui);

    // 10) 开始画面
    layers.startScreen = new Container();
    drawStartScreen(layers.startScreen, app);
    app.stage.addChild(layers.startScreen);

    stateRef.current.layers = layers;
  }

  // ── 绘制函数 ──

  function drawSky(g, phase) {
    g.clear();
    const colors = {
      intro: [0x4a3728, 0x6b4c3b, 0x8b6914, 0xa0784c],
      disguise: [0x3d2b1f, 0x5c3d2e, 0x7a5c3e, 0x9b7653],
      strike1: [0x1a0a00, 0x3a1000, 0x6b2a10, 0x8b3a10],
      strike2: [0x100500, 0x4a1500, 0x7a2a00, 0x9b3a00],
      strike3: [0x0a0000, 0x5a1000, 0x9b2000, 0xcc3300],
      victory: [0x1a3a5c, 0x2a5a3c, 0x4a8a2a, 0x6aaa4a],
      ending: [0x0a0a2e, 0x1a1a4e, 0x2a2a5e, 0x1a1a4e],
    };
    const c = colors[phase] || colors.intro;
    const h = H / (c.length - 1);
    for (let i = 0; i < c.length - 1; i++) {
      g.rect(0, h * i, W, h + 1).fill(c[i]);
    }
    // gradient overlay
    g.rect(0, 0, W, H).fill({ color: c[c.length - 1], alpha: 0.3 });
  }

  function drawMountains(container, scale) {
    container.removeChildren();
    const mts = [
      { x: -20, w: 240, h: 160, color: C.mountain1 },
      { x: 200, w: 300, h: 200, color: C.mountain2 },
      { x: 500, w: 260, h: 180, color: C.mountain3 },
      { x: 650, w: 220, h: 140, color: C.mountain1 },
    ];
    mts.forEach(m => {
      const g = new Graphics();
      g.beginPath()
        .moveTo(m.x, GROUND_Y)
        .lineTo(m.x + m.w / 2, GROUND_Y - m.h * scale)
        .lineTo(m.x + m.w, GROUND_Y)
        .closePath()
        .fill({ color: m.color, alpha: 0.6 });
      container.addChild(g);
    });
  }

  function drawGround(g, phase) {
    g.clear();
    const colors = {
      intro: [0x5a4030, 0x3d2b1f, 0x2a1a0f],
      strike: [0x5a3010, 0x3d200f, 0x2a1005],
      victory: [0x4a8a2a, 0x3a6a1a, 0x2a4a0a],
      ending: [0x1a1a3e, 0x0a0a2e, 0x050520],
    };
    const c = colors[phase] || colors.intro;
    g.rect(0, GROUND_Y, W, 40).fill(c[0]);
    g.rect(0, GROUND_Y + 40, W, 40).fill(c[1]);
    g.rect(0, GROUND_Y + 80, W, H - GROUND_Y - 80).fill(c[2]);
    // 草地线
    g.rect(0, GROUND_Y, W, 3).fill({ color: 0x7a5a3a, alpha: 0.8 });
  }

  function drawMist(g, phase) {
    g.clear();
    const alpha = phase === 'intro' ? 0.15 : phase.startsWith('strike') ? 0.3 : 0.1;
    g.rect(0, GROUND_Y - 40, W, 60).fill({ color: C.mist, alpha });
  }

  function drawStartScreen(container, app) {
    // 半透明背景
    const bg = new Graphics();
    bg.rect(0, 0, W, H).fill({ color: 0x0a0500, alpha: 0.85 });
    container.addChild(bg);

    // 标题
    const titleStyle = new TextStyle({
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      fontSize: 48,
      fontWeight: '800',
      fill: C.gold,
      letterSpacing: 6,
      dropShadow: { color: 0xffd700, alpha: 0.5, blur: 20, distance: 0 },
    });
    const title = new Text({ text: '三打白骨精', style: titleStyle });
    title.anchor.set(0.5);
    title.x = W / 2;
    title.y = H / 2 - 60;
    container.addChild(title);

    // emoji
    const emojiStyle = new TextStyle({ fontSize: 80 });
    const emoji = new Text({ text: '🐒', style: emojiStyle });
    emoji.anchor.set(0.5);
    emoji.x = W / 2;
    emoji.y = H / 2 - 150;
    container.addChild(emoji);

    // 副标题
    const subStyle = new TextStyle({
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      fontSize: 16,
      fill: 0xc8a080,
      letterSpacing: 2,
    });
    const sub = new Text({ text: '西游记经典故事', style: subStyle });
    sub.anchor.set(0.5);
    sub.x = W / 2;
    sub.y = H / 2 - 10;
    container.addChild(sub);

    // 按钮
    const btnBg = new Graphics();
    btnBg.roundRect(W / 2 - 80, H / 2 + 40, 160, 48, 24).fill({ color: 0xffd700 });
    container.addChild(btnBg);

    const btnStyle = new TextStyle({
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      fontSize: 18,
      fontWeight: '700',
      fill: 0x3d1a00,
      letterSpacing: 2,
    });
    const btnText = new Text({ text: '开始观看', style: btnStyle });
    btnText.anchor.set(0.5);
    btnText.x = W / 2;
    btnText.y = H / 2 + 64;
    container.addChild(btnText);

    // 点击事件
    btnBg.eventMode = 'static';
    btnBg.cursor = 'pointer';
    btnBg.on('pointerdown', () => startAnimation(app));
  }

  // ── 开始动画 ──
  function startAnimation(app) {
    const { layers } = stateRef.current;
    stateRef.current.playing = true;
    stateRef.current.sceneIndex = 0;

    // 隐藏开始画面
    gsap.to(layers.startScreen, { alpha: 0, duration: 0.5, onComplete: () => {
      layers.startScreen.visible = false;
    }});

    playScene(app, 0);
  }

  // ── 播放场景 ──
  function playScene(app, index) {
    if (index >= SCENES.length) {
      showEnding(app);
      return;
    }

    const scene = SCENES[index];
    const { layers } = stateRef.current;
    stateRef.current.sceneIndex = index;

    // 清理上一场景
    layers.characters.removeChildren();
    layers.effects.removeChildren();
    layers.lightning.removeChildren();
    layers.lightning.visible = false;

    // 更新背景
    const bgPhase = scene.id.startsWith('strike') ? scene.id : 
                    scene.id === 'victory' ? 'victory' :
                    scene.id === 'ending' ? 'ending' :
                    scene.id.startsWith('disguise') ? 'disguise' : 'intro';
    drawSky(layers.sky, bgPhase);
    drawGround(layers.ground, scene.id.startsWith('strike') ? 'strike' : bgPhase);
    drawMist(layers.mist, bgPhase);

    // 显示标题
    showTitle(app, scene.title);

    // 显示字幕
    showSubtitle(app, scene.text);

    // 构建场景内容
    const tl = gsap.timeline({
      onComplete: () => playScene(app, index + 1),
    });
    tlRef.current = tl;

    switch (scene.id) {
      case 'intro':     buildIntroScene(app, tl); break;
      case 'disguise1': buildDisguiseScene(app, tl, '👩‍🌾', '村姑', '🧺'); break;
      case 'strike1':   buildStrikeScene(app, tl, 1); break;
      case 'disguise2': buildDisguiseScene(app, tl, '👵', '老奶奶', '🕯️'); break;
      case 'strike2':   buildStrikeScene(app, tl, 2); break;
      case 'disguise3': buildDisguiseScene(app, tl, '👴', '老爷爷', '📿'); break;
      case 'strike3':   buildStrikeScene(app, tl, 3); break;
      case 'victory':   buildVictoryScene(app, tl); break;
      case 'ending':    buildEndingScene(app, tl); break;
    }
  }

  // ── UI 工具 ──

  function showTitle(app, title) {
    const { layers } = stateRef.current;
    layers.ui.removeChildren();
    if (!title) return;

    const bg = new Graphics();
    bg.roundRect(W / 2 - 120, 16, 240, 40, 20).fill({ color: 0x000000, alpha: 0.5 });
    layers.ui.addChild(bg);

    const style = new TextStyle({
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      fontSize: 18,
      fontWeight: '700',
      fill: C.gold,
      letterSpacing: 3,
      dropShadow: { color: C.gold, alpha: 0.5, blur: 10, distance: 0 },
    });
    const t = new Text({ text: title, style });
    t.anchor.set(0.5);
    t.x = W / 2;
    t.y = 36;
    t.alpha = 0;
    layers.ui.addChild(t);

    gsap.fromTo(t, { alpha: 0, y: 20 }, { alpha: 1, y: 36, duration: 0.6, ease: 'power2.out' });
  }

  function showSubtitle(app, text) {
    const { layers } = stateRef.current;
    if (!text) return;

    const bg = new Graphics();
    bg.roundRect(W / 2 - 280, H - 70, 560, 44, 12).fill({ color: 0x000000, alpha: 0.6 });
    layers.ui.addChild(bg);

    const style = new TextStyle({
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      fontSize: 15,
      fill: C.white,
      letterSpacing: 1,
      wordWrap: true,
      wordWrapWidth: 520,
      lineHeight: 22,
    });
    const t = new Text({ text, style });
    t.anchor.set(0.5);
    t.x = W / 2;
    t.y = H - 48;
    t.alpha = 0;
    layers.ui.addChild(t);

    gsap.fromTo(t, { alpha: 0, y: H - 30 }, { alpha: 1, y: H - 48, duration: 0.5, ease: 'power2.out' });
  }

  // ── 创建 emoji 角色 ──
  function createEmoji(text, size = 48) {
    const style = new TextStyle({ fontSize: size });
    const t = new Text({ text, style });
    t.anchor.set(0.5);
    return t;
  }

  function createNameLabel(text) {
    const style = new TextStyle({
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      fontSize: 12,
      fill: 0xffffff,
      alpha: 0.8,
      letterSpacing: 1,
    });
    const t = new Text({ text, style });
    t.anchor.set(0.5);
    return t;
  }

  // ── 场景构建 ──

  function buildIntroScene(app, tl) {
    const { layers } = stateRef.current;

    // 师徒四人
    const chars = [
      { emoji: '🧑‍🦲', name: '唐僧', x: -100 },
      { emoji: '🐒', name: '悟空', x: -40 },
      { emoji: '🐷', name: '八戒', x: 40 },
      { emoji: '🧔', name: '沙僧', x: 100 },
    ];

    const group = new Container();
    group.y = GROUND_Y - 40;

    chars.forEach((c, i) => {
      const emoji = createEmoji(c.emoji, c.emoji === '🐒' ? 56 : 48);
      emoji.x = c.x;
      emoji.y = 0;
      group.addChild(emoji);

      const label = createNameLabel(c.name);
      label.x = c.x;
      label.y = 36;
      group.addChild(label);

      // 悟空火眼金睛
      if (c.emoji === '🐒') {
        const eyes = createEmoji('👁️✨', 14);
        eyes.x = c.x + 28;
        eyes.y = -20;
        eyes.alpha = 0;
        group.addChild(eyes);
        tl.to(eyes, { alpha: 1, duration: 0.5 }, 1.5);
      }
    });

    layers.characters.addChild(group);

    // 入场动画：从左走入
    group.x = -200;
    tl.to(group, { x: W / 2, duration: 2, ease: 'power2.out' }, 0);

    // 行走弹跳
    chars.forEach((c, i) => {
      const child = group.children[i * 2]; // emoji
      tl.to(child, { y: -6, duration: 0.3, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 0.3 + i * 0.15);
    });

    // 镜头微移
    tl.to(layers.mountainsFar, { x: -10, duration: 3, ease: 'sine.inOut' }, 0);
    tl.to(layers.mountainsNear, { x: -20, duration: 3, ease: 'sine.inOut' }, 0);
  }

  function buildDisguiseScene(app, tl, demonEmoji, demonName, propEmoji) {
    const { layers } = stateRef.current;

    // 悟空（左侧）
    const wukong = new Container();
    wukong.x = 200;
    wukong.y = GROUND_Y - 40;
    const wkEmoji = createEmoji('🐒', 56);
    wukong.addChild(wkEmoji);
    const wkLabel = createNameLabel('悟空');
    wkLabel.y = 36;
    wukong.addChild(wkLabel);
    // 火眼金睛
    const eyes = createEmoji('👁️✨', 16);
    eyes.x = 28;
    eyes.y = -20;
    wukong.addChild(eyes);
    layers.characters.addChild(wukong);

    // 妖怪伪装（右侧）
    const demon = new Container();
    demon.x = 650;
    demon.y = GROUND_Y - 40;
    const dEmoji = createEmoji(demonEmoji, 56);
    demon.addChild(dEmoji);
    const dLabel = createNameLabel(demonName);
    dLabel.y = 36;
    demon.addChild(dLabel);
    // 道具
    const prop = createEmoji(propEmoji, 24);
    prop.x = -24;
    prop.y = 10;
    demon.addChild(prop);
    // 妖气光环
    const aura = new Graphics();
    aura.circle(0, 0, 50).fill({ color: 0xff3333, alpha: 0.1 });
    demon.addChildAt(aura, 0);
    layers.characters.addChild(demon);

    // 悟空入场
    wukong.x = 100;
    wukong.alpha = 0;
    tl.to(wukong, { x: 200, alpha: 1, duration: 0.8, ease: 'back.out(1.2)' }, 0);

    // 妖怪从右走来
    tl.to(demon, { x: 550, duration: 2, ease: 'power2.out' }, 0.5);

    // 妖气闪烁
    tl.to(aura, { alpha: 0.3, duration: 0.8, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 1);

    // 火眼金睛发光
    tl.to(eyes, { alpha: 1, duration: 0.3 }, 1.5);
    tl.fromTo(eyes, { scaleX: 1, scaleY: 1 }, { scaleX: 1.3, scaleY: 1.3, duration: 0.4, yoyo: true, repeat: 2, ease: 'sine.inOut' }, 1.5);

    // 思考气泡 "是妖怪！"
    const bubble = new Container();
    const bubbleBg = new Graphics();
    bubbleBg.roundRect(-50, -20, 100, 36, 18).fill({ color: 0xffffff, alpha: 0.95 });
    bubble.addChild(bubbleBg);
    const bubbleText = new Text({
      text: '是妖怪！',
      style: new TextStyle({
        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        fontSize: 16,
        fontWeight: '700',
        fill: 0xd32f2f,
        letterSpacing: 2,
      }),
    });
    bubbleText.anchor.set(0.5);
    bubble.addChild(bubbleText);
    bubble.x = 250;
    bubble.y = GROUND_Y - 120;
    bubble.scale.set(0);
    layers.characters.addChild(bubble);

    tl.to(bubble, { pixi: { scaleX: 1.1, scaleY: 1.1 }, duration: 0.3, ease: 'back.out(2)' }, 2.5);
    tl.to(bubble, { pixi: { scaleX: 1, scaleY: 1 }, duration: 0.15 }, 2.8);

    // 道具摇摆
    tl.to(prop, { rotation: 0.2, duration: 0.5, yoyo: true, repeat: 4, ease: 'sine.inOut' }, 1);

    // 妖怪轻微摇摆
    tl.to(dEmoji, { rotation: 0.05, duration: 1, yoyo: true, repeat: 2, ease: 'sine.inOut' }, 1);
  }

  function buildStrikeScene(app, tl, strikeNum) {
    const { layers } = stateRef.current;
    const intensity = strikeNum; // 1, 2, 3

    // ── 闪电 ──
    layers.lightning.visible = true;
    const boltCount = 2 + strikeNum;
    for (let i = 0; i < boltCount; i++) {
      const bolt = new Graphics();
      const x = 100 + (i * (W - 200) / boltCount);
      bolt.beginPath()
        .moveTo(x, 0)
        .lineTo(x - 15, 80)
        .lineTo(x + 10, 85)
        .lineTo(x - 20, 180)
        .lineTo(x + 5, 185)
        .lineTo(x - 10, GROUND_Y)
        .closePath()
        .stroke({ color: 0xffe664, width: 3, alpha: 0.9 });
      // glow
      bolt.beginPath()
        .moveTo(x, 0)
        .lineTo(x - 15, 80)
        .lineTo(x + 10, 85)
        .lineTo(x - 20, 180)
        .lineTo(x + 5, 185)
        .lineTo(x - 10, GROUND_Y)
        .closePath()
        .stroke({ color: 0xffffff, width: 6, alpha: 0.4 });
      layers.lightning.addChild(bolt);
    }

    // 闪电闪烁
    for (let flash = 0; flash < 3 + intensity; flash++) {
      tl.to(layers.lightning, { alpha: 1, duration: 0.05 }, 0.5 + flash * 0.2);
      tl.to(layers.lightning, { alpha: 0, duration: 0.1 }, 0.55 + flash * 0.2);
    }

    // ── 悟空战斗姿态 ──
    const wukong = new Container();
    wukong.x = 150;
    wukong.y = GROUND_Y - 60;
    wukong.alpha = 0;

    // 战斗光环
    const aura = new Graphics();
    aura.circle(0, 0, 60).fill({ color: C.gold, alpha: 0.15 });
    wukong.addChild(aura);

    const wkEmoji = createEmoji('🐒', 72);
    wukong.addChild(wkEmoji);

    // 战吼
    const shouts = ['嘿！', '哈！', '灭！'];
    const shoutText = new Text({
      text: shouts[strikeNum - 1],
      style: new TextStyle({
        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        fontSize: 28,
        fontWeight: '900',
        fill: C.gold,
        letterSpacing: 4,
        dropShadow: { color: 0x8b4513, blur: 2, distance: 2 },
      }),
    });
    shoutText.anchor.set(0.5);
    shoutText.y = -50;
    shoutText.alpha = 0;
    wukong.addChild(shoutText);

    // 金箍棒
    const club = new Container();
    const clubGlow = new Graphics();
    clubGlow.circle(0, 0, 30).fill({ color: C.gold, alpha: 0.4 });
    club.addChild(clubGlow);
    const clubHead = createEmoji('🔱', 48);
    club.addChild(clubHead);
    const clubShaft = new Graphics();
    clubShaft.rect(-50, -3, 50, 6).fill({ color: C.gold, alpha: 0.8 });
    club.addChild(clubShaft);
    club.x = 40;
    club.y = -10;
    club.rotation = -1.5;
    club.scale.set(0);
    wukong.addChild(club);

    layers.characters.addChild(wukong);

    // 悟空入场
    tl.to(wukong, { alpha: 1, duration: 0.1 }, 0);
    tl.fromTo(wukong, { x: 50, y: GROUND_Y - 20, rotation: -0.5, scale: 0.5 },
      { x: 200, y: GROUND_Y - 60, rotation: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, 0);

    // 战吼弹出
    tl.to(shoutText, { alpha: 1, duration: 0.2, ease: 'back.out(2)' }, 0.3);
    tl.fromTo(shoutText, { scale: 0.3 }, { scale: 1.2, duration: 0.2, ease: 'back.out(2)' }, 0.3);
    tl.to(shoutText, { scale: 1, duration: 0.1 }, 0.5);

    // 金箍棒挥出
    tl.to(club, { rotation: 0.3, scale: 1.3, duration: 0.3, ease: 'power3.out' }, 0.4);
    tl.to(club, { rotation: 0.15, scale: 1.1, duration: 0.2 }, 0.7);

    // 光环脉动
    tl.to(aura, { alpha: 0.4, duration: 0.3, yoyo: true, repeat: 3 + intensity, ease: 'sine.inOut' }, 0.3);

    // ── 妖怪被击中 ──
    const demonEmojis = ['👩‍🌾', '👵', '👴'];
    const demon = new Container();
    demon.x = 550;
    demon.y = GROUND_Y - 50;
    const dEmoji = createEmoji(demonEmojis[strikeNum - 1], 52);
    demon.addChild(dEmoji);
    layers.characters.addChild(demon);

    // 妖怪被击飞
    const knockback = 100 + intensity * 50;
    tl.to(demon, { x: demon.x + knockback, y: demon.y - 80, alpha: 0, rotation: 0.5, scale: 0.3, duration: 0.6, ease: 'power2.in' }, 0.8);

    // 骷髅闪现
    const skeleton = createEmoji('💀', 44);
    skeleton.x = 550;
    skeleton.y = GROUND_Y - 50;
    skeleton.alpha = 0;
    layers.effects.addChild(skeleton);
    tl.to(skeleton, { alpha: 1, duration: 0.1 }, 0.9);
    tl.fromTo(skeleton, { scale: 0.5 }, { scale: 1.3, duration: 0.2, ease: 'back.out(2)' }, 0.9);
    if (strikeNum < 3) {
      tl.to(skeleton, { alpha: 0, y: GROUND_Y - 120, duration: 0.5 }, 1.2);
    }

    // ── 爆炸特效 ──
    const impactX = 520;
    const impactY = GROUND_Y - 60;

    // 冲击波
    for (let r = 0; r < 2 + intensity; r++) {
      const ring = new Graphics();
      ring.circle(0, 0, 10).stroke({ color: C.gold, width: 3, alpha: 0.8 });
      ring.x = impactX;
      ring.y = impactY;
      ring.scale.set(0);
      layers.effects.addChild(ring);
      tl.to(ring, { pixi: { scaleX: 8 + r * 3, scaleY: 8 + r * 3 }, alpha: 0, duration: 0.6 + r * 0.1, ease: 'power2.out' }, 0.8 + r * 0.1);
    }

    // 火花粒子
    const sparkCount = 8 + intensity * 4;
    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 / sparkCount) * i;
      const dist = 60 + intensity * 30;
      const spark = new Graphics();
      spark.circle(0, 0, 2 + intensity).fill({ color: i % 3 === 0 ? C.gold : i % 3 === 1 ? C.fire : C.white });
      spark.x = impactX;
      spark.y = impactY;
      layers.effects.addChild(spark);
      tl.to(spark, {
        x: impactX + Math.cos(angle) * dist,
        y: impactY + Math.sin(angle) * dist,
        alpha: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, 0.8 + Math.random() * 0.1);
    }

    // 烟雾
    const smokeCount = 4 + intensity * 2;
    for (let i = 0; i < smokeCount; i++) {
      const smoke = new Graphics();
      smoke.circle(0, 0, 15 + Math.random() * 10).fill({ color: 0x504030, alpha: 0.5 });
      smoke.x = impactX + (Math.random() - 0.5) * 40;
      smoke.y = impactY;
      smoke.scale.set(0.3);
      layers.effects.addChild(smoke);
      tl.to(smoke, {
        pixi: { scaleX: 3, scaleY: 3 },
        y: impactY - 60 - Math.random() * 40,
        alpha: 0,
        duration: 1,
        ease: 'power2.out',
      }, 0.9 + i * 0.08);
    }

    // ── 屏幕震动 ──
    const stage = app.stage;
    const shakeIntensity = 3 + intensity * 2;
    for (let s = 0; s < 5 + intensity * 2; s++) {
      tl.to(stage, { x: (Math.random() - 0.5) * shakeIntensity, y: (Math.random() - 0.5) * shakeIntensity, duration: 0.05 }, 0.8 + s * 0.05);
    }
    tl.to(stage, { x: 0, y: 0, duration: 0.1 }, 0.8 + (5 + intensity * 2) * 0.05);

    // ── 第三打特殊效果 ──
    if (strikeNum === 3) {
      // 能量波
      for (let w = 0; w < 3; w++) {
        const wave = new Graphics();
        wave.circle(0, 0, 10).stroke({ color: C.gold, width: 2, alpha: 0.5 });
        wave.x = impactX;
        wave.y = impactY;
        wave.scale.set(0);
        layers.effects.addChild(wave);
        tl.to(wave, { pixi: { scaleX: 30, scaleY: 30 }, alpha: 0, duration: 1.5, ease: 'power2.out' }, 1 + w * 0.3);
      }

      // 骨头飞散
      const bones = ['🦴', '💀', '🦴', '🦴', '💀', '🦴'];
      bones.forEach((b, i) => {
        const bone = createEmoji(b, 28);
        bone.x = impactX;
        bone.y = impactY;
        bone.alpha = 0;
        layers.effects.addChild(bone);
        const angle = (Math.PI * 2 / bones.length) * i;
        tl.to(bone, { alpha: 1, duration: 0.1 }, 1.2);
        tl.to(bone, {
          x: impactX + Math.cos(angle) * (80 + Math.random() * 60),
          y: impactY + Math.sin(angle) * (80 + Math.random() * 60) - 40,
          alpha: 0,
          rotation: Math.random() * Math.PI * 2,
          duration: 1,
          ease: 'power2.out',
        }, 1.3);
      });

      // 净化光柱
      const purify = new Graphics();
      purify.rect(impactX - 40, 0, 80, H).fill({ color: C.gold, alpha: 0 });
      layers.effects.addChild(purify);
      tl.to(purify, { alpha: 0.4, duration: 0.3 }, 1.5);
      tl.to(purify, { alpha: 0, duration: 1 }, 1.8);
    }

    // 逃跑烟雾（非第三打）
    if (strikeNum < 3) {
      const escape = createEmoji('💨💨💨', 24);
      escape.x = 600;
      escape.y = GROUND_Y - 80;
      escape.alpha = 0;
      layers.effects.addChild(escape);
      tl.to(escape, { alpha: 1, y: GROUND_Y - 200, duration: 0.8, ease: 'power2.in' }, 1.5);
      tl.to(escape, { alpha: 0, duration: 0.3 }, 2.0);
    }
  }

  function buildVictoryScene(app, tl) {
    const { layers } = stateRef.current;

    // 悟空
    const wukong = new Container();
    wukong.x = W / 2 - 60;
    wukong.y = GROUND_Y - 40;
    const wkEmoji = createEmoji('🐒', 56);
    wukong.addChild(wkEmoji);
    const wkLabel = createNameLabel('悟空');
    wkLabel.y = 36;
    wukong.addChild(wkLabel);
    layers.characters.addChild(wukong);

    // 唐僧
    const monk = new Container();
    monk.x = W / 2 + 60;
    monk.y = GROUND_Y - 40;
    const mkEmoji = createEmoji('🧑‍🦲', 48);
    monk.addChild(mkEmoji);
    const mkLabel = createNameLabel('唐僧');
    mkLabel.y = 36;
    monk.addChild(mkLabel);
    layers.characters.addChild(monk);

    // 入场
    wukong.alpha = 0;
    monk.alpha = 0;
    tl.to(wukong, { alpha: 1, duration: 0.5 }, 0);
    tl.to(monk, { alpha: 1, duration: 0.5 }, 0.3);

    // 悟空跳跃庆祝
    tl.to(wkEmoji, { y: -15, duration: 0.4, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 0.5);

    // 唐僧点头
    tl.to(mkEmoji, { rotation: 0.1, duration: 0.5, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 1);

    // 白骨堆
    const bones = new Container();
    bones.x = W / 2 + 200;
    bones.y = GROUND_Y - 20;
    const bone1 = createEmoji('💀', 32);
    bone1.y = -10;
    bones.addChild(bone1);
    const bone2 = createEmoji('🦴', 24);
    bone2.x = -20;
    bone2.y = 10;
    bones.addChild(bone2);
    const bone3 = createEmoji('🦴', 24);
    bone3.x = 20;
    bone3.y = 10;
    bones.addChild(bone3);
    bones.alpha = 0;
    layers.characters.addChild(bones);
    tl.to(bones, { alpha: 0.6, duration: 0.5 }, 1);

    // 烟花
    for (let f = 0; f < 6; f++) {
      const fw = new Container();
      fw.x = 100 + f * 120;
      fw.y = 100 + Math.random() * 100;
      fw.alpha = 0;
      const sparkCount = 8;
      for (let s = 0; s < sparkCount; s++) {
        const spark = new Graphics();
        spark.circle(0, 0, 3).fill({ color: [C.gold, C.fire, C.white, 0xff6b6b][s % 4] });
        fw.addChild(spark);
        const angle = (Math.PI * 2 / sparkCount) * s;
        tl.to(spark, {
          x: Math.cos(angle) * 40,
          y: Math.sin(angle) * 40,
          alpha: 0,
          duration: 0.8,
          ease: 'power2.out',
        }, 1.5 + f * 0.3 + s * 0.03);
      }
      layers.effects.addChild(fw);
      tl.to(fw, { alpha: 1, duration: 0.1 }, 1.5 + f * 0.3);
      tl.to(fw, { alpha: 0, duration: 0.5 }, 2 + f * 0.3);
    }

    // 星星
    for (let i = 0; i < 12; i++) {
      const star = createEmoji('⭐', 16);
      star.x = W / 2 - 150 + Math.random() * 300;
      star.y = GROUND_Y - 100 - Math.random() * 80;
      star.alpha = 0;
      layers.effects.addChild(star);
      tl.to(star, { alpha: 1, duration: 0.3 }, 1 + i * 0.1);
      tl.to(star, { y: star.y - 15, alpha: 0.4, duration: 0.8, yoyo: true, repeat: 2, ease: 'sine.inOut' }, 1.3 + i * 0.1);
    }
  }

  function buildEndingScene(app, tl) {
    const { layers } = stateRef.current;
    layers.characters.removeChildren();
    layers.effects.removeChildren();

    // 标题
    const title = new Text({
      text: '三打白骨精',
      style: new TextStyle({
        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        fontSize: 48,
        fontWeight: '800',
        fill: C.gold,
        letterSpacing: 8,
        dropShadow: { color: C.gold, alpha: 0.5, blur: 30, distance: 0 },
      }),
    });
    title.anchor.set(0.5);
    title.x = W / 2;
    title.y = H / 2 - 80;
    title.alpha = 0;
    title.scale.set(0.8);
    layers.ui.addChild(title);

    // 分隔
    const divider = new Text({
      text: '✦ ✦ ✦',
      style: new TextStyle({ fontSize: 20, fill: 0xc8a050, letterSpacing: 8 }),
    });
    divider.anchor.set(0.5);
    divider.x = W / 2;
    divider.y = H / 2 - 20;
    divider.alpha = 0;
    layers.ui.addChild(divider);

    // 寓意
    const moral1 = new Text({
      text: '火眼金睛辨真假',
      style: new TextStyle({
        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        fontSize: 24,
        fontWeight: '600',
        fill: C.white,
        letterSpacing: 4,
      }),
    });
    moral1.anchor.set(0.5);
    moral1.x = W / 2;
    moral1.y = H / 2 + 20;
    moral1.alpha = 0;
    layers.ui.addChild(moral1);

    const moral2 = new Text({
      text: '正义勇敢护师父',
      style: new TextStyle({
        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        fontSize: 24,
        fontWeight: '600',
        fill: C.white,
        letterSpacing: 4,
      }),
    });
    moral2.anchor.set(0.5);
    moral2.x = W / 2;
    moral2.y = H / 2 + 55;
    moral2.alpha = 0;
    layers.ui.addChild(moral2);

    // 角色行
    const charEmojis = ['🐒', '🧑‍🦲', '🐷', '🧔'];
    const charRow = new Container();
    charEmojis.forEach((e, i) => {
      const c = createEmoji(e, 40);
      c.x = i * 50 - 75;
      charRow.addChild(c);
    });
    charRow.x = W / 2;
    charRow.y = H / 2 + 110;
    charRow.alpha = 0;
    layers.ui.addChild(charRow);

    // 动画
    tl.to(title, { alpha: 1, pixi: { scaleX: 1, scaleY: 1 }, duration: 1, ease: 'power2.out' }, 0);
    tl.to(divider, { alpha: 0.5, duration: 0.8 }, 0.5);
    tl.to(moral1, { alpha: 1, duration: 0.8 }, 1);
    tl.to(moral2, { alpha: 1, duration: 0.8 }, 1.3);
    tl.to(charRow, { alpha: 1, duration: 0.8 }, 1.8);

    // 角色弹跳
    charRow.children.forEach((c, i) => {
      tl.to(c, { y: -10, duration: 0.5, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 2 + i * 0.15);
    });
  }

  function showEnding(app) {
    const { layers } = stateRef.current;
    stateRef.current.playing = false;

    // 显示重播按钮
    const replayContainer = new Container();
    const bg = new Graphics();
    bg.roundRect(W / 2 - 80, H / 2 + 60, 160, 48, 24).fill({ color: 0xff6b6b });
    replayContainer.addChild(bg);

    const btnText = new Text({
      text: '再看一遍',
      style: new TextStyle({
        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        fontSize: 18,
        fontWeight: '700',
        fill: C.white,
        letterSpacing: 1,
      }),
    });
    btnText.anchor.set(0.5);
    btnText.x = W / 2;
    btnText.y = H / 2 + 84;
    replayContainer.addChild(btnText);

    replayContainer.alpha = 0;
    layers.ui.addChild(replayContainer);

    gsap.to(replayContainer, { alpha: 1, duration: 0.5, delay: 1 });

    bg.eventMode = 'static';
    bg.cursor = 'pointer';
    bg.on('pointerdown', () => {
      // 重播
      replayContainer.destroy();
      layers.ui.removeChildren();
      layers.characters.removeChildren();
      layers.effects.removeChildren();
      stateRef.current.sceneIndex = 0;
      stateRef.current.playing = true;
      playScene(app, 0);
    });
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100vh',
      background: '#050510',
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
    }}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          maxWidth: '800px',
          height: '100vh',
          maxHeight: '600px',
          overflow: 'hidden',
          borderRadius: '12px',
          boxShadow: '0 0 60px rgba(139, 69, 19, 0.3)',
        }}
      />
    </div>
  );
}
