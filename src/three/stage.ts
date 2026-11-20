import { ACESFilmicToneMapping, Color, Scene, SRGBColorSpace, Vector3, Vector4, WebGLRenderer } from 'three';
import { clamp, smoothstep } from '../core/math';
import { state } from '../core/state';
import type { Quality } from '../core/quality';
import type { Project } from '../content';
import type { StopKind } from '../markup';
import { buildWorld, F, type World } from './world';
import { bake, type Baked } from './formations';
import { Particles } from './particles';
import { Core } from './core';
import { Rings } from './rings';
import { Panels } from './panels';
import { JourneyNodes, Scaffold } from './extras';
import { CameraRig, type Region } from './rig';
import { Post } from './post';

export interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface StageOptions {
  canvas: HTMLCanvasElement;
  quality: Quality;
  reduced: boolean;
  kinds: StopKind[];
  projects: Project[];
  toolkitGroups: { items: string[] }[];
  labelLayer: HTMLElement;
}

export class Stage {
  readonly renderer: WebGLRenderer;
  readonly scene = new Scene();
  readonly world: World;
  private baked: Baked;
  private rig: CameraRig;
  private post: Post;
  private particles: Particles;
  private core: Core | null = null;
  private rings: Rings | null = null;
  private panels: Panels | null = null;
  private journey: JourneyNodes | null = null;
  private scaffold: Scaffold | null = null;
  private idx: Record<string, number> = {};
  private cardRects: (Rect | null)[] = [];
  private w = 1;
  private h = 1;
  private pixelRatio: number;
  private flash = 0;
  private shockSlot = 0;
  private shown = 0;
  private fading = false;
  private stopH = 1;

