uniform float uAnglePower;
uniform vec3 uLightColor;

varying float vIntensity;
varying vec3 vNormal;

void main() {
	vec3 normal = vec3(vNormal.x, vNormal.y, vNormal.z);
	float angleIntensity = pow(dot(normal, vec3(0.0, 0.0, 0.0)), 0.);

	gl_FragColor = vec4(uLightColor, angleIntensity * 0.01);
    #if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping(gl_FragColor.rgb);
    #endif
	gl_FragColor = linearToOutputTexel(gl_FragColor);
}
