import { gsap } from 'gsap';

/** Desktop only: a custom cursor (dot + lagging ring) and magnetic buttons. */
export function createCursor(reduced: boolean) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const html = document.documentElement;
  const root = document.querySelector<HTMLElement>('.cursor');
  const dot = document.querySelector<HTMLElement>('.cursor__dot');
  const ring = document.querySelector<HTMLElement>('.cursor__ring');
  if (!root || !dot || !ring) return;
  html.classList.add('has-cursor');

  const dur = reduced ? 0 : 0.45;
  const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
  const ringX = gsap.quickTo(ring, 'x', { duration: dur, ease: 'power3' });
  const ringY = gsap.quickTo(ring, 'y', { duration: dur, ease: 'power3' });
  html.classList.add('cursor-hidden');

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    html.classList.remove('cursor-hidden');
    dotX(e.clientX);
    dotY(e.clientY);
    ringX(e.clientX);
    ringY(e.clientY);
    const hit = (e.target as HTMLElement).closest('a, button');
    html.classList.toggle('cursor-hover', !!hit);
  });
  document.addEventListener('pointerleave', () => html.classList.add('cursor-hidden'));
  document.documentElement.addEventListener('mouseleave', () => html.classList.add('cursor-hidden'));
  window.addEventListener('pointerdown', () => html.classList.add('cursor-down'));
  window.addEventListener('pointerup', () => html.classList.remove('cursor-down'));

  if (reduced) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const mx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const my = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      mx((e.clientX - (r.left + r.width / 2)) * 0.26);
      my((e.clientY - (r.top + r.height / 2)) * 0.36);
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.45)', overwrite: true });
    });
  });
}
