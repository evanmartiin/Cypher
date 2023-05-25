precision highp float;
uniform sampler2D velocity;
varying vec2 vNewUv;

void main() {

	vec2 vel = texture2D(velocity, vNewUv).xy;
	float len = length(vel);
	vel = vel * 0.5 + 0.5;

	vec3 color = vec3(vel.x, vel.y, 1.0);
	color = mix(vec3(1.0), color, len);

	csm_DiffuseColor = vec4(vec3(color.r, color.g, color.b), 1.0);
	csm_FragColor = vec4(vec3(color.r, color.g, color.b), 1.0);
}
