import {
  AddEquation,
  BufferAttribute,
  BufferGeometry,
  Color,
  CustomBlending,
  Matrix3,
  OneFactor,
  Points,
  ShaderMaterial,
  Vector2,
  Vector3,
  Vector4,
} from 'three';
import vert from '../shaders/particles.vert.glsl?raw';
import frag from '../shaders/particles.frag.glsl?raw';
import dustVert from '../shaders/dust.vert.glsl?raw';
import { mulberry32 } from '../core/math';
import { F, FORMATIONS, type World } from './world';
import type { Baked } from './formations';

const hex = (h: string) => new Color(h);

/** Colour palette per formation: two ends of a per-particle mix, plus brightness and size. */
const LOOK: { a: string; b: string; bright: number; size: number }[] = [];
LOOK[F.core] = { a: '#9FD8FF', b: '#EDEFF5', bright: 0.85, size: 0.95 };
LOOK[F.helix] = { a: '#9FD8FF', b: '#FFD7C4', bright: 1.0, size: 1.0 };
LOOK[F.rings] = { a: '#9FD8FF', b: '#EDEFF5', bright: 0.95, size: 0.95 };
LOOK[F.tunnel] = { a: '#EDEFF5', b: '#9FD8FF', bright: 0.85, size: 1.05 };
LOOK[F.journey] = { a: '#FF8A5C', b: '#FFD7C4', bright: 0.7, size: 0.95 };
LOOK[F.lattice] = { a: '#BFE6FF', b: '#FFFFFF', bright: 0.62, size: 0.9 };
LOOK[F.scaffold] = { a: '#9FD8FF', b: '#EDEFF5', bright: 0.75, size: 0.95 };
LOOK[F.portal] = { a: '#FF6B3D', b: '#FFB896', bright: 0.75, size: 0.95 };

export class Particles {
  readonly points: Points;
  readonly dust: Points;
  readonly material: ShaderMaterial;
  readonly dustMaterial: ShaderMaterial;
  private count: number;
  private dustCount: number;

  constructor(baked: Baked, world: World, dustCount: number, mobile: boolean) {
    this.count = baked.count;
    this.dustCount = dustCount;

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(baked.count * 3), 3));
    baked.formations.forEach((arr, i) => geo.setAttribute(`aF${i}`, new BufferAttribute(arr, 4)));
    geo.setAttribute('aRand', new BufferAttribute(baked.rand, 4));

    const spin: Vector4[] = Array.from({ length: FORMATIONS }, () => new Vector4(0, 1, 0, 0));
    spin[F.core].set(0, 1, 0, 0.06);
    spin[F.helix].set(baked.helixAxis.x, baked.helixAxis.y, baked.helixAxis.z, 0.28);
    spin[F.journey].set(0, 1, 0, 0.015);
    spin[F.lattice].set(0, 1, 0, 0.13);
    spin[F.scaffold].set(0, 1, 0, 0.09);
    spin[F.portal].set(0, 0, 1, 0.32);

    this.material = new ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: CustomBlending,
      blendEquation: AddEquation,
      blendSrc: OneFactor,
      blendDst: OneFactor,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 500 },
        uMaxSize: { value: 40 },
        uSize: { value: mobile ? 0.05 : 0.036 },
        uAspect: { value: 1 },
        uFrom: { value: 0 },
        uTo: { value: 1 },
        uMix: { value: 0 },
        uSwell: { value: 0 },
        uImplode: { value: 0 },
        uCenter: { value: world.centers },
        uSpin: { value: spin },
        uColA: { value: LOOK.map((l) => hex(l.a)) },
        uColB: { value: LOOK.map((l) => hex(l.b)) },
        uBright: { value: LOOK.map((l) => l.bright * (mobile ? 1.15 : 1)) },
        uSizeF: { value: LOOK.map((l) => l.size) },
        uRingMat: { value: [new Matrix3(), new Matrix3(), new Matrix3()] },
        uRingCol: { value: [hex('#FF6B3D'), hex('#9FD8FF'), hex('#C6F36B')] },
        uTunnel: { value: new Vector2(world.tunnel.length, 2.2) },
        uPointer: { value: new Vector3(0, 0, 0) },
        uShock: { value: [new Vector4(0, 0, -99, 0), new Vector4(0, 0, -99, 0)] },
        uFlash: { value: 0 },
        uEmber: { value: hex('#FF6B3D') },
        uGain: { value: mobile ? 0.8 : 0.52 },
        uFar: { value: 42 },
      },
    });
    this.points = new Points(geo, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 3;

    /* Dust: a sparse drifting layer along the whole flight path. */
    const rand = mulberry32(77);
    const pos = new Float32Array(dustCount * 3);
    const rnd = new Float32Array(dustCount * 4);
    const zs = world.stops.map((s) => s.anchor.z);
    const zMax = Math.max(...zs) + 25;
    const zMin = Math.min(...zs) - 20;
    for (let i = 0; i < dustCount; i++) {
      const z = zMin + rand() * (zMax - zMin);
      // Follow the path's x/y drift so dust surrounds the camera everywhere.
      let k = 0;
      while (k < world.stops.length - 1 && world.stops[k + 1].anchor.z > z) k++;
      const s0 = world.stops[k].anchor;
      const s1 = world.stops[Math.min(k + 1, world.stops.length - 1)].anchor;
      const f = s1.z === s0.z ? 0 : (z - s0.z) / (s1.z - s0.z);
      const cx = s0.x + (s1.x - s0.x) * f;
      const cy = s0.y + (s1.y - s0.y) * f;
      pos[i * 3] = cx + (rand() - 0.5) * 34;
      pos[i * 3 + 1] = cy + (rand() - 0.5) * 22;
      pos[i * 3 + 2] = z;
      for (let j = 0; j < 4; j++) rnd[i * 4 + j] = rand();
    }
    const dgeo = new BufferGeometry();
    dgeo.setAttribute('position', new BufferAttribute(pos, 3));
    dgeo.setAttribute('aRand', new BufferAttribute(rnd, 4));
    this.dustMaterial = new ShaderMaterial({
      vertexShader: dustVert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: CustomBlending,
      blendEquation: AddEquation,
      blendSrc: OneFactor,
      blendDst: OneFactor,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 500 },
        uMaxSize: { value: 12 },
        uSize: { value: mobile ? 0.05 : 0.04 },
        uColor: { value: hex('#9FD8FF') },
        uOpacity: { value: 0.55 },
      },
    });
    this.dust = new Points(dgeo, this.dustMaterial);
    this.dust.frustumCulled = false;
    this.dust.renderOrder = 2;
  }

  /** Draw only a fraction of particles (FPS fallback). Particles are randomly ordered. */
  setFraction(f: number) {
    this.points.geometry.setDrawRange(0, Math.floor(this.count * f));
    this.dust.geometry.setDrawRange(0, Math.floor(this.dustCount * f));
  }

  setViewport(heightPx: number, projY: number, pixelRatio: number, aspect: number) {
    const scale = 0.5 * heightPx * projY;
    const u = this.material.uniforms;
    u.uScale.value = scale;
    u.uMaxSize.value = 40 * pixelRatio;
    u.uAspect.value = aspect;
    this.dustMaterial.uniforms.uScale.value = scale;
    this.dustMaterial.uniforms.uMaxSize.value = 10 * pixelRatio;
  }
}
