uniform float uTime;
varying vec2 vNewUvs;

uniform sampler2D uLogoTexture;

void main() {
    vec4 text = texture2D(uPixelSortingTexture, vNewUvs);

    // csm_FragColor = text;
}