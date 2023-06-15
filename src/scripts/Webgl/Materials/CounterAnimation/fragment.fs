uniform float uTime;
uniform sampler2D uGlitchTexture;
uniform sampler2D uNumber1;
uniform sampler2D uNumber2;
uniform sampler2D uNumber3;

varying vec2 vUv;

void main() {
    vec4 glitchTex = texture2D(uGlitchTexture, vUv);

    vec4 number1 = texture2D(uNumber1, vUv);
    vec4 number2 = texture2D(uNumber2, vUv);
    vec4 number3 = texture2D(uNumber3, vUv);

    gl_FragColor = vec4(1.0);
    gl_FragColor = glitchTex;
    gl_FragColor = number3;
    gl_FragColor = number2;
    gl_FragColor = number1;
}