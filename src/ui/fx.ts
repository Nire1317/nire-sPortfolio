import { gsap } from 'gsap';

/** Landing: a light sweep across the screen and a brief flash at the subject. */
export function createFx() {
  const sweep = document.querySelector<HTMLElement>('.fx__sweep');
  const flash = document.querySelector<HTMLElement>('.fx__flash');
  if (sweep) gsap.set(sweep, { x: 0, y: 0, skewX: -14, xPercent: -130 });
  return {
    land(x: number, y: number, w: number, h: number) {
      if (sweep) {
        gsap.killTweensOf(sweep);
        gsap.fromTo(
          sweep,
          { xPercent: -130, opacity: 1 },
          {
            // Travel past the right edge, including the skewed corners.
            xPercent: ((w + h * 0.4) / Math.max(1, sweep.offsetWidth)) * 100 + 20,
            duration: 1.05,
            ease: 'power2.inOut',
            onComplete: () => void gsap.set(sweep, { opacity: 0 }),
          },
        );
      }
      if (flash) {
        flash.style.setProperty('--fx-x', `${((x / w) * 100).toFixed(1)}%`);
        flash.style.setProperty('--fx-y', `${((y / h) * 100).toFixed(1)}%`);
        gsap.killTweensOf(flash);
        gsap.fromTo(flash, { opacity: 0.95 }, { opacity: 0, duration: 0.95, ease: 'power2.out' });
      }
    },
  };
}
