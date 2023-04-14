uniform sampler2D posMap;
uniform sampler2D uTexture;
uniform sampler2D uTexture2;

varying float vlifeOpacity;
varying vec2 vUv;
varying vec2 vPosUv;

float random(vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
	// gl_FragColor = vec4(1.0);
	vec4 text = texture2D(uTexture, vUv);
	float text2 = texture2D(uTexture2, vUv).r;

	float strength = mod(vUv.y * 30., 1.0);
	strength = step(0.5, strength);

	float rand = random(vUv);

	vec2 gridUv = vec2(0.0, floor(vUv.y * 100.));
	float rand2 = random(gridUv);

	float dist = 1.0 - smoothstep(0., 0.5, length(vUv - 0.5));

	gl_FragColor = texture2D(posMap, vUv);
	gl_FragColor = vec4(vec3(rand2), text);
	gl_FragColor.a *= vlifeOpacity * text2 * dist;
	gl_FragColor = vec4(vUv, 1.0, vlifeOpacity);
}