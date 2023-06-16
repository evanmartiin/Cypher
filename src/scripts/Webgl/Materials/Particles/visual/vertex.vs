attribute float aRandom;

uniform float uSize;
uniform float uAcceleration;
uniform vec2 uVideoBounds;

uniform sampler2D posMap;
uniform sampler2D velMap;
uniform sampler2D uRigPositionMap;

varying float vlifeOpacity;
varying vec3 vNewNormal;

mat3 calcLookAtMatrix(vec3 vector, float roll) {
  vec3 rr = vec3(sin(roll), cos(roll), 0.0);
  vec3 ww = normalize(vector);
  vec3 uu = normalize(cross(ww, rr));
  vec3 vv = normalize(cross(uu, ww));

  return mat3(uu, ww, vv);
}

mat3 getRotation(vec3 velocity) {
  velocity = normalize(velocity);
  velocity.z *= -1.;
  float xz = length(velocity.xz);
  float xyz = 1.;
  float x = sqrt(1. - velocity.y * velocity.y);
  float cosry = velocity.x / xz;
  float sinry = velocity.z / xz;
  float cosrz = x / xyz;
  float sinrz = velocity.y / xyz;
  mat3 maty = mat3(cosry, 0, -sinry, 0, 1, 0, sinry, 0, cosry);
  mat3 matz = mat3(cosrz, sinrz, 0, -sinrz, cosrz, 0, 0, 0, 1);
  return maty * matz;
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) *
    43758.5453123);
}

void main() {
  vec2 posUv;
  posUv.x = mod(float(gl_InstanceID), (uSize));
  posUv.y = float(float(gl_InstanceID) / (uSize));
  posUv /= vec2(uSize);
  vec4 positionTexture = texture2D(posMap, posUv);
  vec4 velocityTexture = texture2D(velMap, posUv);
  vec4 rigPositionMap = texture2D(uRigPositionMap, posUv);

  mat3 particleRotation = getRotation(velocityTexture.xyz);

  vec3 particleScale = vec3(min(1.0, 10.0 * length(velocityTexture.xyz)), 1.0, 1.0);

      // vec2 st = gl_FragCoord.xy / u_resolution.xy;

  // vec3 transformedPos = position * particleScale * aRandom * positionTexture.w * uAcceleration;
  vec3 transformedPos = position * particleScale * aRandom ;
  // vec3 transformedPos = position;
  transformedPos = (particleRotation * transformedPos);
  // transformedPos.z += positionTexture.z;
  transformedPos.x += (rigPositionMap.x * 100.);
  transformedPos.y += (rigPositionMap.y * 100.);
  transformedPos.x += positionTexture.x;
  transformedPos.y += positionTexture.y;
  transformedPos.z += positionTexture.z;
  // transformedPos += positionTexture.xyz;

  csm_Normal *= particleRotation;
  vNewNormal = csm_Normal;

  csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(transformedPos, 1.0);

  vlifeOpacity = positionTexture.w;
}
