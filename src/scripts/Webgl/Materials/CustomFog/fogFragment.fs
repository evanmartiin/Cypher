#ifdef USE_FOG
// float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
float fogFactor2 = smoothstep(4.5, 5., vFogDepth);

float dist = smoothstep(0., 3., length(vWorldPosition));

// gl_FragColor.rgb = vec3(vFogDepth);
// gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
// gl_FragColor.rgb = vec3(dist);
// gl_FragColor.rgb = vec3(dist);
gl_FragColor.rgb = mix(gl_FragColor.rgb + fogColor * 0.2, gl_FragColor.rgb, dist);
// gl_FragColor.a = mix(gl_FragColor.a, 0.5, dist);
#endif