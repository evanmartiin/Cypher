precision highp float;

uniform sampler2D tTag;
uniform vec3 uColor;

varying vec2 vUv;
varying float vTransition;

void main() {
	vec4 tag = texture2D(tTag, vUv);

	float tint = tag.r;
	float appear = tag.g;
	float mask = tag.a;

	float opacity = step(appear, vTransition) * mask;

	gl_FragColor = vec4(tint * uColor, opacity);
}
