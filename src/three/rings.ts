import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  Matrix3,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  TorusGeometry,
  Vector3,
  type PerspectiveCamera,
} from 'three';
import { clamp, damp, smoothstep } from '../core/math';
import type { RingDef } from './formations';

const RING_COLORS = ['#FF6B3D', '#9FD8FF', '#C6F36B'];

interface Label {
  el: HTMLSpanElement;
  ring: number;
  angle: number;
  w: number;
  h: number;
  alpha: number;
  x: number;
  y: number;
  depth: number;
  facing: number;
  scale: number;
}

interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/**
 * Toolkit subject: three tilted orbit rings, one per stack group. Tech names
 * are HTML labels projected onto the rings every frame. Labels fade on the far
 * side, and a label that would overlap one nearer the camera fades out.
 */
export class Rings {
  readonly group = new Group();
  private spinGroups: Group[] = [];
  private materials: MeshBasicMaterial[] = [];
  private beadMats: PointsMaterial[] = [];
  private angles = [0, 0, 0];
  private labels: Label[] = [];
  private container: HTMLElement;
  private visible = false;
  readonly ringMatrices = [new Matrix3(), new Matrix3(), new Matrix3()];
  private tmpM = new Matrix4();
  private v = new Vector3();
  private toCam = new Vector3();
  private center: Vector3;

  constructor(
    anchor: Vector3,
    private defs: RingDef[],
    groups: { items: string[] }[],
    container: HTMLElement,
  ) {
    this.center = anchor.clone();
    this.container = container;
    this.group.position.copy(anchor);
    defs.forEach((d, k) => {
      const tilt = new Group();
      tilt.rotation.copy(d.tilt);
      const spin = new Group();
      const mat = new MeshBasicMaterial({
        color: new Color(RING_COLORS[k]),
        transparent: true,
        opacity: 0.5,
        blending: AdditiveBlending,
        depthWrite: false,
      });
      const torus = new Mesh(new TorusGeometry(d.radius, 0.012, 6, 220), mat);
      torus.rotation.x = Math.PI / 2; // torus lies in XY; rings live in XZ
      spin.add(torus);
      // Beads where the labels sit.
      const items = groups[k]?.items ?? [];
      const pos = new Float32Array(items.length * 3);
      items.forEach((_, i) => {
        const a = (i / items.length) * Math.PI * 2;
        pos[i * 3] = Math.cos(a) * d.radius;
        pos[i * 3 + 2] = Math.sin(a) * d.radius;
      });
      const bg = new BufferGeometry();
      bg.setAttribute('position', new BufferAttribute(pos, 3));
      const bm = new PointsMaterial({
        color: new Color(RING_COLORS[k]),
        size: 0.13,
        transparent: true,
        opacity: 0.9,
        blending: AdditiveBlending,
        depthWrite: false,
      });
      spin.add(new Points(bg, bm));
      tilt.add(spin);
      this.group.add(tilt);
      this.spinGroups.push(spin);
      this.materials.push(mat);
      this.beadMats.push(bm);
      this.angles[k] = k * 1.7;
    });

    groups.forEach((g, k) => {
      g.items.forEach((name, i) => {
        const el = document.createElement('span');
        el.className = 'ring-label';
        el.dataset.group = String(k);
        el.textContent = name;
        container.appendChild(el);
        this.labels.push({
          el,
          ring: k,
          angle: (i / g.items.length) * Math.PI * 2,
          w: 0,
          h: 0,
          alpha: 0,
          x: 0,
          y: 0,
          depth: 0,
          facing: 0,
          scale: 1,
        });
      });
    });
    this.measure();
  }

  /** Label sizes, read once (and after fonts load) to avoid layout reads per frame. */
  measure() {
    for (const l of this.labels) {
      l.w = l.el.offsetWidth;
      l.h = l.el.offsetHeight;
    }
  }

  /** Spin and per-ring matrices for the particle shader. `presence` 0..1 fades everything. */
  update(time: number, dt: number, speed: number, presence: number) {
    const base = [0.14, -0.1, 0.075];
    for (let k = 0; k < this.spinGroups.length; k++) {
      this.angles[k] += (base[k] + Math.sign(base[k]) * speed * 2.6) * dt;
      this.spinGroups[k].rotation.y = this.angles[k];
      this.materials[k].opacity = 0.5 * presence;
      this.beadMats[k].opacity = 0.9 * presence;
    }
    this.group.visible = presence > 0.001;
    this.group.updateMatrixWorld(true);
    for (let k = 0; k < this.spinGroups.length; k++) {
      this.tmpM.extractRotation(this.spinGroups[k].matrixWorld);
      this.ringMatrices[k].setFromMatrix4(this.tmpM);
    }
    void time;
  }

  /** Projects labels onto the rings. `avoid` is the text card's screen rect. */
  updateLabels(camera: PerspectiveCamera, w: number, h: number, presence: number, avoid: Rect | null, dt: number) {
    const show = presence > 0.05;
    if (show !== this.visible) {
      this.visible = show;
      this.container.style.visibility = show ? 'visible' : 'hidden';
    }
    if (!show) return;
    this.toCam.copy(camera.position).sub(this.center).normalize();
    for (const l of this.labels) {
      const spin = this.spinGroups[l.ring];
      const r = this.defs[l.ring].radius;
      this.v.set(Math.cos(l.angle) * r, 0, Math.sin(l.angle) * r).applyMatrix4(spin.matrixWorld);
      const dir = this.v.clone().sub(this.center).normalize();
      l.facing = dir.dot(this.toCam);
      l.depth = this.v.distanceTo(camera.position);
      this.v.project(camera);
      l.x = (this.v.x * 0.5 + 0.5) * w;
      l.y = (-this.v.y * 0.5 + 0.5) * h;
      l.scale = clamp(13 / l.depth, 0.72, 1.1);
    }
    const order = [...this.labels].sort((a, b) => a.depth - b.depth);
    const placed: Rect[] = [];
    const k = damp(10, dt);
    for (const l of order) {
      const hw = (l.w * l.scale) / 2 + 4;
      const hh = (l.h * l.scale) / 2 + 2;
      const rect = { x0: l.x - hw, y0: l.y - hh, x1: l.x + hw, y1: l.y + hh };
      let target = smoothstep(-0.2, 0.35, l.facing) * presence;
      const off = rect.x0 < 4 || rect.y0 < 56 || rect.x1 > w - 4 || rect.y1 > h - 4;
      if (off) target = 0;
      if (target > 0.05 && avoid && overlaps(rect, avoid)) target = 0;
      if (target > 0.05) {
        for (const p of placed) {
          if (overlaps(rect, p)) {
            target = 0;
            break;
          }
        }
      }
      if (target > 0.3) placed.push(rect);
      l.alpha += (target - l.alpha) * k;
      const a = l.alpha < 0.01 ? 0 : l.alpha;
      l.el.style.opacity = a.toFixed(3);
      if (a > 0) {
        l.el.style.transform = `translate3d(${(l.x - (l.w * l.scale) / 2).toFixed(1)}px, ${(l.y - (l.h * l.scale) / 2).toFixed(
          1,
        )}px, 0) scale(${l.scale.toFixed(3)})`;
      }
    }
  }
}

function overlaps(a: Rect, b: Rect) {
  return a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
}
