uniform float uTime;
uniform vec3 uColor;
varying vec4 vRenderTargetUv;
uniform sampler2D uBaseTexture;
uniform sampler2D uBlurTexture;

float blendOverlay(float base, float blend) {
	return (base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
	return vec3(blendOverlay(base.r, blend.r), blendOverlay(base.g, blend.g), blendOverlay(base.b, blend.b));
}

void main() {
	vec4 normalMapTexture = texture2D(normalMap, vUv);

	// vec4 base = texture2DProj(uBaseTexture, vRenderTargetUv + normalMapTexture);
	vec4 blur = texture2DProj(uBlurTexture, vRenderTargetUv + normalMapTexture);

	vec4 render = blur;

	csm_DiffuseColor += render;
	csm_DiffuseColor.xyz *= uColor;
}
