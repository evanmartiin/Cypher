uniform sampler2D tTex;
uniform sampler2D tNoise;
uniform sampler2D tBrushNoise;
uniform float uTransition;
uniform bool uReverse;

varying vec2 vUv;
varying vec2 vTextureUv;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float SMOOTH = 0.3;

void main() {
    float noise = texture2D(tNoise, vUv * vec2(.5, 1.)).r;

    float brushNoise = texture2D(tBrushNoise, vUv + vec2(0., noise * 0.2)).r;
    brushNoise = map(brushNoise, 0., 1., 0.2, 0.8);

    float text = texture2D(tTex, vTextureUv).r;

    float anim = step(uTransition, brushNoise);

    if (!uReverse) {
        anim = 1. - anim;
    }

    gl_FragColor = vec4(anim * text);
}