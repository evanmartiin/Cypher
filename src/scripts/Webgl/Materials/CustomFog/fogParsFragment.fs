#ifdef USE_FOG
uniform vec3 fogColor;
varying float vFogDepth;
varying vec3 vWorldPosition;
uniform float fogNear;
uniform float fogFar;
#endif