import { BoxGeometry, Camera, Group, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshStandardMaterial, PlaneGeometry, RawShaderMaterial, Scene, Vector2 } from 'three';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import Common from './Common.js';
import Mouse from './Mouse.js';
import Simulation from './Simulation.js';
import color_frag from './glsl/sim/color.frag';
import face_vert from './glsl/sim/face.vert';

export default class Output extends Group {
	constructor() {
		super();
		state.register(this);
		this.init();
	}

	init() {
		Common.init();
		Mouse.init();
		this.simulation = new Simulation();

		this.scene = new Scene();
		this.camera = new Camera();

		this.output = new Mesh(
			new BoxGeometry(),
			new RawShaderMaterial({
				vertexShader: face_vert,
				fragmentShader: color_frag,
				uniforms: {
					velocity: {
						value: this.simulation.fbos.vel_0.texture,
					},
					boundarySpace: {
						value: new Vector2(),
					},
				},
			}),
		);
		// app.webgl.scene.add(this.output);

		const mesh = new Mesh(
			new PlaneGeometry(8, 4),
			new MeshBasicMaterial({
				map: this.simulation.fbos.vel_0.texture,
			}),
		);
		app.webgl.scene.add(mesh);
		mesh.position.z = -3;
		mesh.position.y = 0.5;
	}

	resize() {
		this.simulation.resize();
	}

	onRender() {
		Common.update();
		Mouse.update();
		this.simulation.update();
		app.webgl.renderer.setRenderTarget(null);
		app.webgl.renderer.render(app.webgl.scene, app.webgl.camera);
	}
}
