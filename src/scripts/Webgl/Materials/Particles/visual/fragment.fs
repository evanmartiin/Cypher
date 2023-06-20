uniform float uTime;

varying float vlifeOpacity;

void main() {
	csm_DiffuseColor.rgb = vec3(vlifeOpacity);
}