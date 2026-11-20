import Lenis, { type VirtualScrollData } from 'lenis';
import Snap from 'lenis/snap';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { bus, state } from '../core/state';
import { clamp, damp, easeInOutCubic } from '../core/math';

export interface Tour {
  lenis: Lenis | null;
  scrollToStop(index: number, opts?: { duration?: number; immediate?: boolean }): void;
  /** Destination of the current flight, or the nearest stop when idle. */
  targetIndex(): number;
  update(dt: number): void;
  resize(): void;
}

const FLIGHT = 1.25;

/**
 * Scroll engine. Lenis (smooth wheel + syncTouch) with a mandatory snap to
 * each stop's centre. A gesture filter turns every wheel gesture, swipe or key
 * press into exactly one stop, so one swipe always moves one stop.
 */
export function createTour(stops: HTMLElement[], reduced: boolean): Tour {
  const count = stops.length;
  state.count = count;
  let lenis: Lenis | null = null;
  let snap: Snap | null = null;
  let target = 0;
  let flying = false;
  let idle = 0;
  let lastT = 0;
  let stopH = 1;
  let firstCenter = 0;

  const scrollPos = () => (lenis ? lenis.scroll : window.scrollY);

  function measure() {
    stopH = stops[0].offsetHeight || window.innerHeight;
    firstCenter = stops[0].getBoundingClientRect().top + window.scrollY + stopH / 2;
  }

  function computeT() {
    return (scrollPos() + window.innerHeight / 2 - firstCenter) / stopH;
  }

  function nearest() {
    return clamp(Math.round(computeT()), 0, count - 1);
  }

  function land(i: number) {
    if (i === state.landed) return;
    state.landed = i;
    bus.emit('land', i);
  }

  function scrollToStop(index: number, opts: { duration?: number; immediate?: boolean } = {}) {
    const i = clamp(Math.round(index), 0, count - 1);
    const el = stops[i];
    // Always a pixel number, never the element.
    const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - (window.innerHeight - el.offsetHeight) / 2);
    target = i;
    if (lenis) {
      flying = !opts.immediate;
      lenis.scrollTo(y, {
        duration: opts.duration ?? FLIGHT,
        easing: easeInOutCubic,
        immediate: opts.immediate,
        lock: true,
        force: true,
        onComplete: () => {
          flying = false;
          land(i);
        },
      });
      if (opts.immediate) {
        flying = false;
        land(i);
      }
    } else {
      window.scrollTo({ top: y, behavior: 'auto' });
    }
  }

  /* ---------- gesture filter: one gesture, one stop ---------- */

  const wheel = { last: 0, accum: 0, lockUntil: 0, lastAbs: 0 };
  const touch = { active: false, startStop: 0, startScroll: 0, startTime: 0 };

  function step(dir: number, from = flying ? target : nearest(), duration = FLIGHT) {
    const next = clamp(from + dir, 0, count - 1);
    if (next === target && !flying && Math.abs(computeT() - next) < 0.002) return;
    scrollToStop(next, { duration });
  }

  function onVirtualScroll(data: VirtualScrollData): boolean {
    const e = data.event;
    const now = performance.now();

    if (e.type === 'wheel') {
      const we = e as WheelEvent;
      if (we.ctrlKey) return true; // pinch-zoom
      if (e.cancelable) e.preventDefault();
      if (Math.abs(we.deltaX) > Math.abs(we.deltaY)) return false;
      const ad = Math.abs(we.deltaY);
      const gap = now - wheel.last;
      wheel.last = now;
      const mouseLike = we.deltaMode !== 0 || (ad >= 50 && Number.isInteger(we.deltaY) && ad % 10 === 0);
      if (now < wheel.lockUntil) {
        wheel.lastAbs = ad;
        return false;
      }
      // A fresh gesture: after a pause, a clear acceleration, or a mouse notch.
      const fresh = gap > 170 || (ad > wheel.lastAbs + 8 && ad > 20) || mouseLike;
      wheel.lastAbs = ad;
      if (!fresh && wheel.accum === 0) return false; // trackpad inertia tail
      if (fresh && gap > 170) wheel.accum = 0;
      wheel.accum += we.deltaY;
      if (Math.abs(wheel.accum) >= 24 || mouseLike) {
        const dir = Math.sign(wheel.accum || we.deltaY);
        wheel.accum = 0;
        wheel.lockUntil = now + FLIGHT * 1000 * 0.72;
        step(dir);
      }
      return false;
    }

    if (e.type === 'touchstart') {
      touch.active = true;
      touch.startStop = flying ? target : nearest();
      touch.startScroll = scrollPos();
      touch.startTime = now;
      // Lenis' VirtualScroll already tracked the start point; every flight is
      // locked, so Lenis' own touchstart reset has nothing to do.
      return false;
    }

    if (e.type === 'touchmove') {
      return !flying;
    }

    if (e.type === 'touchend' || e.type === 'touchcancel') {
      touch.active = false;
      const dist = scrollPos() - touch.startScroll;
      const elapsed = now - touch.startTime;
      if (Math.abs(dist) < 6) return false; // a tap, not a swipe: leave the tour where it is
      let dir = 0;
      const flick = Math.abs(data.deltaY) > 6 ? Math.sign(data.deltaY) : 0;
      if (Math.abs(dist) > window.innerHeight * 0.08) dir = Math.sign(dist);
      else if (elapsed < 300 && Math.abs(dist) > 10) dir = Math.sign(dist);
      else if (flick !== 0 && Math.abs(dist) > 10) dir = flick;
      const remaining = Math.abs(touch.startStop + dir - computeT());
      step(dir, touch.startStop, clamp(0.55 + remaining * 0.7, 0.55, FLIGHT));
      return false;
    }

    return true;
  }

  /* ---------- setup ---------- */

  gsap.registerPlugin(ScrollTrigger);

  if (!reduced) {
    lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.1,
      touchMultiplier: 1,
      anchors: false,
      virtualScroll: onVirtualScroll,
    });
    // Mandatory snap to every stop's centre. The gesture filter above turns
    // wheel/touch gestures into single-stop flights; the snap settles any
    // position left between stops (see the idle watchdog in update()).
    snap = new Snap(lenis, {
      type: 'mandatory',
      duration: 0.8,
      easing: easeInOutCubic,
      debounce: 260,
      onSnapComplete: (item) => {
        if (typeof item.index === 'number') land(item.index);
      },
    });
    snap.addElements(stops, { align: 'center' });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis!.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- keyboard ---------- */

  window.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    const el = e.target as HTMLElement | null;
    const tag = el?.tagName ?? '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el?.isContentEditable) return;
    const base = flying ? target : nearest();
    let next: number | null = null;
    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
        next = base + 1;
        break;
      case 'ArrowUp':
      case 'PageUp':
        next = base - 1;
        break;
      case ' ':
      case 'Spacebar':
        if (tag === 'BUTTON') return;
        next = base + (e.shiftKey ? -1 : 1);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = count - 1;
        break;
    }
    if (next === null) return;
    e.preventDefault();
    scrollToStop(next, { duration: reduced ? 0 : FLIGHT * 0.9 });
  });

  /* ---------- focus follows: Tab into a stop flies to it ---------- */

  document.querySelector('main')?.addEventListener('focusin', (e) => {
    const stop = (e.target as HTMLElement).closest<HTMLElement>('.stop');
    if (!stop) return;
    const i = stops.indexOf(stop);
    if (i < 0) return;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (i !== target || Math.abs(computeT() - i) > 0.01) scrollToStop(i, { duration: 0.85 });
      }),
    );
  });

  /* ---------- in-page links ---------- */

  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLElement>('[data-goto], [data-goto-id]');
    if (!a) return;
    let i = -1;
    const g = a.dataset.goto;
    if (g === 'last') i = count - 1;
    else if (g !== undefined) i = Number(g);
    else if (a.dataset.gotoId) i = stops.findIndex((s) => s.id === a.dataset.gotoId);
    if (i < 0 || Number.isNaN(i)) return;
    e.preventDefault();
    scrollToStop(i);
    // Keyboard activation: move focus to the destination heading as well.
    if ((e as MouseEvent).detail === 0) {
      const h = stops[i].querySelector<HTMLElement>('h1, h2');
      h?.focus({ preventScroll: true });
    }
  });

  stops.forEach((s) => s.querySelector<HTMLElement>('h1, h2')?.setAttribute('tabindex', '-1'));

  measure();

  return {
    lenis,
    scrollToStop,
    targetIndex: () => (flying ? target : nearest()),
    resize() {
      measure();
      lenis?.resize();
      measure();
      scrollToStop(state.landed >= 0 ? state.landed : target, { immediate: true });
    },
    update(dt: number) {
      const raw = computeT();
      const t = clamp(raw, 0, count - 1);
      const dT = dt > 0 ? (t - lastT) / dt : 0;
      lastT = t;
      state.t = t;
      state.current = Math.round(t);
      // Peak flight speed is about 2.5 stops per second.
      state.vel = reduced ? 0 : clamp(dT / 2.5, -1, 1);
      state.speed += (Math.abs(state.vel) - state.speed) * damp(8, dt);

      const moving = flying || touch.active || (lenis ? !!lenis.isScrolling : false);
      if (moving) {
        idle = 0;
        return;
      }
      idle += dt;
      const r = Math.round(t);
      const off = Math.abs(t - r);
      if (off < 0.004) {
        if (idle > 0.05) land(r);
      } else if (idle > (reduced ? 0.5 : 0.25)) {
        // Mandatory snap: settle anything left between stops (scrollbar drags,
        // find-in-page, resizes) onto the nearest stop's centre.
        idle = 0;
        if (snap) snap.goTo(r);
        else scrollToStop(r, { duration: 0.7 });
      }
    },
  };
}
