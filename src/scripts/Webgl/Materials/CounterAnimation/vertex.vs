uniform vec2 uTextureOffset;
varying vec2 vUv;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);


    vUv = uv * vec2(.5) + uTextureOffset * vec2(.5);
}