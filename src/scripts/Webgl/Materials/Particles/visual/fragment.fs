varying vec3 vColor;

void main() {
	vec3 color = vColor;

	gl_FragColor = vec4(color, 0.0);
}