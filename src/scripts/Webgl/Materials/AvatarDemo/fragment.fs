uniform float uOpacity;
uniform float uTime;

void main() {
	csm_DiffuseColor *= vec4(uOpacity);
}
