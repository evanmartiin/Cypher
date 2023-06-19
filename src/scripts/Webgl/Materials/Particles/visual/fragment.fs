uniform float uTime;

varying float vlifeOpacity;
varying vec3 vNewNormal;
varying vec3 vNewViewPosition;
varying vec3 vWorldPos;

void main() {

	    // Calculate the view direction
	vec3 viewDirection = normalize(vNewViewPosition);

    // Calculate the dot product between the view direction and the surface normal
	float fresnelTerm = dot(normalize(vNewNormal), -viewDirection);

    // Define the fresnel color and intensity
	vec3 fresnelColor = vec3(1.0, 0.0, 0.0); // White color
	float fresnelIntensity = 1.0;

    // Calculate the final color using the fresnel effect
	vec3 finalColor = mix(vec3(1.0), vec3(0.0), pow(1.0 - fresnelTerm, fresnelIntensity));
	// finalColor = step(0.2, finalColor);

	// csm_FragColor.rgb = vec3(vNewNormal);
	csm_DiffuseColor.rgb = finalColor;
	// csm_FragColor.rgb = vNewViewPosition;
	// csm_DiffuseColor.rgb *= vec3(1.0 - fresnelTerm);
	// csm_DiffuseColor.rgb = vec3(1.);
}