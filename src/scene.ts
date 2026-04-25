import {
  Application,
  Container,
  Graphics,
  FillGradient,
  Ticker,
  FederatedPointerEvent,
} from 'pixi.js';
import { gsap } from 'gsap';
import {
  makeKnight,
  makeSlime,
  makeCastle,
  makeMushroom,
  makeTree,
  makeMoon,
  makeStar,
  makeMountainRange,
  makePixiLogo,
} from './pixel-art';
import { makeNavBar, makeHeroText } from './ui';

export class Scene {
  private app: Application;

  // Backdrop layers
  private outerBg = new Graphics();

  // Browser-window frame
  private root = new Container();
  private windowShadow = new Graphics();
  private windowFrame = new Graphics();

  // Content (clipped to the window)
  private contentClip = new Container();
  private contentMask = new Graphics();
  private innerBg = new Graphics();
  private starsLayer = new Container();
  private mountainsFar = new Container();
  private mountainsNear = new Container();
  private moon = makeMoon(34);
  private castle = makeCastle(4);

  // Foreground (game scene props)
  private foreground = new Container();
  private platform = new Graphics();
  private knight = makeKnight(4);
  private slime = makeSlime(4);
  private mushroom = makeMushroom(3);
  private trees: Container[] = [];

  // UI overlay
  private logo = makePixiLogo(7);
  private heroBlock = makeHeroText({});
  private navContainer?: Container;
  private navHeight = 44;

  // Parallax
  private parallaxTarget = { x: 0, y: 0 };
  private parallax = { x: 0, y: 0 };

  private masterTimeline?: gsap.core.Timeline;

  constructor(app: Application) {
    this.app = app;
    this.app.stage.addChild(this.outerBg);
    this.app.stage.addChild(this.root);

    this.root.addChild(this.windowShadow);
    this.root.addChild(this.windowFrame);
    this.root.addChild(this.contentClip);

    this.contentClip.addChild(this.contentMask);
    this.contentClip.mask = this.contentMask;

    this.contentClip.addChild(this.innerBg);
    this.contentClip.addChild(this.starsLayer);
    this.contentClip.addChild(this.mountainsFar);
    this.contentClip.addChild(this.mountainsNear);
    this.contentClip.addChild(this.moon);
    this.contentClip.addChild(this.castle);
    this.contentClip.addChild(this.foreground);

    this.foreground.addChild(this.platform);
    for (let i = 0; i < 3; i++) {
      const t = makeTree(3);
      this.trees.push(t);
      this.foreground.addChild(t);
    }
    this.foreground.addChild(this.knight);
    this.foreground.addChild(this.slime);
    this.foreground.addChild(this.mushroom);

    // Hero / logo on top
    this.contentClip.addChild(this.logo);
    this.contentClip.addChild(this.heroBlock.container);

    // Wire primary CTA to a confetti burst
    this.heroBlock.primary.on('pointertap', () => this.spawnBurst(this.heroBlock.primary));

    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = this.app.screen;
    this.app.stage.on('pointermove', (e: FederatedPointerEvent) => {
      const w = this.app.screen.width;
      const h = this.app.screen.height;
      this.parallaxTarget.x = (e.global.x / w - 0.5) * 18;
      this.parallaxTarget.y = (e.global.y / h - 0.5) * 10;
    });

    Ticker.shared.add(this.tick, this);
  }

