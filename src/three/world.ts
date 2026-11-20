import { Vector3 } from 'three';
import type { StopKind } from '../markup';

/** Formation ids, also the attribute index (aF0 ... aF7) in the particle shader. */
export const F = {
  core: 0,
  helix: 1,
  rings: 2,
  tunnel: 3,
  journey: 4,
  lattice: 5,
  scaffold: 6,
  portal: 7,
} as const;

export const FORMATIONS = 8;

export interface StopPose {
  kind: StopKind;
  formation: number;
  /** World-space centre of the stop's 3D subject. */
  anchor: Vector3;
  /** Unit vector from subject to camera. */
  dir: Vector3;
  /** Preferred camera distance. */
  dist: number;
  /** Bounding radius of the subject, used to fit it beside the text. */
  radius: number;
}

export interface World {
  stops: StopPose[];
  centers: Vector3[];
  tunnel: { length: number; first: number; last: number };
}

interface KindDef {
  formation: number;
  step: [number, number, number];
  dir: [number, number, number];
  dist: number;
  radius: number;
}

const KINDS: Record<StopKind, KindDef> = {
  intro: { formation: F.core, step: [0, 0, 0], dir: [0.05, 0.08, 1], dist: 10, radius: 3.7 },
  about: { formation: F.helix, step: [7, 2.5, -26], dir: [-0.42, 0.1, 1], dist: 11, radius: 3.7 },
  toolkit: { formation: F.rings, step: [-11, -3, -26], dir: [0.22, 0.55, 1], dist: 12, radius: 4.0 },
  work: { formation: F.tunnel, step: [4, 1.5, -30], dir: [0, 0.03, 1], dist: 6.4, radius: 1.95 },
  journey: { formation: F.journey, step: [9, 3, -30], dir: [0.12, 1.0, 0.75], dist: 13, radius: 5.6 },
  shine: { formation: F.lattice, step: [-11, 3, -27], dir: [-0.3, 0.25, 1], dist: 10, radius: 3.0 },
  growth: { formation: F.scaffold, step: [10, -4, -26], dir: [0.4, 0.3, 1], dist: 10, radius: 2.7 },
  contact: { formation: F.portal, step: [-5, 2, -28], dir: [0, 0, 1], dist: 8, radius: 3.5 },
};

/** Distance between consecutive project screens inside the tunnel. */
export const WORK_SPACING = 15;

export function buildWorld(kinds: StopKind[]): World {
  const stops: StopPose[] = [];
  const cursor = new Vector3();
  let prev: StopKind | null = null;
  for (const kind of kinds) {
    const def = KINDS[kind];
    if (prev !== null) {
      if (kind === 'work' && prev === 'work') cursor.z -= WORK_SPACING;
      else cursor.add(new Vector3(...def.step));
    }
    stops.push({
      kind,
      formation: def.formation,
      anchor: cursor.clone(),
      dir: new Vector3(...def.dir).normalize(),
      dist: def.dist,
      radius: def.radius,
    });
    prev = kind;
  }

  const centers = Array.from({ length: FORMATIONS }, () => new Vector3());
  const works = stops.filter((s) => s.kind === 'work');
  for (const s of stops) if (s.kind !== 'work') centers[s.formation].copy(s.anchor);

  let tunnel = { length: 60, first: 0, last: 0 };
  if (works.length) {
    const first = works[0].anchor;
    const last = works[works.length - 1].anchor;
    const front = first.z + 22;
    const back = last.z - 18;
    centers[F.tunnel].set(first.x, first.y, (front + back) / 2);
    tunnel = { length: front - back, first: first.z, last: last.z };
  }
  return { stops, centers, tunnel };
}
