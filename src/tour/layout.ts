import { clamp } from '../core/math';
import type { Region } from '../three/rig';
import type { Rect } from '../three/stage';

export interface Layout {
  w: number;
  h: number;
  stopH: number;
  portrait: boolean;
  regions: Region[];
  /** Each card's rect in viewport px when its stop is centred. */
  cardRects: Rect[];
}

const MIN_ZOOM = 0.6;
const PORTRAIT_SHARE = 0.7;
const PORTRAIT_MIN = 0.86;

/**
 * Fit pass: if a stop's content doesn't fit between the top bar and the
 * bottom edge, scale it down with CSS zoom (never below 0.6). Then measure
 * where every card sits so the 3D subject can be placed beside or above it.
 */
export function fitAndMeasure(stops: HTMLElement[]): Layout {
  const w = document.documentElement.clientWidth || window.innerWidth;
  const h = window.innerHeight;
  const portrait = h > w;
  const root = getComputedStyle(document.documentElement);
  const railW = parseFloat(root.getPropertyValue('--rail-w')) || 0;
  const topbar = document.querySelector<HTMLElement>('.topbar');
  const topH = topbar ? topbar.getBoundingClientRect().height : 64;
  const stopH = stops[0]?.offsetHeight || h;

  const regions: Region[] = [];
  const cardRects: Rect[] = [];

  for (const stop of stops) {
    const card = stop.querySelector<HTMLElement>('[data-card]');
    if (!card) continue;
    const prevTransform = card.style.transform;
    card.style.transform = 'none';
    card.style.zoom = '';
    card.style.removeProperty('--z');
    const setZoom = (z: number) => {
      card.style.zoom = z.toFixed(3);
      card.style.setProperty('--z', z.toFixed(3));
    };

    const cs = getComputedStyle(stop);
    const avail = stop.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const height = () => card.getBoundingClientRect().height;
    /** Largest zoom in [lo, 1] whose height fits `goal` (zoom re-wraps text, so search rather than scale). */
    const fitTo = (goal: number, lo: number) => {
      setZoom(lo);
      if (height() > goal + 0.5) return lo;
      let a = lo;
      let b = 1;
      for (let k = 0; k < 7; k++) {
        const m = (a + b) / 2;
        setZoom(m);
        if (height() <= goal + 0.5) a = m;
        else b = m;
      }
      return a;
    };
    const need = height();
    let zoom = 1;
    if (portrait && need > avail * PORTRAIT_SHARE) {
      // Portrait: leave the subject some sky. Tall cards may shrink a little (never below 0.86)...
      zoom = fitTo(avail * PORTRAIT_SHARE, PORTRAIT_MIN);
      setZoom(zoom);
      // ...and further, down to 0.6, only if they still don't fit at all.
      if (height() > avail + 0.5) zoom = fitTo(avail, MIN_ZOOM);
    } else if (need > avail + 0.5) {
      zoom = fitTo(avail, MIN_ZOOM);
    }
    if (zoom < 1) setZoom(zoom);
    // Never allow horizontal overflow either.
    // (scrollWidth and clientWidth share the card's own coordinate space.)
    if (card.scrollWidth > card.clientWidth + 1 && zoom > MIN_ZOOM) {
      zoom = clamp(zoom * (card.clientWidth / card.scrollWidth), MIN_ZOOM, 1);
      setZoom(zoom);
    }
    stop.style.setProperty('--fit', zoom.toFixed(3));

    const r = card.getBoundingClientRect();
    const s = stop.getBoundingClientRect();
    const centredTop = (h - stop.offsetHeight) / 2;
    const dy = s.top - centredTop;
    const rect: Rect = { x0: r.left, x1: r.right, y0: r.top - dy, y1: r.bottom - dy };
    cardRects.push(rect);
    card.style.transform = prevTransform;

    const kind = stop.dataset.kind;
    if (portrait) {
      const scrim = clamp(((stop.offsetHeight - (rect.y0 - centredTop) + 110) / stop.offsetHeight) * 100, 30, 100);
      stop.style.setProperty('--scrim-h', `${scrim.toFixed(1)}%`);
      let y1 = rect.y0 - 10;
      const y0 = topH + 6;
      if (y1 - y0 < h * 0.1) y1 = y0 + h * 0.1;
      regions.push({ x0: 10, x1: w - 10, y0, y1 });
    } else if (kind === 'contact') {
      regions.push({ ...rect, frame: true });
    } else {
      let x0 = rect.x1 + 24;
      const x1 = w - railW - 18;
      // Keep whatever room is right of the card; only claim a sliver more if there is almost none.
      if (x1 - x0 < w * 0.14) x0 = x1 - w * 0.14;
      regions.push({ x0, x1, y0: topH + 8, y1: h - 16 });
    }
  }

  return { w, h, stopH, portrait, regions, cardRects };
}
