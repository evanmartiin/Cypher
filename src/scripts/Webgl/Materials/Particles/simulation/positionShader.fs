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

	if(life < 0.0) {
		position = texture2D(uTextureDefaultPosition, uv).xyz;
		position.x += uHandPosition.x * 30.;
		position.y += uHandPosition.y * 15.;
		// position.z += uHandPosition.z * 12.;
		life = 0.5 + fract(positionInfo.w * 21.4131 + uTime);
	} else {
		position += velocity * uDelta;
	}

	gl_FragColor = vec4(position, life);
}