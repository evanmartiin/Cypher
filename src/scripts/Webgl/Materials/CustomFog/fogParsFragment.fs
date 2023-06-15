#ifdef USE_FOG
uniform float fogNear;
uniform float fogFar;
uniform float uTransitionProgress;
uniform bool uSwitchTransition;
uniform vec3 fogColor;
uniform vec3 uTransitionColor;
uniform sampler2D uPixelSortingTexture;
uniform sampler2D uGlitchTexture;

varying float vFogDepth;
varying vec2 vTransitionUvs;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;
varying vec3 vNormal2;
#endif