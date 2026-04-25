# pixi-prototype

A pixel-art recreation of the PixiJS landing page, rendered entirely in
WebGL/WebGPU with **PixiJS v8** and animated with **GSAP**.

Inspired by [@PixiJS · Apr 25 2026](https://x.com/pixijs/status/2047737475175686256).

## Stack

- [Vite](https://vitejs.dev/) (vanilla TypeScript)
- [PixiJS v8](https://pixijs.com/)
- [GSAP 3](https://gsap.com/)

Everything you see — the browser-window chrome, the nav bar, the "PixiJS"
pixel-logo, the hero copy, the night-sky scene with castle, knight, slime,
mushroom and trees — is drawn from scratch with `Pixi.Graphics`. No image
assets are used.

## Run locally

```bash
npm install
npm run dev
```

then open the printed URL.

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Layout

| File              | Purpose                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `src/main.ts`     | Bootstraps the PixiJS Application and resize handling                |
| `src/scene.ts`    | Composes the browser-window frame, sky/mountains, foreground, & UI   |
| `src/pixel-art.ts`| Pixel-grid sprite + glyph definitions (knight, slime, castle, logo…) |
| `src/ui.ts`       | Nav bar, hero text block and buttons                                 |

## Interactions

- **Move the cursor** — the sky layers parallax behind the foreground.
- **Hover the menu / buttons** — they highlight in PixiJS red.
- **Click `GET STARTED`** — confetti burst, knight wiggles his sword.
