const vec2 cellSize = 1.0 / resolution.xy;

uniform float uDelta;
uniform sampler2D uTargetPositionMap;
uniform sampler2D uPrevTargetPositionMap;

float random(in vec2 st) {
  return fract(
    sin(
      dot(st.xy, vec2(12.9898, 78.233))
    ) * 43758.5453123
  );
}

void main() {
  vec2 ref = gl_FragCoord.xy * cellSize;
  vec4 positionData = texture2D(uPositionMap, ref);
  vec3 position = positionData.xyz;
  vec4 velocityData = texture2D(uVelocityMap, ref);
  vec3 velocity = velocityData.xyz;
  float life = velocityData.w;
  
  if (life < 0.0) {
    life = 1.0 + 2.0 * random(position.xz + 21.4131 * life);
  }
  
  if (life >= 1.0) {
    vec3 targetPos = texture2D(uTargetPositionMap, ref).xyz;
    position = targetPos;
  } else {
    position += velocity * uDelta;
  }
  
  gl_FragColor = vec4(position, life);
}
