precision highp float;

uniform sampler2D tDiffuse;

uniform float uRatio;
uniform float uResolution;

uniform float uTime;

varying vec2 vUv;

#define PI 3.14159265359
#define NEAR 1.
#define FAR 100.

void main() {
	vec3 scene = texture2D(tDiffuse, vUv).rgb;

	gl_FragColor = vec4(scene, 1.);

}
