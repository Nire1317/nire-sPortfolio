import { CatmullRomCurve3, MathUtils, PerspectiveCamera, Vector2, Vector3 } from 'three';
import { clamp, damp, smoothstep } from '../core/math';
import type { World } from './world';

/** Screen rectangle (CSS px) where a stop's 3D subject should sit. */
export interface Region {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** Contact on landscape: the ring frames the centred text instead. */
  frame?: boolean;
}

const FILL = 0.84;

/**
 * Flies the camera along a centripetal Catmull-Rom curve through per-stop
 * poses. The projection matrix is shifted so each subject sits in its screen
 * region (beside the text on landscape, above it on portrait), and the camera
 * dollies per stop so wide subjects still fit.
 */
export class CameraRig {
  readonly camera: PerspectiveCamera;
  private camCurve!: CatmullRomCurve3;
  private lookCurve!: CatmullRomCurve3;
  private shifts: Vector2[] = [];
  private dists: number[] = [];
  private baseFov = 42;
  private fov = 42;
  private roll = 0;
  private primed = false;
  private prev = new Vector3();
  private pos = new Vector3();
  private look = new Vector3();
  private right = new Vector3();
  private up = new Vector3();
  private fwd = new Vector3();
  private vel = new Vector3();
  readonly shift = new Vector2();

  constructor(private world: World) {
    this.camera = new PerspectiveCamera(42, 1, 0.05, 160);
  }

  build(regions: Region[], w: number, h: number) {
    const portrait = h > w;
    this.baseFov = portrait ? 52 : 42;
    const tanV = Math.tan(MathUtils.degToRad(this.baseFov) / 2);
    const aspect = w / h;
    const cams: Vector3[] = [];
    const looks: Vector3[] = [];
    this.shifts = [];
    this.dists = [];
    this.world.stops.forEach((s, i) => {
      const r = regions[i] ?? { x0: w * 0.5, y0: 0, x1: w, y1: h };
      let d: number;
      let cx: number;
      let cy: number;
      if (r.frame) {
        // The portal ring's inner edge should clear the text block.
        // ...but stay inside the viewport (centred text leaves the card corners empty).
        const half = Math.min(Math.max(r.x1 - r.x0, r.y1 - r.y0) / 2 + 36, h * 0.47);
        const innerR = 2.95;
        d = (innerR * (h / 2)) / (tanV * half);
        d = clamp(d, s.dist * 0.6, s.dist * 2.2);
        cx = (r.x0 + r.x1) / w - 1;
        cy = 1 - (r.y0 + r.y1) / h;
      } else {
        const rx = Math.max(0.08, (r.x1 - r.x0) / w);
        const ry = Math.max(0.08, (r.y1 - r.y0) / h);
        const fit = Math.max(s.radius / (tanV * ry * FILL), s.radius / (tanV * aspect * rx * FILL));
        d = clamp(fit, s.dist * 0.72, s.dist * 5.5);
        cx = (r.x0 + r.x1) / w - 1;
        cy = 1 - (r.y0 + r.y1) / h;
      }
      cams.push(s.anchor.clone().addScaledVector(s.dir, d));
      looks.push(s.anchor.clone());
      this.shifts.push(new Vector2(cx, cy));
      this.dists.push(d);
    });
    if (cams.length === 1) {
      cams.push(cams[0].clone().add(new Vector3(0, 0, -0.01)));
      looks.push(looks[0].clone());
    }
    this.camCurve = new CatmullRomCurve3(cams, false, 'centripetal');
    this.lookCurve = new CatmullRomCurve3(looks, false, 'centripetal');
    this.camera.aspect = aspect;
    this.primed = false;
  }

  /** Distance from camera to subject at a stop (for parallax scaling). */
  distanceAt(i: number) {
    return this.dists[Math.max(0, Math.min(this.dists.length - 1, i))] ?? 10;
  }

  update(t: number, dt: number, speed: number, px: number, py: number) {
    const n = this.world.stops.length - 1;
    const tt = clamp(t, 0, n);
    const u = n > 0 ? tt / n : 0;
    this.camCurve.getPoint(u, this.pos);
    this.lookCurve.getPoint(u, this.look);

    const i0 = Math.min(Math.floor(tt), n);
    const i1 = Math.min(i0 + 1, n);
    const f = smoothstep(0, 1, tt - i0);
    this.shift.lerpVectors(this.shifts[i0], this.shifts[i1], f);

    // Parallax from pointer / device tilt.
    this.fwd.copy(this.look).sub(this.pos).normalize();
    this.right.crossVectors(this.fwd, this.camera.up).normalize();
    this.up.crossVectors(this.right, this.fwd);
    const dist = this.dists[i0] + (this.dists[i1] - this.dists[i0]) * f;
    const amt = dist * 0.04;
    this.pos.addScaledVector(this.right, px * amt).addScaledVector(this.up, py * amt * 0.7);

    // Bank into lateral movement.
    if (!this.primed) {
      this.prev.copy(this.pos);
      this.primed = true;
    }
    this.vel.copy(this.pos).sub(this.prev).divideScalar(Math.max(dt, 1e-3));
    this.prev.copy(this.pos);
    const lateral = this.vel.dot(this.right);
    const targetRoll = clamp(-lateral * 0.006, -0.14, 0.14);
    this.roll += (targetRoll - this.roll) * damp(3.5, dt);

    this.camera.position.copy(this.pos);
    this.camera.lookAt(this.look);
    this.camera.rotateZ(this.roll);

    // FOV kick with scroll speed.
    const targetFov = this.baseFov + speed * 11;
    this.fov += (targetFov - this.fov) * damp(6, dt);
    this.camera.fov = this.fov;
    this.camera.updateProjectionMatrix();
    const e = this.camera.projectionMatrix.elements;
    e[8] = -this.shift.x;
    e[9] = -this.shift.y;
    this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
    this.camera.updateMatrixWorld();
  }
}
