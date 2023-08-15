import { AdditiveBlending, Mesh, PlaneGeometry, RawShaderMaterial, Vector2 } from 'three';
import externalForceFragment from '@Webgl/Materials/FluidSimulation/simulation/externalForce.frag';
import mouseVertex from '@Webgl/Materials/FluidSimulation/simulation/mouse.vert';
import { app } from '@scripts/App.js';
import RigCoords from './RigCoordsFluid.js';
import ShaderPass from './ShaderPass.js';

export default class ExternalForce extends ShaderPass {
	constructor(simProps) {
		super({
			output: simProps.dst,
		});

		this.init(simProps);
	}

	init(simProps) {
		super.init();
		const geometry = new PlaneGeometry(1, 1);

		const LeftWristMaterial = new RawShaderMaterial({
			vertexShader: mouseVertex,
			fragmentShader: externalForceFragment,
			blending: AdditiveBlending,
			uniforms: {
				px: {
					value: simProps.cellScale,
				},
				force: {
					value: new Vector2(0.0, 0.0),
				},
				center: {
					value: new Vector2(0.0, 0.0),
				},
				scale: {
					value: new Vector2(simProps.cursor_size, simProps.cursor_size),
				},
			},
		});

		this.leftWristMesh = new Mesh(geometry, LeftWristMaterial);
		app.webgl.scene.add(this.leftWristMesh);
		this.scene.add(this.leftWristMesh);
	}

	update(props) {
		// Cursor Scale
		const cursorSizeX = props.cursor_size * props.cellScale.x;
		const cursorSizeY = props.cursor_size * props.cellScale.y;

		// Left Wrist
		const forceLeftWristX = (RigCoords.diff.x / 2) * props.mouse_force;
		const forceLeftWristY = (RigCoords.diff.y / 2) * props.mouse_force;

		const centerLeftWristX = Math.min(Math.max(RigCoords.coords.x, -1 + cursorSizeX + props.cellScale.x * 2), 1 - cursorSizeX - props.cellScale.x * 2);
		const centerLeftWristY = Math.min(Math.max(RigCoords.coords.y, -1 + cursorSizeY + props.cellScale.y * 2), 1 - cursorSizeY - props.cellScale.y * 2);

		const leftWristUniforms = this.leftWristMesh.material.uniforms;

		leftWristUniforms.force.value.set(forceLeftWristX, forceLeftWristY);
		leftWristUniforms.center.value.set(centerLeftWristX, centerLeftWristY);
		leftWristUniforms.scale.value.set(props.cursor_size, props.cursor_size);

		super.update();
	}
}
