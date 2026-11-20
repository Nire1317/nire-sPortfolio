/** Shared, mutable per-frame state. One object, read by every system. */
export const state = {
  /** Continuous tour position: 0 = intro, 1 = about, ... (count - 1) = contact. */
  t: 0,
  /** Signed scroll velocity, normalized to roughly -1..1. */
  vel: 0,
  /** Smoothed absolute scroll speed, 0..1. */
  speed: 0,
  time: 0,
  dt: 1 / 60,
  count: 0,
  /** Nearest stop. */
  current: 0,
  /** Stop the visitor last landed on (-1 before the first landing). */
  landed: -1,
  reduced: false,
  portrait: false,
  w: 1,
  h: 1,
  /** Pointer in NDC (-1..1, y up). `active` eases to 1 while the pointer is over the page. */
  pointer: { x: 0, y: 0, sx: 0, sy: 0, active: 0, target: 0 },
  /** Device tilt, normalized -1..1. */
  tilt: { x: 0, y: 0, active: false },
  /** Becomes true after the first click, tap or key press. */
  interacted: false,
};

type Handler<T> = (payload: T) => void;

class Emitter<Events extends Record<string, unknown>> {
  private map = new Map<keyof Events, Set<Handler<never>>>();
  on<K extends keyof Events>(type: K, fn: Handler<Events[K]>) {
    let set = this.map.get(type);
    if (!set) this.map.set(type, (set = new Set()));
    set.add(fn as Handler<never>);
    return () => set!.delete(fn as Handler<never>);
  }
  emit<K extends keyof Events>(type: K, payload: Events[K]) {
    this.map.get(type)?.forEach((fn) => (fn as Handler<Events[K]>)(payload));
  }
}

export interface Shock {
  x: number;
  y: number;
  strength: number;
}

export const bus = new Emitter<{
  land: number;
  shock: Shock;
  layout: void;
  quality: number;
}>();
