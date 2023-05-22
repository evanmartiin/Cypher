#ifdef USE_FOG
vFogDepth = - mvPosition.z;
vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
#endif