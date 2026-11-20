import { bus, state } from '../core/state';
import { damp } from '../core/math';

const INTERACTIVE = 'a, button, input, textarea, select, label, [data-card], .topbar, .rail';

/**
 * Pointer / finger position for the particle parting effect, and a shockwave
 * ring when the visitor taps or clicks empty space.
 */
export function createInput() {
  const p = state.pointer;
  const set = (x: number, y: number) => {
    p.x = (x / window.innerWidth) * 2 - 1;
    p.y = -((y / window.innerHeight) * 2 - 1);
  };
  window.addEventListener(
    'pointermove',
    (e) => {
      set(e.clientX, e.clientY);
      p.target = 1;
    },
    { passive: true },
  );
  window.addEventListener(
    'pointerdown',
    (e) => {
      set(e.clientX, e.clientY);
      p.target = 1;
      // Snap the smoothed position so the first touch parts particles right there.
      if (e.pointerType !== 'mouse') {
        p.sx = p.x;
        p.sy = p.y;
      }
      const target = e.target as HTMLElement | null;
      if (target && !target.closest(INTERACTIVE)) {
        bus.emit('shock', { x: p.x, y: p.y, strength: 1.1 });
      }
    },
    { passive: true },
  );
  const leave = () => (p.target = 0);
  window.addEventListener('pointerup', (e) => {
    if (e.pointerType !== 'mouse') leave();
  });
  window.addEventListener('pointercancel', leave);
  document.documentElement.addEventListener('mouseleave', leave);
  window.addEventListener('blur', leave);

  return {
    update(dt: number) {
      const k = damp(7, dt);
      p.sx += (p.x - p.sx) * k;
      p.sy += (p.y - p.sy) * k;
      p.active += (p.target - p.active) * damp(4, dt);
    },
  };
}