  layout(width: number, height: number) {
    // Outer pink/lavender gradient — the "wallpaper" behind the browser window
    this.outerBg.clear();
    const outerGrad = new FillGradient(0, 0, width, height);
    outerGrad.addColorStop(0, '#f4c1d2');
    outerGrad.addColorStop(0.5, '#d3a3c8');
    outerGrad.addColorStop(1, '#a89bc8');
    this.outerBg.rect(0, 0, width, height).fill(outerGrad);

    // Compute "browser window" frame size
    const padding = Math.max(40, Math.min(width, height) * 0.06);
    const frameW = Math.min(width - padding * 2, 1200);
    const frameH = Math.min(height - padding * 2, 720);
    const frameX = (width - frameW) / 2;
    const frameY = (height - frameH) / 2;

    // Soft drop shadow
    this.windowShadow.clear();
    for (let i = 8; i > 0; i--) {
      this.windowShadow
        .roundRect(frameX - i * 1.5, frameY - i + 6, frameW + i * 3, frameH + i * 3, 16 + i)
        .fill({ color: '#3a1230', alpha: 0.05 });
    }

    // Window outer (gives a thin border)
    this.windowFrame.clear();
    this.windowFrame.roundRect(frameX, frameY, frameW, frameH, 16).fill({ color: '#0e0a18' });
    this.windowFrame
      .roundRect(frameX, frameY, frameW, frameH, 16)
      .stroke({ color: '#1a1428', width: 2, alpha: 0.8 });

    // Content container at the frame top-left and masked to its rect
    this.contentClip.x = frameX;
    this.contentClip.y = frameY;
    this.contentMask.clear();
    this.contentMask.roundRect(0, 0, frameW, frameH, 16).fill({ color: 0xffffff });

    // Sky gradient inside the window
    this.innerBg.clear();
    const sky = new FillGradient(0, 0, 0, frameH);
    sky.addColorStop(0, '#1a1030');
    sky.addColorStop(0.5, '#3a1f54');
    sky.addColorStop(0.85, '#65324f');
    sky.addColorStop(1, '#9a4756');
    this.innerBg.rect(0, 0, frameW, frameH).fill(sky);

    // Mountains
    const mountainBaseY = frameH * 0.78;
    this.mountainsFar.removeChildren();
    const farRange = makeMountainRange(frameW * 1.1, frameH * 0.32, '#2a1838');
    farRange.x = -frameW * 0.05;
    farRange.y = mountainBaseY - frameH * 0.32;
    farRange.alpha = 0.9;
    this.mountainsFar.addChild(farRange);

    this.mountainsNear.removeChildren();
    const nearRange = makeMountainRange(frameW * 1.1, frameH * 0.22, '#1a0f28');
    nearRange.x = -frameW * 0.05;
    nearRange.y = mountainBaseY - frameH * 0.22 + 30;
    this.mountainsNear.addChild(nearRange);

    // Stars
    this.buildStars(frameW, frameH);

    // Moon (right side, mid-sky)
    this.moon.x = frameW * 0.66;
    this.moon.y = frameH * 0.22;

    // Castle on a ridge
    this.castle.x = frameW * 0.74;
    this.castle.y = mountainBaseY + 8;
    const castleScale = Math.min(1, frameW / 1100);
    this.castle.scale.set(castleScale);

    // Foreground platform — green grass strip
    this.platform.clear();
    const grassTop = mountainBaseY + 4;
    this.platform.rect(0, grassTop, frameW, 14).fill({ color: '#2f6d3a' });
    this.platform.rect(0, grassTop + 14, frameW, frameH - grassTop - 14).fill({ color: '#3b2818' });
    for (let x = 0; x < frameW; x += 12) {
      const tuftH = 2 + Math.floor(Math.random() * 4);
      this.platform
        .rect(x + Math.floor(Math.random() * 4), grassTop - tuftH, 4, tuftH)
        .fill({ color: '#3f8b48' });
    }

    // Knight & friends
    const groundY = grassTop + 4;
    this.knight.x = frameW * 0.6;
    this.knight.y = groundY;
    this.knight.scale.set(1.15);

    this.slime.x = frameW * 0.7;
    this.slime.y = groundY;

    this.mushroom.x = frameW * 0.83;
    this.mushroom.y = groundY;

    const treeXs = [0.04, 0.15, 0.92];
    this.trees.forEach((t, i) => {
      t.x = frameW * treeXs[i];
      t.y = groundY;
      t.scale.set(0.9 + (i === 1 ? 0.3 : 0));
    });

    // Nav bar (rebuild for new width)
    if (this.navContainer) {
      this.navContainer.destroy({ children: true });
    }
    const nav = makeNavBar(frameW);
    this.navContainer = nav.container;
    this.navHeight = nav.height;
    this.contentClip.addChild(this.navContainer);
    this.navContainer.x = 0;
    this.navContainer.y = 0;

    // Logo & hero text
    const logoScale = Math.min(1, frameW / 1100);
    this.logo.scale.set(logoScale);
    this.logo.x = Math.max(48, frameW * 0.06);
    this.logo.y = this.navHeight + Math.max(40, frameH * 0.13);

    const hero = this.heroBlock;
    const leftX = this.logo.x;
    const baseY = this.logo.y + this.logo.height + 20;
    hero.subtitle.x = leftX;
    hero.subtitle.y = baseY;
    hero.body.x = leftX;
    hero.body.y = baseY + hero.subtitle.height + 18;

    hero.primary.x = leftX;
    hero.primary.y = hero.body.y + hero.body.height + 28;
    hero.secondary.x = hero.primary.x + hero.primary.width + 14;
    hero.secondary.y = hero.primary.y;

    hero.container.x = 0;
    hero.container.y = 0;
  }

  private buildStars(frameW: number, frameH: number) {
    // Kill existing twinkles
    for (const child of this.starsLayer.children) {
      gsap.killTweensOf(child);
    }
    this.starsLayer.removeChildren();
    const skyHeight = frameH * 0.55;
    const count = Math.floor((frameW * skyHeight) / 7000);
    for (let i = 0; i < count; i++) {
      const star = makeStar(2 + Math.random() * 1.5, '#ffffff');
      star.x = Math.random() * frameW;
      star.y = Math.random() * skyHeight;
      star.alpha = 0.4 + Math.random() * 0.5;
      this.starsLayer.addChild(star);
      gsap.to(star, {
        alpha: 0.15,
        duration: 0.8 + Math.random() * 1.6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: Math.random() * 2,
      });
    }
  }