  constructor(private opts: StageOptions) {
    const q = opts.quality;
    this.pixelRatio = q.pixelRatio;
    this.renderer = new WebGLRenderer({
      canvas: opts.canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setClearColor(new Color('#06070B'), 1);
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setPixelRatio(this.pixelRatio);
    this.scene.background = new Color('#06070B');

    this.world = buildWorld(opts.kinds);
    this.baked = bake(q.particles, this.world);
    opts.kinds.forEach((k, i) => {
      if (this.idx[k] === undefined) this.idx[k] = i;
    });

    this.rig = new CameraRig(this.world);
    this.particles = new Particles(this.baked, this.world, q.dust, q.coarse);
    this.scene.add(this.particles.dust, this.particles.points);

    const anchorOf = (kind: StopKind) => this.world.stops[this.idx[kind]]?.anchor;
    if (anchorOf('intro')) {
      this.core = new Core(anchorOf('intro')!);
      this.scene.add(this.core.group);
    }
    if (anchorOf('toolkit')) {
      this.rings = new Rings(anchorOf('toolkit')!, this.baked.ringDefs, opts.toolkitGroups, opts.labelLayer);
      this.scene.add(this.rings.group);
    }
    const workIdx = opts.kinds.map((k, i) => (k === 'work' ? i : -1)).filter((i) => i >= 0);
    if (workIdx.length) {
      this.panels = new Panels(
        opts.projects,
        workIdx,
        workIdx.map((i) => this.world.stops[i].anchor),
        q.panelSize,
        opts.reduced,
      );
      this.scene.add(this.panels.group);
    }
    if (anchorOf('journey')) {
      this.journey = new JourneyNodes(anchorOf('journey')!, this.baked.journeyNodes);
      this.scene.add(this.journey.group);
    }
    if (anchorOf('growth')) {
      this.scaffold = new Scaffold(anchorOf('growth')!, this.baked.scaffoldSegments);
      this.scene.add(this.scaffold.group);
    }

    this.post = new Post(this.renderer, this.scene, this.rig.camera, q.bloomScale);
    if (q.step >= 1) this.post.setBloom(false);
  }

  /** Called after the layout/fit pass: regions decide where each subject sits. */
  resize(w: number, h: number, regions: Region[], cardRects: (Rect | null)[], stopH: number) {
    this.w = w;
    this.h = h;
    this.stopH = stopH;
    this.cardRects = cardRects;
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(w, h, false);
    this.post.setSize(w, h, this.pixelRatio);
    this.rig.build(regions, w, h);
    this.rig.camera.updateProjectionMatrix();
    this.particles.setViewport(h * this.pixelRatio, this.rig.camera.projectionMatrix.elements[5], this.pixelRatio, w / h);
    this.rings?.measure();
  }

  fontsReady() {
    this.rings?.measure();
    this.panels?.redrawAll();
  }

  setQualityStep(step: number) {
    if (step >= 1) {
      this.post.setBloom(false);
      this.pixelRatio = Math.max(0.75, this.pixelRatio * 0.75);
      this.renderer.setPixelRatio(this.pixelRatio);
      this.renderer.setSize(this.w, this.h, false);
      this.post.setSize(this.w, this.h, this.pixelRatio);
      this.particles.setViewport(this.h * this.pixelRatio, this.rig.camera.projectionMatrix.elements[5], this.pixelRatio, this.w / this.h);
    }
    if (step >= 2) this.particles.setFraction(0.5);
  }

  shockAt(x: number, y: number, strength: number) {
    this.shockSlot = (this.shockSlot + 1) % 2;
    const s = this.particles.material.uniforms.uShock.value as Vector4[];
    s[this.shockSlot].set(x, y, state.time, strength);
  }

  land(i: number) {
    const sh = this.rig.shift;
    if (!this.opts.reduced) {
      this.shockAt(sh.x, sh.y, 1);
      this.flash = 1;
    } else {
      this.flash = 0.3;
    }
    (this.post.final.uniforms.uFlashAt.value as { set(x: number, y: number): void }).set(sh.x * 0.5 + 0.5, sh.y * 0.5 + 0.5);
    this.panels?.land(i);
  }

  /** Subject centre in CSS px, for DOM effects. */
  subjectScreen() {
    const sh = this.rig.shift;
    return { x: (sh.x * 0.5 + 0.5) * this.w, y: (0.5 - sh.y * 0.5) * this.h };
  }

  /** Projected centre and radius (CSS px) of the current stop's subject, for automated layout checks. */
  debugSubject() {
    const i = state.current;
    const s = this.world.stops[i];
    const cam = this.rig.camera;
    const c = s.anchor.clone().project(cam);
    const right = new Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
    const e = s.anchor.clone().addScaledVector(right, s.radius).project(cam);
    const x = (c.x * 0.5 + 0.5) * this.w;
    const y = (0.5 - c.y * 0.5) * this.h;
    const ex = (e.x * 0.5 + 0.5) * this.w;
    const ey = (0.5 - e.y * 0.5) * this.h;
    return { stop: i, kind: s.kind, x, y, r: Math.hypot(ex - x, ey - y) };
  }

  private presence(kind: StopKind, t: number, inner = 0.5, outer = 1.3) {
    const i = this.idx[kind];
    if (i === undefined) return 0;
    return 1 - smoothstep(inner, outer, Math.abs(t - i));
  }

  update(dt: number) {
    const s = state;
    const time = s.time;
    let t = s.t;
    if (this.opts.reduced) {
      // Reduced motion: cross-fade between stops instead of flying.
      const target = s.current;
      if (target !== this.shown && !this.fading) {
        this.fading = true;
        document.documentElement.classList.add('gl-fading');
        window.setTimeout(() => {
          this.shown = target;
          document.documentElement.classList.remove('gl-fading');
          this.fading = false;
        }, 240);
      }
      t = this.shown;
    }

    const px = s.tilt.active ? s.tilt.x : s.pointer.sx;
    const py = s.tilt.active ? s.tilt.y : s.pointer.sy;
    const speed = this.opts.reduced ? 0 : s.speed;
    this.rig.update(t, dt, speed, px * 0.6, py * 0.6);
    const cam = this.rig.camera;

    // Formation morph
    const n = this.world.stops.length - 1;
    let i0 = Math.floor(t);
    let f = t - i0;
    if (i0 >= n) {
      i0 = n;
      f = 0;
    }
    const from = this.world.stops[i0].formation;
    const to = this.world.stops[Math.min(i0 + 1, n)].formation;
    let mix = from === to ? 0 : f;
    if (from === F.core) mix = clamp((f - 0.24) / 0.76);
    const u = this.particles.material.uniforms;
    u.uFrom.value = from;
    u.uTo.value = from === to ? from : to;
    u.uMix.value = mix;
    u.uTime.value = time;
    u.uFlash.value = this.flash;
    // Fade distant formations, but never the one we are looking at.
    u.uFar.value = Math.max(42, this.rig.distanceAt(Math.round(t)) + 22);
    const ptr = u.uPointer.value as { set(x: number, y: number, z: number): void };
    ptr.set(s.pointer.sx, s.pointer.sy, this.opts.reduced ? 0 : s.pointer.active);
    this.particles.dustMaterial.uniforms.uTime.value = time;

    if (this.core) {
      const { swell, implode } = this.core.update(t, time, dt, px, py, this.flash, cam.position);
      u.uSwell.value = swell;
      u.uImplode.value = implode;
    }

    if (this.rings) {
      const pres = this.presence('toolkit', t, 0.25, 0.8);
      this.rings.update(time, dt, speed, pres);
      const mats = u.uRingMat.value as { copy(m: unknown): void }[];
      this.rings.ringMatrices.forEach((m, k) => mats[k].copy(m));
      const ti = this.idx.toolkit;
      const card = this.cardRects[ti];
      const off = (t - ti) * this.stopH;
      const avoid = card ? { x0: card.x0 - 12, y0: card.y0 - off - 12, x1: card.x1 + 12, y1: card.y1 - off + 12 } : null;
      this.rings.updateLabels(cam, this.w, this.h, pres, avoid, dt);
    }

    this.panels?.update(t, time, dt, px, py, this.h > this.w, cam);
    this.journey?.update(time, this.presence('journey', t, 0.3, 0.85), cam.position);
    if (this.scaffold) {
      const gi = this.idx.growth;
      this.scaffold.update(time, this.presence('growth', t, 0.3, 0.85), smoothstep(-1.0, -0.1, t - gi), cam.position);
    }

    const fu = this.post.final.uniforms;
    fu.uTime.value = time;
    fu.uVel.value = speed;
    fu.uFlash.value = this.flash;
    this.flash *= Math.exp(-dt * 3.4);
  }

  render(dt: number) {
    this.post.render(dt);
  }
}
