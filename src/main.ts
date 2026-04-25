import { Application } from 'pixi.js';
import { Scene } from './scene';

async function bootstrap() {
  const host = document.getElementById('app');
  if (!host) throw new Error('#app missing');

  const app = new Application();
  await app.init({
    background: '#0c0814',
    resizeTo: host,
    antialias: true,
    autoDensity: true,
    resolution: Math.min(window.devicePixelRatio ?? 1, 2),
    preference: 'webgl',
  });
  host.appendChild(app.canvas);

  const scene = new Scene(app);
  scene.layout(app.screen.width, app.screen.height);

  const onResize = () => scene.layout(app.screen.width, app.screen.height);
  window.addEventListener('resize', onResize);
  // Pixi already triggers a render-side resize via resizeTo; we still relay it.
  app.renderer.on('resize', () => scene.layout(app.screen.width, app.screen.height));

  scene.start();
}

bootstrap().catch((err) => {
  console.error('Failed to start demo:', err);
  const host = document.getElementById('app');
  if (host) {
    host.innerHTML = `<pre style="color:#fff;padding:24px;font-family:monospace;">${String(err)}</pre>`;
  }
});
