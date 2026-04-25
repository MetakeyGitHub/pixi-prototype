import { Container, Graphics } from 'pixi.js';

/**
 * Helpers for drawing crisp pixel-art using PixiJS Graphics.
 * Each "pixel" is a filled rectangle — keeping things scalable and resolution-independent.
 */

export type Pixel = string; // single character keying into a palette
export type PixelMap = string[];

const TRANSPARENT = ' ';

export function drawPixels(
  g: Graphics,
  rows: PixelMap,
  palette: Record<string, string>,
  unit: number,
  ox = 0,
  oy = 0,
) {
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === TRANSPARENT) continue;
      const color = palette[ch];
      if (!color) continue;
      g.rect(ox + x * unit, oy + y * unit, unit, unit).fill({ color });
    }
  }
}

/* --- Sprite definitions --- */

// Tiny pixel knight with red hair, simple stylised look (16 wide x 20 tall)
const knightRows: PixelMap = [
  '     rrrr       ',
  '    rRRRRr      ',
  '   rRRRRRRr     ',
  '   rRffffRr     ',
  '   rffEEffr     ',
  '    fffffff     ',
  '    fEEffEf     ',
  '   ssssssss     ',
  '   sBBBBBBs g   ',
  '  ssBBwwBBs gg  ',
  '  fsBBwwBBsf gg ',
  '  fsBBBBBBsf  gg',
  '   sBBBBBBs   gg',
  '   ssfssfss   gg',
  '   bbb  bbb   gg',
  '   bbb  bbb     ',
  '  BBBB  BBBB    ',
];

const knightPalette: Record<string, string> = {
  r: '#c92a4a', // hair red dark
  R: '#ff7a8b', // hair highlight
  f: '#f4c8a0', // skin
  E: '#1a1a2e', // eyes
  s: '#444b6b', // armor base
  B: '#2a2f4a', // armor dark
  w: '#e2e8f0', // armor highlight
  b: '#3a2a44', // boots / pants
  g: '#cfd2dc', // sword blade
};

export function makeKnight(unit = 4): Container {
  const c = new Container();
  const g = new Graphics();
  drawPixels(g, knightRows, knightPalette, unit);
  c.addChild(g);
  c.pivot.set(g.width / 2, g.height);
  return c;
}

// Pink slime blob (12x9)
const slimeRows: PixelMap = [
  '   pppppp   ',
  '  pPPPPPPp  ',
  ' pPPPPPPPPp ',
  ' pPwPPPPwPp ',
  ' pPPPPPPPPp ',
  ' pPPwwwwPPp ',
  ' ppPPPPPPpp ',
  '  pppppppp  ',
  '  d      d  ',
];

const slimePalette: Record<string, string> = {
  p: '#cc3a73',
  P: '#ff66a3',
  w: '#ffe2ee',
  d: '#5a1730',
};

export function makeSlime(unit = 5): Container {
  const c = new Container();
  const g = new Graphics();
  drawPixels(g, slimeRows, slimePalette, unit);
  c.addChild(g);
  c.pivot.set(g.width / 2, g.height);
  return c;
}

// Castle silhouette + windows (28x22)
const castleRows: PixelMap = [
  '     T   T       T  T       ',
  '     T   T       T  T       ',
  '     WWWWW       WWWW       ',
  '     WMMMW       WMMW       ',
  '     WMMMW       WMMW       ',
  '     WMMMW       WMMW       ',
  '     WWWWW       WWWW       ',
  '   WWWWWWWWW WWWWWWWWWW     ',
  '   WMMyMMMMW WMMMyMMMMW     ',
  '   WMMyMMMMW WMMMyMMMMW     ',
  '   WMMMMMMMWWWMMMMMMMMW     ',
  ' WWWMMMMMMMMMMMMMMMMMMMWWW  ',
  ' WMMMMyMMMMMMMyMMMMMMMyMMW  ',
  ' WMMMMyMMMMMMMyMMMMMMMyMMW  ',
  ' WMMMMMMMMMMMMMMMMMMMMMMMW  ',
  ' WMMMMMMMaaaMMMMMMMMMMMMMW  ',
  ' WMMMMMMMaaaMMMMMMMMMMMMMW  ',
  ' WWWWWWWWWWWWWWWWWWWWWWWWWW ',
  '  WWWWWWWWWWWWWWWWWWWWWWWW  ',
  '  WWWWWWWWWWWWWWWWWWWWWWWW  ',
  '  WWWWWWWWWWWWWWWWWWWWWWWW  ',
  '  WWWWWWWWWWWWWWWWWWWWWWWW  ',
];

const castlePalette: Record<string, string> = {
  T: '#c92a4a', // flag
  W: '#3a2a55', // wall light
  M: '#241636', // wall dark
  y: '#ffd866', // window glow
  a: '#0a0612', // gate
};

export function makeCastle(unit = 4): Container {
  const c = new Container();
  const g = new Graphics();
  drawPixels(g, castleRows, castlePalette, unit);
  c.addChild(g);
  c.pivot.set(g.width / 2, g.height);
  return c;
}

// Mushroom (small foreground prop)
const mushroomRows: PixelMap = [
  '  rrrrrr  ',
  ' rRRRRRRr ',
  ' rRwwwRRr ',
  ' rRRwwRRr ',
  '  rrRRrr  ',
  '   ffff   ',
  '   ffff   ',
  '   ffff   ',
];

