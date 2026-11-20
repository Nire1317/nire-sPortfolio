import { CatmullRomCurve3, Euler, Matrix4, Vector3 } from 'three';
import { gaussian, mulberry32 } from '../core/math';
import { F, FORMATIONS, type World } from './world';

/**
 * Every particle has a position in every formation. Positions are stored
 * relative to the formation centre (uCenter[f] in the shader), with a fourth
 * component whose meaning depends on the formation:
 *  - rings: ring index (0..2), or -1 for loose haze
 *  - tunnel: flow speed
 *  - scaffold: 0 = on a built edge, 1..2 = assembling (phase), 2..3 = loose part
 *  - others: brightness level 0..1
 */
export interface Baked {
  count: number;
  formations: Float32Array[];
  rand: Float32Array;
  ringDefs: RingDef[];
  journeyNodes: Vector3[];
  journeyCurve: CatmullRomCurve3;
  scaffoldSegments: Float32Array;
  helixAxis: Vector3;
}

export interface RingDef {
  radius: number;
  tilt: Euler;
}

export const RING_DEFS: RingDef[] = [
  { radius: 2.1, tilt: new Euler(1.2, 0.0, 0.32) },
  { radius: 2.85, tilt: new Euler(1.42, 0.55, -0.42) },
  { radius: 3.6, tilt: new Euler(1.05, -0.6, 0.55) },
];

const HELIX_TILT = new Euler(0.15, 0, 0.42);

