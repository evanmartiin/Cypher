import { Group, Mesh, PlaneGeometry, Vector2 } from 'three';
import { FluidSimulationMaterial } from '@Webgl/Materials/FluidSimulation/material.js';
import { EVENTS } from '@utils/constants.js';
import { globalUniforms } from '@utils/globalUniforms.js';
import { state } from '@scripts/State.js';

const POSE_CONNECTIONS = [
	// Chest
	[11, 12],
	[12, 24],
	[24, 23],
	[23, 11],

	// Left arm
	[12, 14],
	[14, 16],

	// Right arm
	[11, 13],
	[13, 15],

	// Left leg
	[24, 26],
	[26, 28],

	// Right leg
	[23, 25],
	[25, 27],
];

export class FluidSimulation extends Group {
	constructor() {
		super();
		state.register(this);
		this.positions = [];
		this.vecTest = new Vector2();
		this.mesh = this.createMesh();
	}

	onAttach() {
		// state.on(EVENTS.RIG_COMPUTED, this.updateRig);
	}

	onRender({ dt }) {
		// console.log(dt);
	}

	onPlayerMoved(rig) {
		// this.realtimePoses = rig.poseLandmarks[12];
		console.log(rig.poseLandmarks[14].x);
		// this.mesh.material.uniforms.uPos.value = this.vecTest.set(this.realtimePoses[12].x, this.realtimePoses[12].y);
	}

	// updateRig = (riggedPose) => {
	// 	this.positions = [];

	// 	// console.log(riggedPose.LeftHand);
	// 	const positionsArray = Object.values(riggedPose);
	// 	positionsArray.forEach((vector) => {
	// 		const v = new Vector2().copy(vector);
	// 		this.positions.push(v);
	// 	});

	// 	const leftHand = 1.0 - riggedPose.LeftHand.x;

	// 	this.mesh.material.uniforms.uPos.value = this.vecTest.set(leftHand, riggedPose.LeftHand.y);
	// 	// console.log(leftHand);

	// };

	// enableControl() {
	// 	state.on(EVENTS.RIG_COMPUTED, this.updateRig);
	// }

	createMesh() {
		// this.positions = [];
		// this.positions.push(new Vector2(0.2, 1), new Vector2(0.7, 0.2), new Vector2(0.2, 0.5));

		const geometry = new PlaneGeometry(2, 2);
		const material = new FluidSimulationMaterial({
			uniforms: {
				...globalUniforms,
				uPos: { value: this.positions },
				uVectorCount: { value: 10 },
				// uPositions: { value: this.positions },
			},
		});

		const mesh = new Mesh(geometry, material);
		this.add(mesh);

		return mesh;
	}
}
