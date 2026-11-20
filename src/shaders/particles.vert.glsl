uniform float uTime;
uniform float uScale;
uniform float uMaxSize;
uniform float uSize;
uniform float uAspect;
uniform int uFrom;
uniform int uTo;
uniform float uMix;
uniform float uSwell;
uniform float uImplode;
uniform vec3 uCenter[8];
uniform vec4 uSpin[8];
uniform vec3 uColA[8];
uniform vec3 uColB[8];
uniform float uBright[8];
uniform float uSizeF[8];
uniform mat3 uRingMat[3];
uniform vec3 uRingCol[3];
uniform vec2 uTunnel;
uniform vec3 uPointer;
uniform vec4 uShock[2];
uniform float uFlash;
uniform vec3 uEmber;
uniform float uGain;
uniform float uFar;

attribute vec4 aF0;
attribute vec4 aF1;
attribute vec4 aF2;
attribute vec4 aF3;
attribute vec4 aF4;
attribute vec4 aF5;
attribute vec4 aF6;
attribute vec4 aF7;
attribute vec4 aRand;

varying vec3 vColor;
varying float vAlpha;

vec4 formation(int i) {
  if (i == 0) return aF0;
  if (i == 1) return aF1;
  if (i == 2) return aF2;
  if (i == 3) return aF3;
  if (i == 4) return aF4;
  if (i == 5) return aF5;
  if (i == 6) return aF6;
  return aF7;
}

vec3 rotateAxis(vec3 p, vec3 axis, float a) {
  float c = cos(a);
  float s = sin(a);
  return p * c + cross(axis, p) * s + axis * dot(axis, p) * (1.0 - c);
}

// Places a particle in formation f. Returns world position; writes brightness level and tint.
vec3 place(int f, vec4 a, out float level, out vec3 tint, out float tinted) {
  vec3 p = a.xyz;
  level = 0.5;
  tint = vec3(0.0);
  tinted = 0.0;
  if (f == 2) {
    if (a.w >= 0.0) {
      int k = int(a.w + 0.5);
      p = uRingMat[k] * p;
      tint = uRingCol[k];
      tinted = 0.75;
      level = 0.75;
    } else {
      level = 0.12;
    }
  } else if (f == 3) {
    float L = uTunnel.x;
    p.z = -0.5 * L + mod(p.z + 0.5 * L + uTime * uTunnel.y * (0.3 + a.w), L);
    level = 0.3 + a.w * 0.5;
  } else if (f == 6) {
    if (a.w >= 1.0) {
      float phase = fract(a.w) * 6.2831853;
      float loose = step(2.0, a.w);
      float ph = uTime * (0.55 + loose * 0.25) + phase;
      float amp = (0.15 + 0.85 * (0.5 + 0.5 * sin(ph))) * mix(0.55, 1.4, loose);
      p += vec3(sin(ph * 1.3 + a.x * 4.0), cos(ph * 0.9 + a.y * 3.0), sin(ph * 1.1 + a.z * 5.0)) * amp;
      level = mix(0.55, 0.25, loose);
    } else {
      level = 0.8;
    }
  } else {
    level = a.w;
  }
  vec4 s = uSpin[f];
  if (s.w != 0.0) p = rotateAxis(p, s.xyz, uTime * s.w);
  return uCenter[f] + p;
}

void main() {
  float lvA;
  float lvB;
  float tA;
  float tB;
  vec3 tintA;
  vec3 tintB;
  vec3 a = place(uFrom, formation(uFrom), lvA, tintA, tA);
  vec3 b = place(uTo, formation(uTo), lvB, tintB, tB);

  // Intro: the shell swells, then implodes into the core before streaming away.
  if (uFrom == 0) {
    vec3 c = uCenter[0];
    a = c + (a - c) * (1.0 + uSwell * 0.2);
    a = mix(a, c + (a - c) * 0.05, uImplode * (0.8 + 0.2 * aRand.y));
  }

  float m = clamp((uMix - aRand.x * 0.42) / 0.58, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);

  vec3 pos = mix(a, b, m);
  vec3 dir = b - a;
  float len = length(dir);
  if (len > 0.001 && m > 0.0 && m < 1.0) {
    vec3 fwd = dir / len;
    vec3 side = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)) + vec3(1e-4, 0.0, 0.0));
    vec3 up = cross(side, fwd);
    float arc = sin(3.14159265 * m);
    float ang = aRand.y * 6.2831853 + m * 5.0;
    float rad = min(len * 0.1, 3.0) * (0.3 + aRand.z);
    pos += (side * cos(ang) + up * sin(ang)) * rad * arc;
  }

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vec4 clip = projectionMatrix * mv;

  // Screen-space: particles part around the pointer; shockwave rings push them out.
  vec2 asp = vec2(uAspect, 1.0);
  vec2 ndc = clip.xy / clip.w;
  vec2 d = (ndc - uPointer.xy) * asp;
  float dist = length(d);
  vec2 offs = (d / max(dist, 1e-4)) * uPointer.z * smoothstep(0.3, 0.0, dist) * 0.07;
  float ring = 0.0;
  for (int i = 0; i < 2; i++) {
    vec4 sh = uShock[i];
    float age = uTime - sh.z;
    if (age > 0.0 && age < 1.8) {
      vec2 sd = (ndc - sh.xy) * asp;
      float sl = length(sd);
      float band = exp(-pow((sl - age * 1.35) * 6.5, 2.0)) * (1.0 - age / 1.8) * sh.w;
      offs += (sd / max(sl, 1e-4)) * band * 0.055;
      ring += band;
    }
  }
  if (clip.w > 0.0) {
    ndc += offs / asp;
    clip.xy = ndc * clip.w;
  }
  gl_Position = clip;

  float depth = -mv.z;
  float twinkle = 0.72 + 0.28 * sin(uTime * (1.1 + aRand.w * 2.6) + aRand.x * 40.0);
  float sizeF = mix(uSizeF[uFrom], uSizeF[uTo], m);
  float size = uSize * sizeF * (0.5 + aRand.w * 0.95) * (1.0 + ring * 0.9);
  gl_PointSize = clamp(size * uScale / max(depth, 0.05), 0.0, uMaxSize);

  vec3 cA = mix(mix(uColA[uFrom], uColB[uFrom], aRand.y), tintA, tA);
  vec3 cB = mix(mix(uColA[uTo], uColB[uTo], aRand.y), tintB, tB);
  vec3 col = mix(cA, cB, m);
  if (aRand.z > 0.94) col = mix(col, uEmber, 0.85);
  float level = mix(lvA, lvB, m);
  float bright = mix(uBright[uFrom], uBright[uTo], m) * (0.35 + 1.1 * level) * twinkle;
  bright *= 1.0 + ring * 2.2 + uFlash * 0.5 + sin(3.14159265 * m) * 0.45;
  vColor = col * bright * uGain;

  float nearFade = smoothstep(0.2, 1.4, depth);
  float farFade = 1.0 - smoothstep(uFar, uFar + 30.0, depth);
  vAlpha = nearFade * farFade;
}
