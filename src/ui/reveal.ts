import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { clamp, smoothstep } from '../core/math';
import { state } from '../core/state';

interface StopFx {
  stop: HTMLElement;
  card: HTMLElement;
  splits: SplitText[];
  tl: gsap.core.Timeline | null;
  revealed: boolean;
  words: HTMLElement[];
  lastWordP: number;
  lastVs: number;
  lastVdir: number;
  heads: HTMLElement[];
}

export interface Reveals {
  /** Resolves once every split has run (for the fit pass). */
  ready: Promise<void>;
  update(t: number): void;
}

/**
 * Micro-animations on every stop:
 *  - the card tilts in from depth and tilts away as you scroll (scrubbed),
 *  - headings reveal by character and paragraphs by line, through line masks,
 *  - About's bio lights up word by word as you arrive,
 *  - headlines skew and change weight and width with scroll speed.
 * Reveals animate opacity only (never visibility), so content stays readable
 * by screen readers and reachable with Tab.
 */
export function createReveals(stops: HTMLElement[], reduced: boolean): Reveals {
  const fx: StopFx[] = stops.map((stop) => ({
    stop,
    card: stop.querySelector<HTMLElement>('[data-card]')!,
    splits: [],
    tl: null,
    revealed: false,
    words: [],
    lastWordP: -1,
    lastVs: -1,
    lastVdir: 0,
    heads: [...stop.querySelectorAll<HTMLElement>('.hero-name, .h2')],
  }));

  if (reduced) {
    return { ready: Promise.resolve(), update() {} };
  }

  gsap.registerPlugin(SplitText, ScrollTrigger);

  const rebuild = (f: StopFx) => {
    const progress = f.revealed ? 1 : 0;
    f.tl?.revert();
    const tl = gsap.timeline({ paused: true });
    const chars = f.splits.filter((s) => s.chars.length && s.elements[0]?.matches('.hero-name, .h2')).flatMap((s) => s.chars);
    const lines = f.splits.filter((s) => !s.chars.length && s.lines.length).flatMap((s) => s.lines);
    const label = f.card.querySelector<HTMLElement>('[data-label]');
    const rises = [...f.card.querySelectorAll<HTMLElement>('[data-rise]')];
    if (label) {
      tl.fromTo(label, { '--rule': 0 }, { '--rule': 1, duration: 0.7, ease: 'expo.out' }, 0);
      tl.from(label.querySelector('span'), { opacity: 0, x: -14, duration: 0.6, ease: 'expo.out' }, 0.05);
    }
    if (chars.length) {
      tl.from(chars, { yPercent: 118, rotate: 6, opacity: 0, duration: 0.95, ease: 'expo.out', stagger: { each: 0.018, from: 'start' } }, 0.06);
    }
    if (lines.length) tl.from(lines, { yPercent: 108, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07 }, 0.24);
    if (rises.length) tl.from(rises, { y: 26, opacity: 0, duration: 0.85, ease: 'expo.out', stagger: 0.06 }, 0.34);
    if (f.words.length) tl.from(f.card.querySelectorAll('.bio'), { y: 14, duration: 0.8, ease: 'expo.out', stagger: 0.08 }, 0.3);
    // Facts & figures count up from zero.
    f.card.querySelectorAll<HTMLElement>('[data-count]').forEach((el, k) => {
      const end = Number(el.dataset.count) || 0;
      const o = { v: 0 };
      el.textContent = '0';
      tl.to(o, { v: end, duration: 1.5, ease: 'power3.out', onUpdate: () => void (el.textContent = String(Math.round(o.v))) }, 0.55 + k * 0.1);
    });
    tl.progress(progress);
    f.tl = tl;
  };

  fx.forEach((f) => {
    let pending = false;
    const schedule = () => {
      if (pending) return;
      pending = true;
      queueMicrotask(() => {
        pending = false;
        rebuild(f);
      });
    };
    f.card.querySelectorAll<HTMLElement>('[data-split="chars"]').forEach((el) => {
      f.splits.push(
        SplitText.create(el, {
          type: 'lines,words,chars',
          mask: 'lines',
          linesClass: 'split-line',
          charsClass: 'split-char',
          autoSplit: true,
          onSplit: schedule,
        }),
      );
    });
    f.card.querySelectorAll<HTMLElement>('[data-split="lines"]').forEach((el) => {
      f.splits.push(
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit: schedule,
        }),
      );
    });
    f.card.querySelectorAll<HTMLElement>('[data-words]').forEach((el) => {
      const s = SplitText.create(el, { type: 'words', wordsClass: 'word' });
      f.words.push(...(s.words as HTMLElement[]));
    });
    rebuild(f);

    const play = () => {
      if (f.revealed) return;
      f.revealed = true;
      f.tl?.restart();
    };
    const reset = () => {
      f.revealed = false;
      f.tl?.pause(0);
    };
    // Play once the stop is well on its way in...
    ScrollTrigger.create({ trigger: f.stop, start: 'top 62%', end: 'bottom 38%', onEnter: play, onEnterBack: play });
    // ...and re-arm only once it is fully off screen, so it replays next visit.
    ScrollTrigger.create({ trigger: f.stop, start: 'top 99%', end: 'bottom 1%', onLeave: reset, onLeaveBack: reset });
  });

  const aboutIdx = fx.findIndex((f) => f.words.length > 0);

  return {
    // SplitText splits synchronously; autoSplit re-splits after font loads and width changes.
    ready: Promise.resolve(),
    update(t: number) {
      const vs = state.speed;
      const vdir = Math.sign(state.vel);
      for (let i = 0; i < fx.length; i++) {
        const f = fx[i];
        const o = t - i;
        const ao = Math.abs(o);
        if (ao > 1.35) continue;

        // Scrubbed depth tilt: in from below/behind, away above/behind.
        const rot = o < 0 ? -o * 16 : -o * 13;
        const z = -ao * 240;
        const op = 1 - smoothstep(0.38, 0.92, ao);
        f.card.style.transform = `translate3d(0, ${(o * -4).toFixed(2)}vh, ${z.toFixed(1)}px) rotateX(${rot.toFixed(
          2,
        )}deg) rotateY(${(o * -5).toFixed(2)}deg)`;
        f.card.style.opacity = op.toFixed(3);

        // Velocity typography on nearby headings.
        const v = ao < 1.2 ? vs : 0;
        if (Math.abs(v - f.lastVs) > 0.01 || vdir !== f.lastVdir) {
          f.lastVs = v;
          f.lastVdir = vdir;
          for (const h of f.heads) {
            h.style.setProperty('--vs', v.toFixed(3));
            h.style.setProperty('--vdir', String(vdir));
          }
        }

        // About: words light up as you fly in.
        if (i === aboutIdx && f.words.length) {
          const p = clamp(o + 1);
          if (Math.abs(p - f.lastWordP) > 0.002) {
            f.lastWordP = p;
            const n = f.words.length;
            const spread = 7;
            for (let k = 0; k < n; k++) {
              const lit = clamp((p * (n + spread) - k) / spread);
              f.words[k].style.opacity = (0.16 + 0.84 * lit).toFixed(3);
            }
          }
        }
      }
    },
  };
}
