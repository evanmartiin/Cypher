varying vec2 vNewUv;

uniform sampler2D uMap;

void main() {
	float rangeBack = 1.0 - smoothstep(0.8, 1.0, vNewUv.y);
	float rangeRight = 1.0 - smoothstep(0.8, 1.0, vNewUv.x);
	float rangeLeft = 1.0 - smoothstep(0.8, 1.0, 1.0 - vNewUv.x);

	vec2 normalMapTexture = texture2D(normalMap, vUv).xy * 2.0 - 1.0;

	vec4 render = texture2D(uMap, vNewUv);

	// deformedRenderTarget.xy += normalMapTexture;

	csm_DiffuseColor = render;
	// csm_DiffuseColor.a *= range;
	// csm_FragColor = render;
	// csm_FragColor.a *= rangeBack;
}