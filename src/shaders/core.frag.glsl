uniform vec3 uInner;
uniform vec3 uRim;
uniform vec3 uEmber;
uniform float uIntensity;
uniform float uFlash;

varying vec3 vWorld;
varying float vNoise;

void main() {
  // Flat facets from screen-space derivatives.
  vec3 n = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  vec3 v = normalize(cameraPosition - vWorld);
  if (dot(n, v) < 0.0) n = -n;
  float fresnel = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.4);
  float key = 0.5 + 0.5 * dot(n, normalize(vec3(0.5, 0.8, 0.45)));
  float fill = 0.5 + 0.5 * dot(n, normalize(vec3(-0.7, -0.3, 0.4)));
  vec3 col = uInner * (0.18 + 0.55 * key * key);
  col += uEmber * fill * fill * 0.35;
  col += uRim * fresnel * 2.6;
  col += uEmber * pow(max(vNoise, 0.0), 2.5) * 2.0;
  col *= uIntensity * (1.0 + uFlash * 1.5);
  gl_FragColor = vec4(col, 1.0);
}
