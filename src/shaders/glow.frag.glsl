uniform vec3 uColor;
uniform float uIntensity;

varying vec2 vUv;

void main() {
  float d = length(vUv - 0.5) * 2.0;
  float g = pow(clamp(1.0 - d, 0.0, 1.0), 2.6);
  gl_FragColor = vec4(uColor * g * uIntensity, 1.0);
}
