uniform float uTime;

varying vec2 vNewUv;
varying vec4 vRenderTargetUv;

uniform sampler2D uBlurTexture;
uniform sampler2D uBaseTexture;
uniform sampler2D uBaseMap;
uniform sampler2D uNoiseTexture;

void main() {
	vec2 normalMapTexture = texture2D(normalMap, vUv).xy * 2.0 - 1.0;

	vec4 deformedRenderTarget = vRenderTargetUv;

	deformedRenderTarget.xy += normalMapTexture * 0.2;

	vec4 blur = texture2DProj(uBaseTexture, deformedRenderTarget);

	float n = texture2D(uNoiseTexture, vNewUv + normalMapTexture * 0.05).x;
	n = smoothstep(0.4, 0.5, n);

	vec4 map = texture2D(uBaseMap, vNewUv + normalMapTexture * 0.2);

	// csm_FragColor = mix(blur, vec4(map.xyz * 0.2, 1.0), n);
	csm_FragColor = blur * n * 0.8;
	// csm_FragColor = blur * n;
	// csm_DiffuseColor.a *= 0.8;
	// csm_DiffuseColor.a *= range;
	// csm_DiffuseColor = baseMap;
	// csm_FragColor.a *= rangeBack;
}