const mushroomPalette: Record<string, string> = {
  r: '#a02238',
  R: '#e84c6a',
  w: '#ffd5dd',
  f: '#f4e3c4',
};

export function makeMushroom(unit = 3): Container {
  const c = new Container();
  const g = new Graphics();
  drawPixels(g, mushroomRows, mushroomPalette, unit);
  c.addChild(g);
  c.pivot.set(g.width / 2, g.height);
  return c;
}

// Pine tree silhouette (11x14)
const treeRows: PixelMap = [
  '     T     ',
  '    TTT    ',
  '   TTTTT   ',
  '  TTTTTTT  ',
  '   TTTTT   ',
  '  TTTTTTT  ',
  ' TTTTTTTTT ',
  '  TTTTTTT  ',
  ' TTTTTTTTT ',
  'TTTTTTTTTTT',
  '   bbbbb   ',
  '   bbbbb   ',
  '   bbbbb   ',
  '   bbbbb   ',
];

const treePalette: Record<string, string> = {
  T: '#1d4a35',
  b: '#3a2418',
};

export function makeTree(unit = 4): Container {
  const c = new Container();
  const g = new Graphics();
  drawPixels(g, treeRows, treePalette, unit);
  c.addChild(g);
  c.pivot.set(g.width / 2, g.height);
  return c;
}

// Crescent moon (procedural, not pixel-grid — simple disk with mask shadow)
export function makeMoon(radius = 36): Container {
  const c = new Container();
  const halo = new Graphics();
  for (let i = 6; i > 0; i--) {
    halo.circle(0, 0, radius + i * 4).fill({ color: '#fff5d8', alpha: 0.04 });
  }
  c.addChild(halo);
  const disk = new Graphics();
  disk.circle(0, 0, radius).fill({ color: '#ffe9b0' });
  // Subtle craters
  disk.circle(-radius * 0.3, -radius * 0.1, radius * 0.13).fill({ color: '#e7cf95', alpha: 0.5 });
  disk.circle(radius * 0.25, radius * 0.18, radius * 0.09).fill({ color: '#e7cf95', alpha: 0.5 });
  c.addChild(disk);
  return c;
}

// Star — single small bright pixel + glow
export function makeStar(size = 2, color = '#ffffff'): Container {
  const c = new Container();
  const g = new Graphics();
  g.rect(-size / 2, -size / 2, size, size).fill({ color });
  g.rect(-size * 1.5, -size / 2, size, size).fill({ color, alpha: 0.5 });
  g.rect(size * 0.5, -size / 2, size, size).fill({ color, alpha: 0.5 });
  g.rect(-size / 2, -size * 1.5, size, size).fill({ color, alpha: 0.5 });
  g.rect(-size / 2, size * 0.5, size, size).fill({ color, alpha: 0.5 });
  c.addChild(g);
  return c;
}

// Mountain silhouette behind the castle
export function makeMountainRange(width: number, baseHeight: number, color: string): Graphics {
  const g = new Graphics();
  const peaks = 6;
  const step = width / peaks;
  g.moveTo(0, baseHeight);
  for (let i = 0; i < peaks; i++) {
    const peakX = i * step + step / 2;
    const variance = (i % 2 === 0 ? 0.7 : 0.5) * baseHeight;
    g.lineTo(peakX, baseHeight - variance);
    g.lineTo((i + 1) * step, baseHeight - variance * 0.4);
  }
  g.lineTo(width, baseHeight);
  g.closePath();
  g.fill({ color });
  return g;
}

/* --- Big "PixiJS" pixel logo --- */
// Hand-drawn glyphs at 8 wide x 9 tall per character
const FONT: Record<string, PixelMap> = {
  P: [
    '#####  ',
    '##  ## ',
    '##   ##',
    '##  ## ',
    '#####  ',
    '##     ',
    '##     ',
    '##     ',
    '##     ',
  ],
  i: [
    '   ##  ',
    '       ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
    '   ##  ',
  ],
  x: [
    '       ',
    '       ',
    '##   ##',
    ' ## ## ',
    '  ###  ',
    ' ## ## ',
    '##   ##',
    '       ',
    '       ',
  ],
  J: [
    '    ###',
    '     ##',
    '     ##',
    '     ##',
    '     ##',
    '     ##',
    '##   ##',
    '##   ##',
    ' ##### ',
  ],
  S: [
    ' ##### ',
    '##   ##',
    '##     ',
    ' ###   ',
    '   ##  ',
    '     ##',
    '##   ##',
    '##   ##',
    ' ##### ',
  ],
};

export function makePixiLogo(unit = 6): Container {
  const c = new Container();
  const text = 'PixiJS';
  let cursorX = 0;
  for (const ch of text) {
    const rows = FONT[ch];
    if (!rows) continue;
    const g = new Graphics();
    // Shadow
    drawPixels(
      g,
      rows,
      { '#': '#5a0a1f' },
      unit,
      cursorX + unit * 0.6,
      unit * 0.6,
    );
    // Main fill — pinkish red gradient feel via two-tone
    drawPixels(g, rows, { '#': '#ff4760' }, unit, cursorX, 0);
    // Highlight row across top
    const top: PixelMap = rows.map((r, i) => (i === 0 || i === 1 ? r : ' '.repeat(r.length)));
    drawPixels(g, top, { '#': '#ffb8c4' }, unit, cursorX, 0);
    c.addChild(g);
    const w = (rows[0]?.length ?? 7) * unit;
    cursorX += w + unit; // letter spacing
  }
  return c;
}
