#ifdef USE_FOG
uniform vec3 fogColor;
varying float vFogDepth;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;
varying vec3 vNormal2;
uniform float fogNear;
uniform float fogFar;
#endif