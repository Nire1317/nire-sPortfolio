import {
  AdditiveBlending,
  Color,
  Group,
  IcosahedronGeometry,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  type Vector3,
} from 'three';
import noise from '../shaders/noise.glsl?raw';
import coreVert from '../shaders/core.vert.glsl?raw';
import coreFrag from '../shaders/core.frag.glsl?raw';
import uvVert from '../shaders/uv.vert.glsl?raw';
import glowFrag from '../shaders/glow.frag.glsl?raw';
import { clamp, damp, smoothstep } from '../core/math';

export function glowMaterial(color: string, intensity: number) {
  return new ShaderMaterial({
    vertexShader: uvVert,
    fragmentShader: glowFrag,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uColor: { value: new Color(color) }, uIntensity: { value: intensity } },
  });
}

/** Intro subject: a noise-displaced faceted icosahedron with a fresnel rim. */
export class Core {
  readonly group = new Group();
  private mesh: Mesh;
  private mat: ShaderMaterial;
  private glow: Mesh;
  private glowMat: ShaderMaterial;
  private tiltX = 0;
  private tiltY = 0;

  constructor(anchor: Vector3) {
    this.mat = new ShaderMaterial({
      vertexShader: noise + coreVert,
      fragmentShader: coreFrag,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: 0.16 },
        uInner: { value: new Color('#1d2a44') },
        uRim: { value: new Color('#9FD8FF') },
        uEmber: { value: new Color('#FF6B3D') },
        uIntensity: { value: 1 },
        uFlash: { value: 0 },
      },
    });
    this.mesh = new Mesh(new IcosahedronGeometry(1.25, 4), this.mat);
    this.glowMat = glowMaterial('#FF8A5C', 0.55);
    this.glow = new Mesh(new PlaneGeometry(7, 7), this.glowMat);
    this.group.add(this.glow, this.mesh);
    this.group.position.copy(anchor);
  }

  /**
   * As the tour starts the core swells, then implodes into the particle stream.
   * Returns { swell, implode } so the particle shell can follow.
   */
  update(t: number, time: number, dt: number, px: number, py: number, flash: number, camPos: Vector3) {
    const swell = smoothstep(0.0, 0.12, t) * (1 - smoothstep(0.12, 0.3, t));
    const implode = smoothstep(0.12, 0.36, t);
    const scale = (1 + swell * 0.32) * (1 - implode) + 0.0001;
    this.group.visible = t < 0.45;
    this.mesh.scale.setScalar(scale);
    this.tiltX += (py * 0.35 - this.tiltX) * damp(3, dt);
    this.tiltY += (px * 0.5 - this.tiltY) * damp(3, dt);
    this.mesh.rotation.set(time * 0.11 + this.tiltX, time * 0.17 + this.tiltY, 0);
    this.mat.uniforms.uTime.value = time;
    this.mat.uniforms.uAmp.value = 0.16 + swell * 0.22;
    this.mat.uniforms.uIntensity.value = 1 + swell * 1.6 + implode * 2.5;
    this.mat.uniforms.uFlash.value = flash;
    this.glow.lookAt(camPos);
    this.glow.scale.setScalar(1 + swell * 0.6 - implode * 0.9);
    this.glowMat.uniforms.uIntensity.value = clamp(0.5 + swell * 0.8 + 0.08 * Math.sin(time * 1.7)) * (1 - implode);
    return { swell, implode };
  }
}
