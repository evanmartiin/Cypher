uniform float uTime;
uniform float uDelta;
uniform float uDieSpeed;
uniform vec3 uHandPosition;
uniform sampler2D uTextureDefaultPosition;

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;

	vec4 positionInfo = texture2D(posTex, uv);
	vec4 velocityInfo = texture2D(velTex, uv);
	vec3 position = positionInfo.xyz;
	vec3 velocity = velocityInfo.xyz;
	float life = positionInfo.w - uDieSpeed * uDelta;

	if(life >= 0.0) {
		position += velocity * uDelta;
	} else {
		position = texture2D(uTextureDefaultPosition, uv).xyz;
		position.x += uHandPosition.x * 30.;
		position.y += uHandPosition.y * 15.;
		// position.z += uHandPosition.z * 5.;
		life = 0.5 + fract(positionInfo.w + uTime);
	}

	gl_FragColor = vec4(position, life);
}