uniform sampler2D uMap;
uniform float uScan;
uniform float uOpacity;
uniform vec3 uAccent;
uniform float uTime;
uniform vec2 uSize;
uniform float uRadius;

varying vec2 vUv;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = (vUv - 0.5) * uSize;
  float sd = roundedBox(p, uSize * 0.5, uRadius);
  float aa = fwidth(sd);
  float inside = 1.0 - smoothstep(-aa, aa, sd);
  if (inside <= 0.0) discard;

  vec3 tex = texture2D(uMap, vUv).rgb;
  float y = 1.0 - vUv.y; // 0 at the top
  float lit = smoothstep(uScan, uScan - 0.012, y);
  float beam = exp(-pow((y - uScan) * 34.0, 2.0)) * step(uScan, 1.04) * step(0.001, uScan);
  float lines = 0.93 + 0.07 * sin(vUv.y * uSize.y * 220.0);
  float flicker = 0.97 + 0.03 * sin(uTime * 31.0 + vUv.y * 9.0);

  vec3 col = tex * lit * lines * flicker;
  // Powered-off glass before the sweep reaches it.
  col += (1.0 - lit) * (uAccent * 0.025 + vec3(0.012, 0.014, 0.02));
  col += uAccent * beam * 1.6;
  col += vec3(1.0) * beam * 0.35;
  // Thin accent frame.
  float edge = smoothstep(aa * 2.5, 0.0, abs(sd + aa * 1.2));
  col += uAccent * edge * 0.9;

  gl_FragColor = vec4(col, inside * uOpacity);
}
