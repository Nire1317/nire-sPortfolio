import { Vector2, type PerspectiveCamera, type Scene, type WebGLRenderer } from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import uvVert from '../shaders/uv.vert.glsl?raw';
import finalFrag from '../shaders/final.frag.glsl?raw';

/** Bloom that can run at a fraction of the canvas resolution on weaker devices. */
class ScaledBloomPass extends UnrealBloomPass {
  scale = 0.5;
  override setSize(width: number, height: number) {
    // UnrealBloomPass halves internally; scale is relative to full resolution.
    super.setSize(Math.max(2, Math.round(width * this.scale * 2)), Math.max(2, Math.round(height * this.scale * 2)));
  }
}

/** Render → bloom → ACES tone map + sRGB → chromatic aberration, vignette, grain, landing flash. */
export class Post {
  readonly composer: EffectComposer;
  private bloom: ScaledBloomPass;
  readonly final: ShaderPass;
  private w = 1;
  private h = 1;

  constructor(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera, bloomScale: number) {
    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));
    this.bloom = new ScaledBloomPass(new Vector2(256, 256), 0.78, 0.55, 0.3);
    this.bloom.scale = bloomScale;
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
    this.final = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uVel: { value: 0 },
        uFlash: { value: 0 },
        uGrain: { value: 0.045 },
        uVignette: { value: 0.55 },
        uRes: { value: new Vector2(1, 1) },
        uFlashAt: { value: new Vector2(0.7, 0.5) },
      },
      vertexShader: uvVert,
      fragmentShader: finalFrag,
    });
    this.composer.addPass(this.final);
  }

  setBloom(on: boolean, scale?: number) {
    this.bloom.enabled = on;
    if (scale !== undefined) {
      this.bloom.scale = scale;
      this.bloom.setSize(this.w, this.h);
    }
  }

  setSize(w: number, h: number, pixelRatio: number) {
    this.w = Math.round(w * pixelRatio);
    this.h = Math.round(h * pixelRatio);
    this.composer.setPixelRatio(pixelRatio);
    this.composer.setSize(w, h);
    (this.final.uniforms.uRes.value as Vector2).set(this.w, this.h);
  }

  render(dt: number) {
    this.composer.render(dt);
  }
}
