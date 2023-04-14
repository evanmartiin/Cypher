uniform float uSize;

uniform sampler2D posMap;
uniform sampler2D velMap;

varying float vlifeOpacity;
varying vec2 vUv;
varying vec2 vPosUv;

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

void main() {
  vec2 posUv;
  posUv.x = mod(float(gl_InstanceID), (uSize - 1.0));
  posUv.y = float(float(gl_InstanceID) / (uSize - 1.0));
  posUv /= vec2(uSize);
  vec4 positionTexture = texture2D(posMap, posUv);
  vec4 velocityTexture = texture2D(velMap, posUv);

  mat3 particleRotation = getRotation(velocityTexture.xyz);
  mat4 particleRotationLookAt = mat4(calcLookAtMatrix(velocityTexture.xyz, .0));

  vec3 particleScale = vec3(min(1.0, 10.0 * length(velocityTexture.xyz)), 1.0, 1.0);

  vec3 transformedPos = (vec4(position * particleScale, 1.0)).xyz;
  transformedPos.xy = (particleRotation * transformedPos).xy;
  transformedPos += positionTexture.xyz;

  vec3 debugPos = position;
  debugPos.y += 10.;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformedPos, 1.0);

  vUv = uv;
  vPosUv = posUv;
  vlifeOpacity = positionTexture.w;
}
