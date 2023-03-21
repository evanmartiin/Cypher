import { Camera, Mesh, PlaneGeometry, RawShaderMaterial, Scene } from 'three';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class ShaderPass {
	constructor(props) {
		state.register(this);
		this.props = props;
		this.uniforms = this.props.material?.uniforms;
	}

	init() {
		this.scene = new Scene();
		this.camera = new Camera();

		if (this.uniforms) {
			this.material = new RawShaderMaterial(this.props.material);
			this.geometry = new PlaneGeometry(2, 2);
			this.plane = new Mesh(this.geometry, this.material);
			this.scene.add(this.plane);
			app.webgl.scene.add(this.plane);
			console.log('oui');
		}
	}

	onRender() {
		app.webgl.renderer.setRenderTarget(this.props.output);
		// app.webgl.renderer.render(app.webgl.scene, app.webgl.camera);
		app.webgl.renderer.render(this.scene, this.camera);
		app.webgl.renderer.setRenderTarget(null);

		// console.log('oui');
	}
}
