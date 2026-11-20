uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uVel;
uniform float uFlash;
uniform float uGrain;
uniform float uVignette;
uniform vec2 uRes;
uniform vec2 uFlashAt;

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 c = vUv - 0.5;
  // Chromatic aberration grows with scroll speed, strongest at the edges.
  vec2 off = c * (0.0012 + uVel * 0.011) * (0.4 + length(c) * 1.6);
  float r = texture2D(tDiffuse, vUv + off).r;
  float g = texture2D(tDiffuse, vUv).g;
  float b = texture2D(tDiffuse, vUv - off).b;
  vec3 col = vec3(r, g, b);

  float vig = smoothstep(0.95, 0.25, length(c * vec2(1.0, 1.15)));
  col *= mix(1.0 - uVignette, 1.0, vig);

  float n = hash(vUv * uRes + fract(uTime * 13.7) * 91.0) - 0.5;
  col += n * uGrain;

  vec2 fd = (vUv - uFlashAt) * vec2(uRes.x / uRes.y, 1.0);
  col += uFlash * vec3(1.0, 0.86, 0.78) * (0.12 + 0.45 * exp(-dot(fd, fd) * 3.0));

  gl_FragColor = vec4(col, 1.0);
}
