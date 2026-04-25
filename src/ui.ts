import { Container, Graphics, Text, TextStyle, FederatedPointerEvent } from 'pixi.js';

const NAV_ITEMS = ['FEATURES', 'EXAMPLES', 'DOCS', 'PLAYGROUND', 'COMMUNITY'];

export function makeNavBar(width: number): { container: Container; height: number } {
  const c = new Container();
  const height = 44;

  const bg = new Graphics();
  bg.rect(0, 0, width, height).fill({ color: '#0e0a18' });
  c.addChild(bg);

  const style = new TextStyle({
    fontFamily: 'Courier New, monospace',
    fontSize: 12,
    fontWeight: '700',
    fill: '#cfd2dc',
    letterSpacing: 2,
  });

  const innerPad = 28;
  const itemSpacing = 30;

  // Center the menu items
  const labels = NAV_ITEMS.map((label) => new Text({ text: label, style }));
  const totalWidth = labels.reduce((acc, t) => acc + t.width + itemSpacing, -itemSpacing);
  let x = (width - totalWidth) / 2;
  for (const t of labels) {
    t.x = x;
    t.y = (height - t.height) / 2;
    t.eventMode = 'static';
    t.cursor = 'pointer';
    t.on('pointerover', () => (t.tint = 0xff4760));
    t.on('pointerout', () => (t.tint = 0xffffff));
    c.addChild(t);
    x += t.width + itemSpacing;
  }

  // Github pill on right
  const ghPad = 14;
  const ghLabel = new Text({
    text: '> GITHUB',
    style: new TextStyle({
      fontFamily: 'Courier New, monospace',
      fontSize: 12,
      fontWeight: '700',
      fill: '#ff4760',
      letterSpacing: 2,
    }),
  });
  const ghBg = new Graphics();
  const ghW = ghLabel.width + ghPad * 2;
  const ghH = 26;
  ghBg
    .roundRect(width - innerPad - ghW, (height - ghH) / 2, ghW, ghH, 4)
    .stroke({ color: '#ff4760', width: 1.5 });
  ghLabel.x = width - innerPad - ghW + ghPad;
  ghLabel.y = (height - ghLabel.height) / 2;
  c.addChild(ghBg);
  c.addChild(ghLabel);

  return { container: c, height };
}

export interface HeroOptions {
  onPrimary?: (e: FederatedPointerEvent) => void;
}

export function makeHeroText(opts: HeroOptions = {}): {
  container: Container;
  subtitle: Text;
  body: Text;
  primary: Container;
  secondary: Container;
} {
  const c = new Container();

  const subtitle = new Text({
    text: 'The HTML5 Creation Engine',
    style: new TextStyle({
      fontFamily: 'Courier New, monospace',
      fontSize: 22,
      fontWeight: '700',
      fill: '#ffffff',
      letterSpacing: 1,
    }),
  });

  const body = new Text({
    text: 'Create beautiful digital content with the fastest,\nmost flexible 2D WebGL/WebGPU renderer.',
    style: new TextStyle({
      fontFamily: 'Courier New, monospace',
      fontSize: 14,
      fontWeight: '400',
      fill: '#c8c4d6',
      letterSpacing: 0.4,
      lineHeight: 22,
    }),
  });

  c.addChild(subtitle);
  c.addChild(body);

  const primary = makeButton('GET STARTED', '♥', { primary: true });
  const secondary = makeButton('VIEW EXAMPLES', '👁', { primary: false });

  c.addChild(primary);
  c.addChild(secondary);

  if (opts.onPrimary) primary.on('pointertap', opts.onPrimary);

  return { container: c, subtitle, body, primary, secondary };
}

export function makeButton(
  label: string,
  iconChar: string | null,
  options: { primary: boolean },
): Container {
  const c = new Container();
  c.eventMode = 'static';
  c.cursor = 'pointer';

  const labelStyle = new TextStyle({
    fontFamily: 'Courier New, monospace',
    fontSize: 13,
    fontWeight: '700',
    fill: options.primary ? '#ffffff' : '#ff7a8b',
    letterSpacing: 1.6,
  });

  const text = new Text({ text: label, style: labelStyle });
  const iconText = iconChar
    ? new Text({
        text: iconChar,
        style: new TextStyle({
          fontFamily: 'Apple Color Emoji, Segoe UI Emoji, system-ui, sans-serif',
          fontSize: 14,
          fill: options.primary ? '#ffffff' : '#ff7a8b',
        }),
      })
    : null;

  const padX = 18;
  const padY = 10;
  const gap = 8;
  const iconW = iconText ? iconText.width + gap : 0;
  const totalW = padX * 2 + iconW + text.width;
  const totalH = padY * 2 + Math.max(text.height, iconText ? iconText.height : 0);

  const bg = new Graphics();
  if (options.primary) {
    bg.roundRect(0, 0, totalW, totalH, 4).fill({ color: '#e84c6a' });
    bg.roundRect(0, 0, totalW, totalH, 4).stroke({ color: '#ff8aa3', width: 1, alpha: 0.6 });
  } else {
    bg.roundRect(0, 0, totalW, totalH, 4).stroke({ color: '#ff7a8b', width: 1.5 });
  }
  c.addChild(bg);

  let cursorX = padX;
  if (iconText) {
    iconText.x = cursorX;
    iconText.y = (totalH - iconText.height) / 2;
    c.addChild(iconText);
    cursorX += iconText.width + gap;
  }
  text.x = cursorX;
  text.y = (totalH - text.height) / 2;
  c.addChild(text);

  // Hover highlight
  c.on('pointerover', () => {
    if (options.primary) {
      bg.tint = 0xffd1da;
    } else {
      bg.tint = 0xff7a8b;
    }
  });
  c.on('pointerout', () => {
    bg.tint = 0xffffff;
  });

  return c;
}
