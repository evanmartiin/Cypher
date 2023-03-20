uniform float uTime;
// uniform vec2 uPos[10];
uniform vec2 uPos;
uniform int uVectorCount;

varying vec2 vUv;

void main() {
	// float dist = 1.0;

	// for(int i = 0; i < uVectorCount; i++) {
	// 	dist *= smoothstep(0.4, 0.6, length(vUv - uPos[i]));
	// }
	float dist = step(0.1, length(vUv - vec2(uPos.x, 0.5)));

	gl_FragColor = vec4(vUv, sin(uTime * 0.001), 1.0);
	gl_FragColor = vec4(uPos, uPos);
	gl_FragColor = vec4(dist);
}
