uniform float uTime;
uniform vec2 uPos;

varying vec2 vUv;

void main() {
	float dist = step(0.1, length(vUv - uPos));

	gl_FragColor = vec4(vUv, sin(uTime * 0.001), 1.0);
	gl_FragColor = vec4(uPos, uPos);
	gl_FragColor = vec4(dist);
}