export function bake(count: number, world: World): Baked {
  const rand = mulberry32(1317);
  const formations = Array.from({ length: FORMATIONS }, () => new Float32Array(count * 4));
  const r = new Float32Array(count * 4);
  for (let i = 0; i < count * 4; i++) r[i] = rand();

  const v = new Vector3();
  const set = (f: number, i: number, x: number, y: number, z: number, w: number) => {
    const a = formations[f];
    a[i * 4] = x;
    a[i * 4 + 1] = y;
    a[i * 4 + 2] = z;
    a[i * 4 + 3] = w;
  };
  const setV = (f: number, i: number, p: Vector3, w: number) => set(f, i, p.x, p.y, p.z, w);
  const onSphere = (out: Vector3) => {
    const u = rand() * 2 - 1;
    const th = rand() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    return out.set(s * Math.cos(th), u, s * Math.sin(th));
  };

  /* ---- 0: core shell ---- */
  const bandTilt = new Matrix4().makeRotationFromEuler(new Euler(0.35, 0, -0.25));
  for (let i = 0; i < count; i++) {
    const k = rand();
    if (k < 0.68) {
      onSphere(v).multiplyScalar(2.35 + Math.pow(rand(), 1.8) * 1.45);
      set(F.core, i, v.x, v.y, v.z, 0.45 + rand() * 0.3);
    } else if (k < 0.86) {
      const a = rand() * Math.PI * 2;
      const rad = 2.7 + gaussian(rand) * 0.18;
      v.set(Math.cos(a) * rad, gaussian(rand) * 0.04, Math.sin(a) * rad).applyMatrix4(bandTilt);
      set(F.core, i, v.x, v.y, v.z, 0.9);
    } else {
      onSphere(v).multiplyScalar(4.2 + rand() * 2.4);
      set(F.core, i, v.x, v.y, v.z, 0.2);
    }
  }

  /* ---- 1: double helix ---- */
  const helixM = new Matrix4().makeRotationFromEuler(HELIX_TILT);
  const H = 6.6;
  const HR = 1.35;
  const turns = 2.25;
  const strand = (s: number, phase: number, out: Vector3) => {
    const a = s * turns * Math.PI * 2 + phase;
    return out.set(Math.cos(a) * HR, (s - 0.5) * H, Math.sin(a) * HR);
  };
  const tmpA = new Vector3();
  const tmpB = new Vector3();
  for (let i = 0; i < count; i++) {
    const k = rand();
    if (k < 0.76) {
      const s = rand();
      strand(s, k < 0.38 ? 0 : Math.PI, v);
      v.x += gaussian(rand) * 0.06;
      v.y += gaussian(rand) * 0.06;
      v.z += gaussian(rand) * 0.06;
      setV(F.helix, i, v.applyMatrix4(helixM), 0.85);
    } else if (k < 0.92) {
      const rung = Math.floor(rand() * 26);
      const s = (rung + 0.5) / 26;
      strand(s, 0, tmpA);
      strand(s, Math.PI, tmpB);
      v.lerpVectors(tmpA, tmpB, rand());
      v.y += gaussian(rand) * 0.02;
      setV(F.helix, i, v.applyMatrix4(helixM), 0.5);
    } else {
      const a = rand() * Math.PI * 2;
      const rad = 1.6 + rand() * 2.2;
      v.set(Math.cos(a) * rad, (rand() - 0.5) * H * 1.25, Math.sin(a) * rad);
      setV(F.helix, i, v.applyMatrix4(helixM), 0.1);
    }
  }
  const helixAxis = new Vector3(0, 1, 0).applyMatrix4(helixM).normalize();

  /* ---- 2: orbit rings (local ring coordinates; the shader applies each ring's matrix) ---- */
  const circ = RING_DEFS.map((d) => d.radius);
  const total = circ.reduce((a, b) => a + b, 0);
  for (let i = 0; i < count; i++) {
    const k = rand();
    if (k < 0.86) {
      let pick = rand() * total;
      let ring = 0;
      while (ring < 2 && pick > circ[ring]) pick -= circ[ring++];
      const a = rand() * Math.PI * 2;
      const rad = RING_DEFS[ring].radius + gaussian(rand) * 0.05;
      set(F.rings, i, Math.cos(a) * rad, gaussian(rand) * 0.03, Math.sin(a) * rad, ring);
    } else {
      onSphere(v).multiplyScalar(1.2 + rand() * 4);
      set(F.rings, i, v.x, v.y, v.z, -1);
    }
  }

  /* ---- 3: starfield tunnel along -Z ---- */
  const L = world.tunnel.length;
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2;
    const rad = 3.2 + Math.pow(rand(), 0.7) * 6.5;
    set(F.tunnel, i, Math.cos(a) * rad, Math.sin(a) * rad, (rand() - 0.5) * L, rand());
  }

  /* ---- 4: journey path ---- */
  const nodes: Vector3[] = [];
  const steps = 5;
  for (let k = 0; k < steps; k++) {
    nodes.push(new Vector3(-5.2 + k * 2.6, -1.2 + k * 0.6, Math.sin(k * 1.55 + 0.3) * 2.4));
  }
  const ext = (a: Vector3, b: Vector3) => a.clone().add(a.clone().sub(b).multiplyScalar(0.55));
  const curve = new CatmullRomCurve3([ext(nodes[0], nodes[1]), ...nodes, ext(nodes[steps - 1], nodes[steps - 2])], false, 'centripetal');
  for (let i = 0; i < count; i++) {
    const k = rand();
    if (k < 0.55) {
      curve.getPointAt(rand(), v);
      v.x += gaussian(rand) * 0.14;
      v.y += gaussian(rand) * 0.05;
      v.z += gaussian(rand) * 0.14;
      set(F.journey, i, v.x, v.y, v.z, 0.35);
    } else if (k < 0.7) {
      const n = nodes[Math.floor(rand() * steps)];
      onSphere(v).multiplyScalar(Math.pow(rand(), 2) * 0.32).add(n);
      set(F.journey, i, v.x, v.y, v.z, 1);
    } else {
      curve.getPointAt(rand(), v);
      onSphere(tmpA).multiplyScalar(0.6 + rand() * 2.6);
      v.add(tmpA);
      set(F.journey, i, v.x, v.y, v.z, 0.08);
    }
  }

  /* ---- 5: crystal lattice (octahedral) ---- */
  const S = 0.62;
  const N = 3;
  const latNodes: Vector3[] = [];
  const key = (x: number, y: number, z: number) => `${x},${y},${z}`;
  const inSet = new Set<string>();
  for (let x = -N; x <= N; x++)
    for (let y = -N; y <= N; y++)
      for (let z = -N; z <= N; z++)
        if (Math.abs(x) + Math.abs(y) + Math.abs(z) <= N) {
          latNodes.push(new Vector3(x, y, z));
          inSet.add(key(x, y, z));
        }
  const edges: [Vector3, Vector3][] = [];
  for (const n of latNodes) {
    for (const d of [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)]) {
      const m = n.clone().add(d);
      if (inSet.has(key(m.x, m.y, m.z))) edges.push([n.clone().multiplyScalar(S), m.multiplyScalar(S)]);
    }
  }
  for (let i = 0; i < count; i++) {
    const k = rand();
    if (k < 0.26) {
      const n = latNodes[Math.floor(rand() * latNodes.length)];
      v.copy(n).multiplyScalar(S);
      v.x += gaussian(rand) * 0.035;
      v.y += gaussian(rand) * 0.035;
      v.z += gaussian(rand) * 0.035;
      set(F.lattice, i, v.x, v.y, v.z, 1);
    } else if (k < 0.92) {
      const [a, b] = edges[Math.floor(rand() * edges.length)];
      v.lerpVectors(a, b, rand());
      v.x += gaussian(rand) * 0.012;
      v.y += gaussian(rand) * 0.012;
      v.z += gaussian(rand) * 0.012;
      set(F.lattice, i, v.x, v.y, v.z, 0.55);
    } else {
      onSphere(v).multiplyScalar(2.3 + rand() * 1.6);
      set(F.lattice, i, v.x, v.y, v.z, 0.25);
    }
  }

  /* ---- 6: half-built wireframe cube ---- */
  const h = 1.35;
  const c = (x: number, y: number, z: number) => new Vector3(x * h, y * h, z * h);
  const cubeEdges: [Vector3, Vector3][] = [
    [c(-1, -1, -1), c(1, -1, -1)],
    [c(1, -1, -1), c(1, -1, 1)],
    [c(1, -1, 1), c(-1, -1, 1)],
    [c(-1, -1, 1), c(-1, -1, -1)],
    [c(-1, -1, -1), c(-1, 1, -1)],
    [c(1, -1, -1), c(1, 1, -1)],
    [c(1, -1, 1), c(1, 1, 1)],
    [c(-1, 1, -1), c(1, 1, -1)],
    [c(-1, -1, 1), c(-1, 1, 1)],
    [c(1, 1, -1), c(1, 1, 1)],
    [c(1, 1, 1), c(-1, 1, 1)],
    [c(-1, 1, 1), c(-1, 1, -1)],
  ];
  const built = 7.45; // edges fully or partly assembled, in build order
  const seg: number[] = [];
  cubeEdges.forEach(([a, b], e) => {
    const f = Math.min(1, Math.max(0, built - e));
    if (f <= 0) return;
    const end = a.clone().lerp(b, f);
    seg.push(a.x, a.y, a.z, end.x, end.y, end.z);
  });
  for (let i = 0; i < count; i++) {
    const k = rand();
    const e = Math.floor(rand() * 12);
    const s = rand();
    const [a, b] = cubeEdges[e];
    v.lerpVectors(a, b, s);
    if (k < 0.9) {
      const done = e + s < built;
      if (done) {
        v.x += gaussian(rand) * 0.014;
        v.y += gaussian(rand) * 0.014;
        v.z += gaussian(rand) * 0.014;
        set(F.scaffold, i, v.x, v.y, v.z, 0);
      } else {
        set(F.scaffold, i, v.x, v.y, v.z, 1 + rand() * 0.999);
      }
    } else {
      onSphere(tmpA).multiplyScalar(0.4 + rand() * 1.6);
      v.add(tmpA);
      set(F.scaffold, i, v.x, v.y, v.z, 2 + rand() * 0.999);
    }
  }

  /* ---- 7: portal ring facing the camera ---- */
  const PR = 3.2;
  for (let i = 0; i < count; i++) {
    const k = rand();
    const a = rand() * Math.PI * 2;
    if (k < 0.8) {
      const rad = PR + gaussian(rand) * 0.15;
      set(F.portal, i, Math.cos(a) * rad, Math.sin(a) * rad, gaussian(rand) * 0.12, 0.9);
    } else if (k < 0.9) {
      const rad = PR * Math.sqrt(rand()) * 0.92;
      set(F.portal, i, Math.cos(a) * rad, Math.sin(a) * rad, -0.6 - rand() * 2.4, 0.06);
    } else {
      const rad = PR + 0.3 + Math.pow(rand(), 2) * 2.2;
      set(F.portal, i, Math.cos(a) * rad, Math.sin(a) * rad, gaussian(rand) * 0.4, 0.45);
    }
  }

  return {
    count,
    formations,
    rand: r,
    ringDefs: RING_DEFS,
    journeyNodes: nodes,
    journeyCurve: curve,
    scaffoldSegments: new Float32Array(seg),
    helixAxis,
  };
}
