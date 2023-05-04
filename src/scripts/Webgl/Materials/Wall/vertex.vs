varying vec2 vNewUv;

void main() {

  vNewUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}