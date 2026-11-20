import { clamp, damp } from '../core/math';
import { state } from '../core/state';

type PermissionFn = () => Promise<'granted' | 'denied' | 'default'>;

/**
 * Device tilt drives parallax on phones. The quiet "Enable tilt" button only
 * appears when no orientation events arrive (e.g. iOS before permission), and
 * only on the intro. We never decide based on `requestPermission` existing,
 * because desktop Chrome exposes it too.
 */
export function createTilt() {
  const btn = document.querySelector<HTMLButtonElement>('.tilt-btn');
  const coarse = matchMedia('(pointer: coarse)').matches;
  let received = false;
  let tx = 0;
  let ty = 0;
  let baseBeta: number | null = null;
  let offered = false;

  const onOrient = (e: DeviceOrientationEvent) => {
    if (e.beta === null || e.gamma === null) return;
    if (!received) {
      received = true;
      state.tilt.active = true;
      if (btn) btn.hidden = true;
    }
    if (baseBeta === null) baseBeta = e.beta;
    const landscape = Math.abs((screen.orientation?.angle ?? 0) % 180) === 90;
    const gx = landscape ? e.beta : e.gamma;
    const gy = landscape ? e.gamma : e.beta - baseBeta;
    tx = clamp(gx / 28, -1, 1);
    ty = clamp(-gy / 28, -1, 1);
  };

  if (typeof DeviceOrientationEvent !== 'undefined' && coarse) {
    window.addEventListener('deviceorientation', onOrient);
    window.setTimeout(() => {
      if (!received && btn) {
        offered = true;
        btn.hidden = false;
      }
    }, 1500);
    btn?.addEventListener('click', async () => {
      const ctor = DeviceOrientationEvent as unknown as { requestPermission?: PermissionFn };
      try {
        if (typeof ctor.requestPermission === 'function') await ctor.requestPermission();
      } catch {
        /* denied or unsupported */
      }
      btn.hidden = true;
      offered = false;
    });
  }

  return {
    update(dt: number) {
      if (btn && offered && !received) {
        const onIntro = state.t < 0.5;
        if (btn.hidden === onIntro) btn.hidden = !onIntro;
      }
      if (!received) return;
      const k = damp(5, dt);
      state.tilt.x += (tx - state.tilt.x) * k;
      state.tilt.y += (ty - state.tilt.y) * k;
    },
  };
}
