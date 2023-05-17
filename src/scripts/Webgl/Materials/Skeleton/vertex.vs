void main() {
  csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}