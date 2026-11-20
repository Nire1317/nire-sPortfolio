import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  PlaneGeometry,
  type ShaderMaterial,
  type Vector3,
} from 'three';
import { glowMaterial } from './core';

/** Journey: one brighter node per milestone; the last node is "now" and pulses. */
export class JourneyNodes {
  readonly group = new Group();
  private nodes: { mesh: Mesh; mat: ShaderMaterial; now: boolean }[] = [];

  constructor(anchor: Vector3, positions: Vector3[]) {
    this.group.position.copy(anchor);
    positions.forEach((p, i) => {
      const now = i === positions.length - 1;
      const mat = glowMaterial(now ? '#FF6B3D' : '#FFD7C4', now ? 1.2 : 0.7);
      const mesh = new Mesh(new PlaneGeometry(now ? 1.9 : 1.1, now ? 1.9 : 1.1), mat);
      mesh.position.copy(p);
      this.group.add(mesh);
      this.nodes.push({ mesh, mat, now });
    });
  }

  update(time: number, presence: number, camPos: Vector3) {
    this.group.visible = presence > 0.01;
    if (!this.group.visible) return;
    // Journey particles turn slowly around Y (0.015 rad/s); keep the nodes aligned.
    this.group.rotation.y = time * 0.015;
    this.group.updateMatrixWorld();
    for (const n of this.nodes) {
      n.mesh.lookAt(camPos);
      const pulse = n.now ? 0.75 + 0.45 * Math.sin(time * 3.2) : 0.85 + 0.15 * Math.sin(time * 1.4 + n.mesh.position.x);
      n.mat.uniforms.uIntensity.value = (n.now ? 1.25 : 0.65) * pulse * presence;
      if (n.now) n.mesh.scale.setScalar(1 + 0.18 * Math.sin(time * 3.2));
    }
  }
}

/** Leveling up: the wireframe edges assembled so far, plus a welding spark at the build front. */
export class Scaffold {
  readonly group = new Group();
  private lines: LineSegments;
  private mat: LineBasicMaterial;
  private spark: Mesh;
  private sparkMat: ShaderMaterial;
  private vertexCount: number;

  constructor(anchor: Vector3, segments: Float32Array) {
    this.group.position.copy(anchor);
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(segments, 3));
    this.vertexCount = segments.length / 3;
    this.mat = new LineBasicMaterial({
      color: new Color('#9FD8FF'),
      transparent: true,
      opacity: 0.5,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    this.lines = new LineSegments(geo, this.mat);
    this.sparkMat = glowMaterial('#FF8A5C', 1);
    this.spark = new Mesh(new PlaneGeometry(0.9, 0.9), this.sparkMat);
    const n = segments.length;
    this.spark.position.set(segments[n - 3], segments[n - 2], segments[n - 1]);
    this.group.add(this.lines, this.spark);
  }

  update(time: number, presence: number, build: number, camPos: Vector3) {
    this.group.visible = presence > 0.01;
    if (!this.group.visible) return;
    this.group.rotation.y = time * 0.09;
    const pairs = Math.max(1, Math.round((this.vertexCount / 2) * build));
    this.lines.geometry.setDrawRange(0, pairs * 2);
    this.mat.opacity = 0.45 * presence;
    this.spark.visible = build > 0.98;
    this.spark.lookAt(camPos);
    const flicker = 0.6 + 0.4 * Math.abs(Math.sin(time * 23)) * Math.abs(Math.sin(time * 7.3));
    this.sparkMat.uniforms.uIntensity.value = flicker * presence;
  }
}
