

void main() {
	float d = 1.0;
	bool isSoft = resolution[0] > 0.0 && resolution[1] > 0.0;
	if(isSoft) {
		vec2 sUv = gl_FragCoord.xy / resolution;
		d = readDepth(depth, sUv);
	}
	float intensity = vIntensity;
	vec3 normal = vec3(vNormal.x, vNormal.y, abs(vNormal.z));
	float angleIntensity = pow(dot(normal, vec3(0.0, 0.0, 1.0)), anglePower);
	intensity *= angleIntensity;
    // fades when z is close to sampled depth, meaning the cone is intersecting existing geometry

	if(isSoft) {
		intensity *= smoothstep(0., 1., vViewZ - d);
	}
	gl_FragColor = vec4(lightColor, intensity * opacity);
    #if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping(gl_FragColor.rgb);
    #endif
	gl_FragColor = linearToOutputTexel(gl_FragColor);
}
