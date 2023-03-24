uniform float uTime;

varying vec2 vNewUv;
varying vec4 vRenderTargetUv;

uniform sampler2D uBlurTexture;

void main() {
	float range = 1.0 - smoothstep(0.75, 1.0, vNewUv.y);

	vec2 normalMapTexture = texture2D(normalMap, vUv).xy * 2.0 - 1.0;

	vec4 deformedRenderTarget = vRenderTargetUv;

	deformedRenderTarget.xy += normalMapTexture * 0.15;

	vec4 blur = texture2DProj(uBlurTexture, deformedRenderTarget);

	vec4 render = blur;

	csm_DiffuseColor = render;
	csm_DiffuseColor.a = range;
}
