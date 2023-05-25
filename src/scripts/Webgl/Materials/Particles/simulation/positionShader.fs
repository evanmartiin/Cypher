uniform float uTime;
uniform float uDelta;
uniform float uDieSpeed;
uniform float uAcceleration;
uniform vec3 uCoordsPositions;
uniform sampler2D uTextureDefaultPosition;
uniform sampler2D uFluidTexture;

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;

	vec4 positionTexture = texture2D(posTex, uv);
	vec4 positionFluidTexture = texture2D(uFluidTexture, uv);
	vec4 velocityTexture = texture2D(velTex, uv);
	vec3 position = positionTexture.xyz;
	vec3 velocity = velocityTexture.xyz;
	vec3 positionFluid = positionFluidTexture.xyz;
	float life = positionTexture.w - (uDieSpeed) * uDelta;

	if(life >= 0.0) {
		position += velocity * uDelta;
	} else {
		position = texture2D(uTextureDefaultPosition, uv).xyz;
		// position.x += uCoordsPositions.x * 35.;
		// position.y += uCoordsPositions.y * 15.;
		// position.z += uCoordsPositions.z * 35.;
		position.y += 5.;
		life = (0.5 + fract(positionTexture.w * uAcceleration + uTime));
	}

	gl_FragColor = vec4(position, life);
}