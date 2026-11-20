import '@fontsource-variable/bricolage-grotesque/standard.css';
import '@fontsource-variable/manrope';
import 'lenis/dist/lenis.css';
import './styles/main.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toolkit, work } from './content';
import { stopModel } from './markup';
import { bus, state } from './core/state';
import { detectQuality, FpsMonitor } from './core/quality';
import { createTour } from './tour/scroll';
import { fitAndMeasure, type Layout } from './tour/layout';
import { createReveals } from './ui/reveal';
import { createNav } from './ui/nav';
import { createFx } from './ui/fx';
import { createCursor } from './ui/cursor';
import { createContact } from './ui/contact';
import { createInput } from './ui/input';
import { createTilt } from './ui/tilt';
import { createClock } from './ui/clock';
import { Soundscape } from './audio/sound';
import type { Stage } from './three/stage';

const html = document.documentElement;
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
window.addEventListener('pageshow', (e) => {
  if (e.persisted) window.scrollTo(0, 0);
});

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
html.classList.add(reduced ? 'reduced-motion' : 'motion');
state.reduced = reduced;

const quality = detectQuality();
html.dataset.quality = quality.tier;

const stops = [...document.querySelectorAll<HTMLElement>('.stop')];
const tour = createTour(stops, reduced);
const reveals = createReveals(stops, reduced);
const nav = createNav(stops, reduced);
const fx = createFx();
const input = createInput();
const tilt = createTilt();
const sound = new Soundscape();
createClock();
createCursor(reduced);
createContact();

let stage: Stage | null = null;
let layout: Layout | null = null;

for (const ev of ['pointerdown', 'keydown'] as const) {
  window.addEventListener(ev, () => (state.interacted = true), { once: true, capture: true });
}

function relayout() {
  layout = fitAndMeasure(stops);
  state.w = layout.w;
  state.h = layout.h;
  state.portrait = layout.portrait;
  stage?.resize(layout.w, layout.h, layout.regions, layout.cardRects, layout.stopH);
  tour.resize();
  ScrollTrigger.refresh();
}

let resizeTimer = 0;
const onResize = () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(relayout, 140);
};
window.addEventListener('resize', onResize);
window.addEventListener('orientationchange', onResize);

/* ---------- landing: light sweep, flash, shockwave, chime, haptic, project scan ---------- */

bus.on('land', (i) => {
  stage?.land(i);
  if (!reduced) {
    const p = stage?.subjectScreen() ?? { x: window.innerWidth * 0.72, y: window.innerHeight * 0.45 };
    fx.land(p.x, p.y, window.innerWidth, window.innerHeight);
  }
  sound.bell(i);
  const activated = navigator.userActivation?.hasBeenActive ?? state.interacted;
  if (/Android/i.test(navigator.userAgent) && activated && state.interacted && 'vibrate' in navigator) {
    navigator.vibrate(8);
  }
});

bus.on('shock', (s) => {
  if (!reduced) stage?.shockAt(s.x, s.y, s.strength);
});

/* ---------- frame loop (after Lenis on the shared GSAP ticker) ---------- */

const fps = new FpsMonitor(quality, (step) => {
  html.dataset.qualityStep = String(step);
  stage?.setQualityStep(step);
});
document.addEventListener('visibilitychange', () => fps.reset());
// `?fps=0` disables the automatic step-down (useful for screenshots on slow machines).
const fpsGuard = new URLSearchParams(location.search).get('fps') !== '0';

let last = performance.now();
gsap.ticker.add(() => {
  const now = performance.now();
  const dt = Math.min(0.1, Math.max(0.001, (now - last) / 1000));
  last = now;
  state.dt = dt;
  state.time += dt;
  tour.update(dt);
  input.update(dt);
  tilt.update(dt);
  reveals.update(state.t);
  nav.update(state.t);
  sound.update(state.count > 1 ? state.t / (state.count - 1) : 0, reduced ? 0 : state.speed);
  if (stage && !document.hidden) {
    stage.update(dt);
    stage.render(dt);
    if (fpsGuard) fps.tick(dt);
  }
});

/* ---------- boot ---------- */

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

async function startStage() {
  if (!quality.webgl) {
    html.classList.add('no-webgl');
    return;
  }
  const canvas = document.querySelector<HTMLCanvasElement>('#gl');
  if (!canvas) return;
  try {
    const { Stage } = await import('./three/stage');
    stage = new Stage({
      canvas,
      quality,
      reduced,
      kinds: stopModel().map((s) => s.kind),
      projects: work.projects,
      toolkitGroups: toolkit.groups,
      labelLayer: document.querySelector<HTMLElement>('.ring-labels')!,
    });
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      stage = null;
      html.classList.add('no-webgl');
    });
    relayout();
    if (document.fonts?.status === 'loaded') stage.fontsReady();
    requestAnimationFrame(() => html.classList.add('gl-ready'));
  } catch (err) {
    stage = null;
    html.classList.add('no-webgl');
    console.warn('WebGL scene unavailable, showing the static background.', err);
  }
}

async function boot() {
  relayout();
  const stageReady = startStage();
  await Promise.race([document.fonts?.ready ?? Promise.resolve(), wait(2500)]);
  await reveals.ready;
  relayout();
  stage?.fontsReady();
  html.classList.add('is-ready');
  tour.scrollToStop(0, { immediate: true });
  await stageReady;
  html.classList.add('is-booted');
}

void boot();

// QA hook for automated checks: only present with ?debug in the URL.
if (new URLSearchParams(location.search).has('debug')) {
  (window as unknown as { __tour: unknown }).__tour = {
    state,
    goto: (i: number, immediate = false) => tour.scrollToStop(i, { immediate }),
    layout: () => layout,
    subject: () => stage?.debugSubject() ?? null,
  };
}
