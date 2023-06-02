export default function customizeMaterial(material, uniforms, callback) {
	material.onBeforeCompile = (shader, renderer) => {
		Object.assign(uniforms, shader.uniforms);
		shader.uniforms = uniforms;
		callback(shader, renderer);
	};
	return {
		material,
		uniforms,
	};
}
