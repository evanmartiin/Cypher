uniform float uTime;
uniform float uDelta;
uniform float uDieSpeed;
uniform vec3 uLeftHandPosition;
uniform vec3 uRightHandPosition;
uniform sampler2D uTextureDefaultPosition;

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;

	vec4 positionTexture = texture2D(posTex, uv);
	vec4 velocityTexture = texture2D(velTex, uv);
	vec3 position = positionTexture.xyz;
	vec3 velocity = velocityTexture.xyz;
	float life = positionTexture.w - uDieSpeed * uDelta;

	if(life >= 0.0) {
		position += velocity * uDelta;
	} else {
		position = texture2D(uTextureDefaultPosition, uv).xyz;
		position.x += uLeftHandPosition.x * 35.;
		position.y += uLeftHandPosition.y * 15.;
		// position.z += uLeftHandPosition.z * 5.;
		life = 0.5 + fract(positionTexture.w + uTime);
	}

	gl_FragColor = vec4(position, life);
}