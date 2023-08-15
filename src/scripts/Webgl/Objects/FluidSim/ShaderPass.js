import { Camera, Mesh, PlaneGeometry, RawShaderMaterial, Scene } from 'three';
import { app } from '@scripts/App.js';

export default class ShaderPass {
	constructor(props) {
		this.props = props;
		this.uniforms = this.props.material?.uniforms;
	}

	init() {
		this.scene = new Scene();
		this.camera = new Camera();

		if (this.uniforms) {
			this.material = new RawShaderMaterial(this.props.material);
			this.geometry = new PlaneGeometry(2.0, 2.0);
			this.plane = new Mesh(this.geometry, this.material);
			this.scene.add(this.plane);
		}
	}

	update() {
		app.webgl.renderer.setRenderTarget(this.props.output);
		app.webgl.renderer.render(this.scene, this.camera);
		app.webgl.renderer.setRenderTarget(null);
	}
}
