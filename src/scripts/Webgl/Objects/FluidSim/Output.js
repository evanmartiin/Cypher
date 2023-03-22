import { Camera, Group, Mesh, MeshBasicMaterial, PlaneGeometry, RawShaderMaterial, Scene, Vector2 } from 'three';
import colorFragment from '@Webgl/Materials/FluidSimulation/simulation/color.frag';
import faceVertex from '@Webgl/Materials/FluidSimulation/simulation/face.vert';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import Mouse from './Mouse.js';
import Simulation from './Simulation.js';

export default class Output extends Group {
	constructor() {
		super();
		state.register(this);
		this.init();
	}

	init() {
		Mouse.init();
		this.simulation = new Simulation();

		this.scene = new Scene();
		this.camera = new Camera();

		this.output = new Mesh(
			new PlaneGeometry(2, 2),
			new RawShaderMaterial({
				vertexShader: faceVertex,
				fragmentShader: colorFragment,
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
		app.webgl.scene.add(this.output);

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

	onResize() {
		this.simulation.resize();
	}

	onRender() {
		Mouse.update();
		this.simulation.update();
		app.webgl.renderer.setRenderTarget(null);
		app.webgl.renderer.render(app.webgl.scene, app.webgl.camera);
	}
}
