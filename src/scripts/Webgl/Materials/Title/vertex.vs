uniform float uTextureOffset;
varying vec2 vUv;
varying vec2 vTextureUv;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);


    vTextureUv = uv * vec2(1, 0.25) + uTextureOffset * vec2(0, .25);
    vUv = uv;
}