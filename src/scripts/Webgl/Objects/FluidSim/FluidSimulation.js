import { Group, Mesh, PlaneGeometry, Vector2 } from 'three';
import { FluidSimulationMaterial } from '@Webgl/Materials/FluidSimulation/material.js';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import RigCoords from './RigCoords.js';
import Simulation from './Simulation.js';

export default class FluidSimulation extends Group {
	constructor() {
		super();
		state.register(this);
		this.init();
	}

	init() {
		this.simulation = new Simulation();

		const geometry = new PlaneGeometry(2, 2);

		const material = new FluidSimulationMaterial({
			uniforms: {
				...globalUniforms,

				velocity: {
					value: this.simulation.fbos.vel_0.texture,
				},
				boundarySpace: {
					value: new Vector2(),
				},
			},
			transparent: true,
		});

		const mesh = new Mesh(geometry, material);
		mesh.position.z = -3;
		mesh.position.y = 1;
		mesh.scale.set(1.6 * 3, 0.9 * 3, 1);
		app.webgl.scene.add(mesh);
	}

	onResize() {
		this.simulation.resize();
	}

	onRender() {
		RigCoords.update();
		this.simulation.update();
		app.webgl.renderer.setRenderTarget(null);
		app.webgl.renderer.render(app.webgl.scene, app.webgl.camera);
	}
}
