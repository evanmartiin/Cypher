precision highp float;
attribute mat4 modelViewMatrix;
attribute mat4 projectionMatrix;
attribute vec3 position;
uniform vec2 px;
uniform vec2 boundarySpace;
varying vec2 uv;

void main() {
    vec3 pos = position;
    vec2 scale = 1.0 - boundarySpace * 2.0;
    pos.xy = pos.xy * scale;
    uv = vec2(0.5) + (pos.xy) * 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = vec4(pos, 1.0);
}
