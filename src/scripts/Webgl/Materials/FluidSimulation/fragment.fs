precision highp float;
uniform sampler2D velocity;
varying vec2 vUv;

void main() {
	vec2 vel = texture2D(velocity, vUv).xy;
	float len = length(vel);
	vel = vel * 0.5 + 0.5;

	vec3 color = vec3(vel.x, vel.y, 1.0);
	color = mix(vec3(1.0), color, len);

	gl_FragColor = vec4(vec3(color.r, color.g, color.b), color.r);
}
