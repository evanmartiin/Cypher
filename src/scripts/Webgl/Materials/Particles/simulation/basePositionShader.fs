void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;

	vec4 startPositionsTexture = texture2D(defTex, uv);
	vec3 startPositions = startPositionsTexture.xyz;

	gl_FragColor = vec4(startPositions, 0.0);
}