uniform float uTime;

uniform sampler2D uNoiseTexture;

void main() {

    float speed = uTime * 0.002;

    float pst = texture2D(uPixelSortingTexture, vUv).r;
    float n = texture2D(uNoiseTexture, vUv).r;

    float distUvs = 1.0 - length(vec2(vUv.x - 0.72, vUv.y - 0.33));

    float movement = smoothstep(0., 1.0, sin(distUvs * 2. + ((pst * 0.25 + n) * 0.5) + speed));
    float movement2 = smoothstep(0., 1.0, sin(distUvs * 4. * 1.5 + (pst * 0.25 + n) + speed));
    float movement3 = smoothstep(0., 1.0, sin(distUvs * 6. * 1.5 + (pst * 0.25 + n) + speed));

    // csm_DiffuseColor.rgb = mix(csm_DiffuseColor.rgb * 30.0, csm_DiffuseColor.rgb, (movement));
    // csm_DiffuseColor.rgb = mix(csm_DiffuseColor.rgb * 30.0, csm_DiffuseColor.rgb, abs(sin(speed)));
    csm_DiffuseColor.rgb += movement;
    // csm_DiffuseColor.rgb = mix(csm_DiffuseColor.rgb * 10.0, csm_DiffuseColor.rgb, abs(sin(uTime)));
}