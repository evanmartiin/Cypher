#ifdef USE_FOG
vFogDepth = - mvPosition.z;
vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

vec4 mvPos = modelViewMatrix * vec4(vec3(0.), 1.0);
mvPos.xyz += position.xyz;

vViewDirection = normalize(mvPos.xyz - position.xyz);

vTransitionUvs = uv;
#endif