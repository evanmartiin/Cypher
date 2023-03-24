uniform mat4 uTextureMatrix;

varying vec2 vNewUv;
varying vec4 vRenderTargetUv;

void main() {

  vNewUv = uv;

  vRenderTargetUv = uTextureMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}