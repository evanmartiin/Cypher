uniform float uTime;
uniform float uProgress;
uniform bool uSwitchTransition;
uniform sampler2D uGlitchTexture;
uniform sampler2D uPixelSortingTexture;
uniform sampler2D uLiquidTexture;
uniform sampler2D uNumberTexture;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x, cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y);
}

void main() {
    vec2 rotatedUvs = rotate(vUv, PI * 0.25, vec2(0.5));
    vec2 rotatedUvs2 = rotate(vUv, PI * 0.5, vec2(0.5));

    vec4 glitchTex = texture2D(uGlitchTexture, rotatedUvs2 * 0.3);
    vec4 pixelSortingTex = texture2D(uPixelSortingTexture, rotatedUvs * 0.2);
    vec4 liquidTex = texture2D(uLiquidTexture, rotatedUvs2 * 0.3);

    vec4 number = texture2D(uNumberTexture, vUv);

    float progress = uProgress;

    progress += liquidTex.r + glitchTex.r + pixelSortingTex.r * 0.4;

    float dist;

    if(uSwitchTransition) {
        dist = 1.0 - length(vUv - 0.5);
    } else {
        dist = length(vUv - 0.5);
    }

    progress = smoothstep(progress - 0.5, progress, dist);

    vec4 render = mix(number, vec4(0.0), progress);

    gl_FragColor = vec4(vec3(pixelSortingTex.r), 1.0);
    gl_FragColor = render;
}