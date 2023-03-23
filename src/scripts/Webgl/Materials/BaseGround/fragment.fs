uniform float uTime;
uniform vec3 uColor;
uniform vec3 uColor2;
uniform vec3 uGridColor;

varying vec2 vUv;

void main() {
	float dist = smoothstep(0.35, 1.0, 1.0 - length(vUv - 0.5));

	float gridY = mod(vUv.y * 15., 1.0);
	gridY = step(0.075, gridY);

	float gridX = mod(vUv.x * 15., 1.0);
	gridX = step(0.075, gridX);

	float globalGrid = 1.0 - (gridX * gridY);
	globalGrid = clamp(globalGrid, 0.0, 1.0);

	globalGrid *= dist;

	vec3 renderGrid = vec3(globalGrid) * uGridColor;

	vec3 renderDist = mix(uColor, uColor2, dist);

	csm_DiffuseColor *= vec4(renderDist, 1.0);
	csm_DiffuseColor += vec4(renderGrid * 0.05, 1.0);
}
