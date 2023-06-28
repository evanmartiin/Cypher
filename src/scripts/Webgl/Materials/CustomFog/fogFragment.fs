#ifdef USE_FOG
float time = uTime * 0.001;
// float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
float fogFactor2 = smoothstep(0., 10., vFogDepth);

vec3 avatarWorldPos = vWorldPosition;
avatarWorldPos.xyz *= 2.;
// avatarWorldPos.y *= 0.5;
avatarWorldPos.z -= 6.;

// transitionsUvs += fract(time * 0.01);

vec4 glitchTex = texture2D(uGlitchTexture, vTransitionUvs * 5.);
vec4 pixelSortingTex = texture2D(uPixelSortingTexture, vTransitionUvs * 5.);

float tempIn = uTransitionProgress * 25.;
tempIn -= (pixelSortingTex.r + glitchTex.r) * 17.5;

float distIn = 1.0 - length(avatarWorldPos);
tempIn = smoothstep(tempIn - 0.8, tempIn, distIn);

float tempOut = uTransitionProgress * 25.;
tempOut += (pixelSortingTex.r + glitchTex.r) * 17.5;

float distOut = length(avatarWorldPos);
tempOut = smoothstep(tempOut - 0.8, tempOut, distOut);

// float dist = length(vTransitionUvs - 0.5);

float avatarDist = smoothstep(2., 3., length(avatarWorldPos));
float dist = smoothstep(0., 50., length(avatarWorldPos));

float avatarDemoDist = smoothstep(0., 2.0, length(avatarWorldPos - vec3(3.0, 0.0, 3.0) * 1.5));

    // Fresnel
float fresnelFactor = abs(dot(vViewDirection, vNormal));

    // Shaping function
// fresnelFactor = pow(fresnelFactor, uAnglePower);
fresnelFactor = pow(fresnelFactor, 1.0);

if(fresnelFactor <= 0.0) {
discard;
}

// vec3 render = mix((gl_FragColor.rgb), gl_FragColor.rgb * 0.75, avatarDist);
vec3 render = gl_FragColor.rgb;

vec3 tempRender = render;

vec3 switchColorTransition = mix(render, uTransitionColor, 1.0 - dist);

if(uSwitchTransition) {
tempRender = mix(switchColorTransition * 1.5, render, tempIn);
} else {
tempRender = mix(switchColorTransition * 1.5, render, tempOut);
}

gl_FragColor.rgb *= (vec3(fresnelFactor));
gl_FragColor.rgb = vec3(avatarDist);
gl_FragColor.rgb = render;
gl_FragColor.rgb = vec3(pixelSortingTex);
gl_FragColor.rgb = vec3(glitchTex);
// gl_FragColor.rgb = rOut;
// gl_FragColor.rgb = rIn;
gl_FragColor.rgb = tempRender;
#endif