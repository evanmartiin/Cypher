uniform float uTime;

varying vec2 vNewUv;
varying vec4 vRenderTargetUv;

uniform sampler2D uBlurTexture;

void main() {
	float rangeBack = 1.0 - smoothstep(0.8, 1.0, vNewUv.y);
	float rangeRight = 1.0 - smoothstep(0.8, 1.0, vNewUv.x);
	float rangeLeft = 1.0 - smoothstep(0.8, 1.0, 1.0 - vNewUv.x);

	vec2 normalMapTexture = texture2D(normalMap, vUv).xy * 2.0 - 1.0;

	vec4 deformedRenderTarget = vRenderTargetUv;

	deformedRenderTarget.xy += normalMapTexture * 0.5;

	vec4 blur = texture2DProj(uBlurTexture, deformedRenderTarget);

	vec4 render = blur;

	// csm_DiffuseColor *= render;
	// csm_DiffuseColor.a *= range;
	csm_FragColor = render;
	csm_FragColor.a *= rangeBack * rangeLeft * rangeRight;
}
