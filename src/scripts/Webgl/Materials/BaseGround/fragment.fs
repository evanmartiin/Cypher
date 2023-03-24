uniform float uTime;
uniform vec3 uColor;
uniform vec3 uColor2;
uniform vec3 uGridColor;

float random(vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
	float n = random(vUv);

	vec2 normalMapTexture = texture2D(normalMap, vUv).xy * 2.0 - 1.0;

	float dist = smoothstep(0.35, 1.0, 1.0 - length(vUv - 0.5));

	float gridY = mod(vUv.y * 15. + normalMapTexture.y * 0.25, 1.0);
	gridY = step(0.075, gridY);

	float gridX = mod(vUv.x * 15. + normalMapTexture.x * 0.25, 1.0);
	gridX = step(0.075, gridX);

	float globalGrid = 1.0 - (gridX * gridY);
	globalGrid = clamp(globalGrid, 0.0, 1.0);

	globalGrid *= dist;

	vec3 renderGrid = vec3(globalGrid) * uGridColor;

	vec3 renderDist = mix(uColor, uColor2, dist);

	csm_DiffuseColor *= vec4(renderDist, 1.0);
	csm_DiffuseColor.rgb += vec3(renderGrid * 0.1 + n * 0.1);
}
