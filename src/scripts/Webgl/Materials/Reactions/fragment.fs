uniform sampler2D tTex;

varying vec2 vUv;
varying float vTime;

void main() {
  float text = texture2D(tTex, vUv).r;
  float opacity = sin(vTime * 3.1415);

  gl_FragColor = vec4(text * opacity);
}