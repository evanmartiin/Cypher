uniform float uAttenuation;
uniform vec3 uSpotLightPosition;
varying float vViewZ;
varying float vIntensity;
varying vec3 vNormal;
varying vec3 vWorldPosition;


void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  vec4 viewPosition = viewMatrix * worldPosition;
  vViewZ = viewPosition.z;
  float intensity = distance(worldPosition.xyz, uSpotLightPosition) / uAttenuation;
  intensity = 1.0 - clamp(intensity, 0.0, 1.0);
  vIntensity = intensity;

  gl_Position = projectionMatrix * viewPosition;
}