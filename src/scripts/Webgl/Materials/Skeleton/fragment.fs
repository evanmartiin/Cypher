uniform vec3 uColor;

void main() {
	csm_DiffuseColor *= vec4(uColor, 1.0);
}
