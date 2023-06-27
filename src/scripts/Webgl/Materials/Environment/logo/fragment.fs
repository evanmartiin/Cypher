// uniform float uTime;

// uniform sampler2D uNoiseTexture;

// vec2 rotate(vec2 uv, float rotation, vec2 mid) {
//     return vec2(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x, cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y);
// }

// void main() {

//     float speed = uTime * 0.001;

//     vec2 rUvs = rotate(vUv, speed, vec2(0.72, 0.67));

//     float pst = texture2D(uPixelSortingTexture, vUv).r;
//     float n = texture2D(uNoiseTexture, vUv).r;

//     float distUvs = 1.0 - length(vec2(vUv.x - 0.72, vUv.y - 0.33));

//     float movement = smoothstep(0., 1.0, sin(distUvs * 2. * 1.5 + (pst * 0.25 + n) + speed));
//     float movement2 = smoothstep(0., 1.0, sin(distUvs * 4. * 1.5 + (pst * 0.25 + n) + speed));
//     float movement3 = smoothstep(0., 1.0, sin(distUvs * 6. * 1.5 + (pst * 0.25 + n) + speed));

//     csm_DiffuseColor.rgb = mix(csm_DiffuseColor.rgb * 10.0, csm_DiffuseColor.rgb, (movement + movement2 + movement3));
// }