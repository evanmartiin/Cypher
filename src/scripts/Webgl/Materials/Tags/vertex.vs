attribute vec3 position;
attribute vec2 uv;
attribute vec2 instancePosition;
attribute vec3 instanceParams;
attribute float instanceTransition;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float uTexPerRow;

varying vec2 vUv;
varying float vTransition;

vec2 rotate2D(vec2 pos, float rotation)
{
  return vec2(
    cos(rotation) * pos.x + sin(rotation) * pos.y,
    cos(rotation) * pos.y - sin(rotation) * pos.x
  );
}

vec2 computeUVs(vec2 uv, float texPerRow, float texID) {
  vec2 uvs = uv / texPerRow; // Resize UVs to fit a single texture
  uvs += vec2(mod(texID, texPerRow), floor(texID / texPerRow)) / texPerRow; // Offset UVs to fit the texID
  return uvs;
}

void main() {
  float SCALE = instanceParams.x;
  float TEXTUREID = instanceParams.y;
  float ROTATION = instanceParams.z;

  vec2 rotatedPos = rotate2D(position.xy, ROTATION);
  vec3 pos = vec3(rotatedPos, position.z) * SCALE;
  pos += vec3(instancePosition, 0.);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);

  vUv = computeUVs(uv, uTexPerRow, TEXTUREID);
  vTransition = instanceTransition;
}
