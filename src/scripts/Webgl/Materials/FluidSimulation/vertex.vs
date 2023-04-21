precision highp float;
uniform vec2 px;
uniform vec2 boundarySpace;
varying vec2 vNewUv;

void main() {
  vec3 pos = position;
  vec2 scale = 1.0 - boundarySpace * 2.0;
  pos.xy = pos.xy * scale;
  // vUv = uv;
  // vNewUv = vec2(0.5) + (pos.xy) * 0.5;
  vNewUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
