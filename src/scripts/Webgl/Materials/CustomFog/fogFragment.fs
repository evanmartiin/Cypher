#ifdef USE_FOG
// float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
float fogFactor2 = smoothstep(4.5, 5., vFogDepth);

vec3 avatarWorldPos = vWorldPosition;
avatarWorldPos.xz *= 1.5;
avatarWorldPos.y *= 0.5;

float avatarDist = smoothstep(0., 2.0, length(avatarWorldPos));

float avatarDemoDist = smoothstep(0., 2.0, length(avatarWorldPos - vec3(3.0, 0.0, 3.0) * 1.5));

    // Fresnel
float fresnelFactor = abs(dot(vViewDirection, vNormal));

    // Shaping function
// fresnelFactor = pow(fresnelFactor, uAnglePower);
fresnelFactor = pow(fresnelFactor, 1.0);

if(fresnelFactor <= 0.0) {
discard;
}

vec3 gradient = mix(vec3(1., 1., 1.0), vec3(0.0, 0.0, 0.0), fresnelFactor);

gl_FragColor.rgb *= (vec3(fresnelFactor));
gl_FragColor.rgb = mix((gl_FragColor.rgb * 1.1), gl_FragColor.rgb * 0.5, avatarDist * avatarDemoDist);
#endif