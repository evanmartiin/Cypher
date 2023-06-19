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
	n = smoothstep(0.2, 0.6, n);

	vec4 map = texture2D(uBaseMap, vNewUv + normalMapTexture * 0.2);

	// csm_DiffuseColor = blur * n;
	csm_FragColor = blur * n;
}
