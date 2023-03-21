import { FloatType, Group, HalfFloatType, Mesh, PlaneGeometry, Vector2, WebGLRenderTarget } from 'three';
import { FluidSimulationMaterial } from '@Webgl/Materials/FluidSimulation/material.js';
import { POSE } from '@utils/constants.js';
import { globalUniforms } from '@utils/globalUniforms.js';
import { state } from '@scripts/State.js';
import Advection from './Advection.js';
import ExternalForce from './ExternalForce.js';

export class FluidSimulation extends Group {
	constructor() {
		super();
		state.register(this);
		this.positions = [];
		this.leftWrist = new Vector2(0.5, 0.5);

		this.fbos = {
			// The velocity. Use alternating for clarity.
			vel_0: null,
			vel_1: null,

			// Calculate the viscosity term. Use alternating.
			vel_viscous0: null,
			vel_viscous1: null,
			// The divergence values for pressure calculation
			div: null,

			// Calculate the Pressure. Use alternately.
			pressure_0: null,
			pressure_1: null,
		};

		this.options = {
			iterations_poisson: 32,
			iterations_viscous: 32,
			mouse_force: 20,
			resolution: 0.5,
			cursor_size: 100,
			viscous: 30,
			isBounce: false,
			dt: 0.014,
			isViscous: false,
			BFECC: true,
		};

		// this.fboSize = new Vector2(window.innerWidth, window.innerHeight);
		this.fboSize = new Vector2();
		this.cellScale = new Vector2();
		this.boundarySpace = new Vector2();

		this.init();
	}

	init() {
		this.calcSize();
		this.createFBOS();
		this.createShaderPass();
		this.mesh = this.createMesh();
	}

	calcSize() {
		const width = Math.round(this.options.resolution * window.innerWidth);
		const height = Math.round(this.options.resolution * window.innerHeight);

		const px_x = 1.0 / width;
		const px_y = 1.0 / height;

		this.cellScale.set(px_x, px_y);
		this.fboSize.set(width, height);
	}

	createFBOS() {
		const type = /(iPad|iPhone|iPod)/g.test(navigator.userAgent) ? HalfFloatType : FloatType;

		for (let key in this.fbos) {
			this.fbos[key] = new WebGLRenderTarget(this.fboSize.x, this.fboSize.y, {
				type: type,
			});
		}
	}

	createShaderPass() {
		this.advection = new Advection({
			cellScale: this.cellScale,
			fboSize: this.fboSize,
			dt: this.options.dt,
			src: this.fbos.vel_0,
			dst: this.fbos.vel_1,
		});

		this.externalForce = new ExternalForce({
			cellScale: this.cellScale,
			cursor_size: this.options.cursor_size,
			dst: this.fbos.vel_1,
		});
	}

	createMesh() {
		const geometry = new PlaneGeometry(2, 2);
		const material = new FluidSimulationMaterial({
			uniforms: {
				...globalUniforms,
				uPos: { value: this.leftWrist },
			},
		});

		const mesh = new Mesh(geometry, material);
		this.add(mesh);

		return mesh;
	}

	onAttach() {}

	onResize() {
		this.calcSize();

		for (let key in this.fbos) {
			this.fbos[key].setSize(this.fboSize.x, this.fboSize.y);
		}

		console.log('resize');
	}

	onPlayerMoved(rig) {
		const leftHand = rig.poseLandmarks[POSE.LEFT_WRIST];
		this.mesh.material.uniforms.uPos.value = this.leftWrist.set(1.0 - leftHand.x, 1.0 - leftHand.y);
	}

	onRender({ dt }) {
		if (this.options.isBounce) {
			this.boundarySpace.set(0, 0);
		} else {
			this.boundarySpace.copy(this.cellScale);
		}

		this.advection.update(this.options);

		this.externalForce.update({
			cursor_size: this.options.cursor_size,
			mouse_force: this.options.mouse_force,
			cellScale: this.cellScale,
		});
	}
}
