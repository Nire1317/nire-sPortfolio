export type Tier = 'high' | 'low';

export interface Quality {
  tier: Tier;
  webgl: boolean;
  coarse: boolean;
  particles: number;
  dust: number;
  pixelRatio: number;
  bloom: boolean;
  bloomScale: number;
  panelSize: number;
  /** 0 = as detected, 1 = bloom off + lower resolution, 2 = also fewer particles. */
  step: number;
}

function hasWebGL2(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2', { failIfMajorPerformanceCaveat: false });
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Picks a tier from pointer type, screen density, CPU cores and WebGL2.
 * `?quality=high|low` forces a tier; `?webgl=0` forces the no-WebGL fallback.
 */
export function detectQuality(): Quality {
  const params = new URLSearchParams(location.search);
  const coarse = matchMedia('(pointer: coarse)').matches;
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const cores = navigator.hardwareConcurrency || 4;
  const webgl = params.get('webgl') !== '0' && hasWebGL2();

  let tier: Tier = !coarse && cores >= 4 ? 'high' : 'low';
  if (cores <= 2) tier = 'low';
  const forced = params.get('quality');
  if (forced === 'high' || forced === 'low') tier = forced;

  const high = tier === 'high';
  // Dense phone screens get a lower pixel-ratio cap: fill rate is the bottleneck.
  const prCap = high ? 1.75 : dpr >= 3 ? 1.35 : 1.5;

  return {
    tier,
    webgl,
    coarse,
    particles: high ? 40000 : 12000,
    dust: high ? 6000 : 2200,
    pixelRatio: Math.min(dpr, prCap),
    bloom: true,
    bloomScale: high ? 0.5 : 0.32,
    panelSize: high ? 1024 : 768,
    step: 0,
  };
}

/**
 * Steps quality down when the frame rate stays under 45 fps.
 * Step 1: bloom off and a lower resolution. Step 2: fewer particles.
 */
export class FpsMonitor {
  private frames = 0;
  private elapsed = 0;
  private warmup = 2.5;
  private slowWindows = 0;
  constructor(
    private q: Quality,
    private onStep: (step: number) => void,
  ) {}

  reset() {
    this.frames = 0;
    this.elapsed = 0;
    this.warmup = 1.5;
    this.slowWindows = 0;
  }

  tick(dt: number) {
    if (this.q.step >= 2) return;
    if (dt > 0.5) {
      // Tab switch or a long stall: not a fair sample.
      this.reset();
      return;
    }
    if (this.warmup > 0) {
      this.warmup -= dt;
      return;
    }
    this.frames++;
    this.elapsed += dt;
    if (this.elapsed < 2) return;
    const fps = this.frames / this.elapsed;
    this.frames = 0;
    this.elapsed = 0;
    this.slowWindows = fps < 45 ? this.slowWindows + 1 : 0;
    if (this.slowWindows >= 2) {
      this.slowWindows = 0;
      this.q.step++;
      this.warmup = 1.5;
      this.onStep(this.q.step);
    }
  }
}
