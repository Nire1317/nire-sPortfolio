uniform float uTime;
uniform float uAmp;

varying vec3 vWorld;
varying float vNoise;

void main() {
  vec3 p = position;
  float n = snoise(p * 1.25 + vec3(0.0, uTime * 0.22, uTime * 0.13));
  float n2 = snoise(p * 2.6 - uTime * 0.31) * 0.35;
  p += normalize(p) * (n + n2) * uAmp;
  vNoise = n;
  vec4 w = modelMatrix * vec4(p, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
