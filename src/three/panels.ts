import {
  CanvasTexture,
  Color,
  Group,
  LinearFilter,
  Mesh,
  PlaneGeometry,
  SRGBColorSpace,
  ShaderMaterial,
  Vector2,
  Vector3,
  type PerspectiveCamera,
} from 'three';
import { gsap } from 'gsap';
import uvVert from '../shaders/uv.vert.glsl?raw';
import panelFrag from '../shaders/panel.frag.glsl?raw';
import { clamp, damp, smoothstep } from '../core/math';
import type { Project } from '../content';
import { averageLuminance, chromeHeight, drawChrome, drawDelivery, drawLogistics, drawScreenshot } from './panelArt';
import { glowMaterial } from './core';

const PW = 3.2;
const PH = 2.0;

interface Panel {
  project: Project;
  stop: number;
  anchor: Vector3;
  group: Group;
  mat: ShaderMaterial;
  glow: Mesh;
  glowMat: ShaderMaterial;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  tex: CanvasTexture;
  img: HTMLImageElement | null;
  lum: number;
  animated: boolean;
  lastDraw: number;
  scan: { v: number };
  scanned: boolean;
  rx: number;
  ry: number;
}

/**
 * Work subject: one floating "screen" per project. Each enters from depth,
 * tilts toward the pointer, powers on with a scan-line sweep when you land,
 * and leaves away from the text (right on desktop, up on phones).
 */
export class Panels {
  readonly group = new Group();
  private panels: Panel[] = [];
  private exitDir = new Vector3(1, 0, 0);
  private tmp = new Vector3();
  private camRight = new Vector3();
  private camUp = new Vector3();
  private firstStop: number;

  constructor(
    projects: Project[],
    stopIndices: number[],
    anchors: Vector3[],
    size: number,
    private reduced: boolean,
  ) {
    this.firstStop = Math.min(...stopIndices);
    const W = size;
    const H = Math.round(size * (PH / PW));
    projects.forEach((project, k) => {
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d')!;
      const tex = new CanvasTexture(canvas);
      tex.colorSpace = SRGBColorSpace;
      tex.minFilter = LinearFilter;
      tex.generateMipmaps = false;
      tex.anisotropy = 4;
      const accent = new Color(project.accent);
      const mat = new ShaderMaterial({
        vertexShader: uvVert,
        fragmentShader: panelFrag,
        transparent: true,
        uniforms: {
          uMap: { value: tex },
          uScan: { value: reduced ? 1.05 : 0 },
          uOpacity: { value: 0 },
          uAccent: { value: accent },
          uTime: { value: 0 },
          uSize: { value: new Vector2(PW, PH) },
          uRadius: { value: 0.07 },
        },
      });
      const mesh = new Mesh(new PlaneGeometry(PW, PH), mat);
      mesh.renderOrder = 1;
      const glowMat = glowMaterial(project.accent, 0.3);
      const glow = new Mesh(new PlaneGeometry(PW * 1.9, PH * 2.1), glowMat);
      glow.position.z = -0.25;
      glow.renderOrder = 0;
      const group = new Group();
      group.add(glow, mesh);
      group.position.copy(anchors[k]);
      this.group.add(group);
      const panel: Panel = {
        project,
        stop: stopIndices[k],
        anchor: anchors[k].clone(),
        group,
        mat,
        glow,
        glowMat,
        canvas,
        ctx,
        tex,
        img: null,
        lum: 0.4,
        animated: !project.screenshot,
        lastDraw: -1,
        scan: { v: reduced ? 1.05 : 0 },
        scanned: reduced,
        rx: 0,
        ry: 0,
      };
      this.panels.push(panel);
      if (project.screenshot) {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          panel.img = img;
          panel.lum = averageLuminance(img);
          this.draw(panel, 0);
        };
        img.src = `${import.meta.env.BASE_URL}${project.screenshot}`;
      }
      this.draw(panel, 0);
    });
  }

  /** Redraw everything (after web fonts load, for crisp chrome text). */
  redrawAll() {
    for (const p of this.panels) this.draw(p, p.lastDraw < 0 ? 0 : p.lastDraw);
  }

  private draw(p: Panel, time: number) {
    const { ctx, canvas } = p;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0b0e15';
    ctx.fillRect(0, 0, W, H);
    const top = chromeHeight(H);
    if (p.project.screenshot) {
      if (p.img) drawScreenshot(ctx, p.img, 0, top, W, H - top, p.lum);
    } else if (p.project.art === 'delivery') {
      drawDelivery(ctx, W, H, time, p.project.accent);
    } else {
      drawLogistics(ctx, W, H, time, p.project.accent);
    }
    drawChrome(ctx, W, H, p.project.chrome, p.project.accent, !!p.project.link);
    p.tex.needsUpdate = true;
    p.lastDraw = time;
  }

  /** Power-on sweep when the visitor lands on a project. */
  land(stop: number) {
    for (const p of this.panels) {
      if (p.stop !== stop || this.reduced) continue;
      gsap.killTweensOf(p.scan);
      p.scan.v = 0;
      p.scanned = true;
      gsap.to(p.scan, { v: 1.06, duration: 1.15, ease: 'power2.inOut' });
    }
  }

  update(t: number, time: number, dt: number, px: number, py: number, portrait: boolean, camera: PerspectiveCamera) {
    camera.matrixWorld.extractBasis(this.camRight, this.camUp, this.tmp);
    this.exitDir.copy(portrait ? this.camUp : this.camRight);
    let any = false;
    for (const p of this.panels) {
      const o = t - p.stop;
      const visible = o > -2.4 && o < 1.3;
      p.group.visible = visible;
      if (!visible) {
        if (!this.reduced && p.scanned && Math.abs(o) > 1.5) {
          // Re-arm the power-on sweep for the next visit.
          gsap.killTweensOf(p.scan);
          p.scan.v = 0;
          p.scanned = false;
        }
        continue;
      }
      any = true;
      const enter = p.stop === this.firstStop ? smoothstep(-0.85, -0.3, o) : smoothstep(-2.3, -0.85, o);
      const exitT = clamp(o, 0, 1);
      const exit = smoothstep(0, 1, exitT);
      const opacity = enter * (1 - smoothstep(0.4, 0.95, o));
      p.mat.uniforms.uOpacity.value = opacity;
      p.mat.depthWrite = opacity > 0.9;
      p.mat.uniforms.uScan.value = p.scan.v;
      p.mat.uniforms.uTime.value = time;
      p.glowMat.uniforms.uIntensity.value = 0.32 * opacity * (0.35 + 0.65 * Math.min(1, p.scan.v));

      const active = 1 - Math.min(1, Math.abs(o));
      p.rx += (-py * 0.16 * active - p.rx) * damp(5, dt);
      p.ry += (px * 0.24 * active - p.ry) * damp(5, dt);
      const bob = Math.sin(time * 0.8 + p.stop) * 0.04;
      p.group.position
        .copy(p.anchor)
        .addScaledVector(this.exitDir, exit * exit * 6.5)
        .add(this.tmp.set(0, bob, exit * 1.2));
      const away = portrait ? 0 : -exit * 0.75;
      p.group.rotation.set(p.rx + (portrait ? -exit * 0.6 : 0), p.ry + away, portrait ? 0 : exit * -0.12);

      if (p.animated && Math.abs(o) < 0.9 && time - p.lastDraw > 1 / 20) this.draw(p, time);
    }
    this.group.visible = any;
  }
}