  start() {
    // Idle animations (loops)
    gsap.to(this.knight, {
      y: '-=4',
      duration: 0.9,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
    gsap.to(this.slime, {
      y: '-=8',
      duration: 0.55,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut',
    });
    gsap.to(this.slime.scale, {
      x: 1.08,
      y: 0.92,
      duration: 0.55,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut',
    });
    gsap.to(this.moon, {
      y: '+=4',
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
    gsap.to(this.castle, {
      y: '+=2',
      duration: 6,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    // Intro timeline. gsap.set is used for the initial state so it always
    // applies even if some property assignment was racing layout(). A
    // setTimeout/onComplete fallback then guarantees the hero is visible.
    this.masterTimeline?.kill();
    const tl = gsap.timeline({
      onComplete: () => this.snapVisible(),
    });
    this.masterTimeline = tl;

    const logoTargetY = this.logo.y;

    gsap.set(this.logo, { alpha: 0, y: logoTargetY + 24 });
    gsap.set(this.heroBlock.subtitle, { alpha: 0, x: this.heroBlock.subtitle.x - 24 });
    gsap.set(this.heroBlock.body, { alpha: 0, x: this.heroBlock.body.x - 24 });
    gsap.set(this.heroBlock.primary, { alpha: 0 });
    gsap.set(this.heroBlock.primary.scale, { x: 0.85, y: 0.85 });
    gsap.set(this.heroBlock.secondary, { alpha: 0 });
    gsap.set(this.heroBlock.secondary.scale, { x: 0.85, y: 0.85 });
    if (this.navContainer) {
      gsap.set(this.navContainer, { alpha: 0, y: this.navContainer.y - 14 });
      tl.to(
        this.navContainer,
        { alpha: 1, y: '+=14', duration: 0.5, ease: 'power2.out' },
        0,
      );
    }

    tl.to(this.logo, { alpha: 1, y: logoTargetY, duration: 0.7, ease: 'back.out(1.5)' }, 0.1);
    tl.to(
      this.heroBlock.subtitle,
      { alpha: 1, x: '+=24', duration: 0.45, ease: 'power2.out' },
      0.55,
    );
    tl.to(
      this.heroBlock.body,
      { alpha: 1, x: '+=24', duration: 0.45, ease: 'power2.out' },
      0.7,
    );
    tl.to(this.heroBlock.primary, { alpha: 1, duration: 0.4 }, 0.95);
    tl.to(
      this.heroBlock.primary.scale,
      { x: 1, y: 1, duration: 0.5, ease: 'back.out(2)' },
      0.95,
    );
    tl.to(this.heroBlock.secondary, { alpha: 1, duration: 0.4 }, 1.05);
    tl.to(
      this.heroBlock.secondary.scale,
      { x: 1, y: 1, duration: 0.5, ease: 'back.out(2)' },
      1.05,
    );

    // Belt-and-braces fallback in case the timeline gets killed by a resize
    // before it can finish.
    setTimeout(() => this.snapVisible(), 2200);
  }

  /** Force every animated UI element to its visible end-state. */
  private snapVisible() {
    this.logo.alpha = 1;
    this.heroBlock.subtitle.alpha = 1;
    this.heroBlock.body.alpha = 1;
    this.heroBlock.primary.alpha = 1;
    this.heroBlock.primary.scale.set(1);
    this.heroBlock.secondary.alpha = 1;
    this.heroBlock.secondary.scale.set(1);
    if (this.navContainer) this.navContainer.alpha = 1;
  }

  private tick = () => {
    // Smoothed parallax for sky layers
    this.parallax.x += (this.parallaxTarget.x - this.parallax.x) * 0.05;
    this.parallax.y += (this.parallaxTarget.y - this.parallax.y) * 0.05;

    this.mountainsFar.x = -this.parallax.x * 0.4;
    this.mountainsFar.y = -this.parallax.y * 0.2;
    this.mountainsNear.x = -this.parallax.x * 0.7;
    this.mountainsNear.y = -this.parallax.y * 0.3;
    this.starsLayer.x = -this.parallax.x * 0.15;
    this.starsLayer.y = -this.parallax.y * 0.1;
  };

  private spawnBurst(at: Container) {
    const bounds = at.getBounds();
    const cx = bounds.x + bounds.width / 2 - this.contentClip.x;
    const cy = bounds.y + bounds.height / 2 - this.contentClip.y;
    const colors = [0xff4760, 0xffb8c4, 0xffe9b0, 0xff7a8b];
    for (let i = 0; i < 18; i++) {
      const p = new Graphics();
      p.rect(-3, -3, 6, 6).fill({ color: colors[i % colors.length] });
      p.x = cx;
      p.y = cy;
      this.contentClip.addChild(p);
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 90;
      gsap.to(p, {
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist + 30,
        alpha: 0,
        rotation: Math.random() * Math.PI * 2,
        duration: 0.7 + Math.random() * 0.4,
        ease: 'power2.out',
        onComplete: () => p.destroy(),
      });
    }
    // Knight raises sword on click
    gsap.fromTo(
      this.knight,
      { rotation: -0.05 },
      { rotation: 0.05, duration: 0.12, yoyo: true, repeat: 3, ease: 'power1.inOut' },
    );
  }
}
