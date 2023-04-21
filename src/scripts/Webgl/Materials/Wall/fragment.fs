precision highp float;

uniform vec3 uColor;

varying vec2 vUv;

void main() {
	float dist = distance(vUv, vec2(0.5)) * .3;
	gl_FragColor = vec4(uColor + dist, 1.);
}
