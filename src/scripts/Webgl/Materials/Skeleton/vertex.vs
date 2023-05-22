void main() {
  gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.0);
}