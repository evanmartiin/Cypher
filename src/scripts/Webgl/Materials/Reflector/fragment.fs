uniform float uTime;

varying vec2 vNewUv;
varying vec4 vRenderTargetUv;

uniform sampler2D uBlurTexture;
uniform sampler2D uBaseTexture;
uniform sampler2D uBaseMap;

void main() {
	float rangeBack = 1.0 - smoothstep(0.9, 1.0, vNewUv.y);
	float rangeRight = 1.0 - smoothstep(0.9, 1.0, vNewUv.x);
	float rangeLeft = 1.0 - smoothstep(0.9, 1.0, 1.0 - vNewUv.x);

	vec2 normalMapTexture = texture2D(normalMap, vUv).xy * 2.0 - 1.0;

	vec4 deformedRenderTarget = vRenderTargetUv;

	deformedRenderTarget.xy += normalMapTexture * 0.5;

	vec4 blur = texture2DProj(uBaseTexture, deformedRenderTarget);

	vec2 nUv = vNewUv;

	nUv += normalMapTexture * 0.5;

	vec4 baseMap = texture2D(uBaseMap, nUv);

	vec4 render = blur;

	// csm_DiffuseColor *= render;
	// csm_DiffuseColor.a *= range;
	csm_FragColor *= render;
	csm_FragColor.xyz *= 0.6;
	csm_FragColor.a *= rangeBack;
}
