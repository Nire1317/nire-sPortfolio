uniform float uTime;
uniform float uScale;
uniform float uMaxSize;
uniform float uSize;
uniform vec3 uColor;
uniform float uOpacity;

attribute vec4 aRand;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec3 p = position;
  float t = uTime * (0.04 + aRand.w * 0.05);
  p += vec3(sin(t + aRand.x * 6.2831), cos(t * 0.8 + aRand.y * 6.2831), sin(t * 0.7 + aRand.z * 6.2831)) * (0.6 + aRand.w * 1.2);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = -mv.z;
  gl_PointSize = clamp(uSize * (0.4 + aRand.w) * uScale / max(depth, 0.05), 0.0, uMaxSize);
  float twinkle = 0.5 + 0.5 * sin(uTime * (0.6 + aRand.x * 1.8) + aRand.y * 30.0);
  vColor = uColor * (0.35 + 0.65 * twinkle);
  vAlpha = uOpacity * smoothstep(0.4, 3.0, depth) * (1.0 - smoothstep(30.0, 60.0, depth));
}
