uniform sampler2D uVAT;
uniform float uTime;
uniform float uVertexCount;

attribute float aOffset;

void main() {
    float vertex = float(gl_VertexID) / uVertexCount;
    vec2 texCoord = vec2(vertex, uTime * .0001 + aOffset);

    vec3 pos = position;
    pos += texture2D(uVAT, texCoord).rgb;

    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.);
}