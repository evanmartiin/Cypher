uniform float uTextureOffset;
uniform float uTransition;

attribute float iLife;

varying vec2 vUv;
varying float vTime;

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

void main() {
    float time = uTransition - iLife;
    time *= 2.;
    time = clamp(time, 0., 1.);
    time = cubicOut(time);

    vec3 pos = position;
    pos.y += time * time * 2.;

    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);

    vUv = uv * vec2(1, 0.25) + uTextureOffset * vec2(0, .25);
    vTime = time;
}