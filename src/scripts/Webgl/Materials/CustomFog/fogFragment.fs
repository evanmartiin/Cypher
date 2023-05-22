#ifdef USE_FOG
// float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
float fogFactor2 = smoothstep(4.5, 5., vFogDepth);

float dist = smoothstep(0., 3., length(vWorldPosition));

    // Fresnel
float fresnelFactor = abs(dot(vViewDirection, vNormal));

    // Shaping function
// fresnelFactor = pow(fresnelFactor, uAnglePower);
fresnelFactor = pow(fresnelFactor, 1.0);

if(fresnelFactor <= 0.0) {
discard;
}

vec3 gradient = mix(vec3(1., 1., 1.0), vec3(1.0, 0.0, 0.0), fresnelFactor);

gl_FragColor.rgb *= vec3(fresnelFactor);
gl_FragColor.rgb *= mix((gl_FragColor.rgb + fogColor), gl_FragColor.rgb * 0.25, dist);
#endif