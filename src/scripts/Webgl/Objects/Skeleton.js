import { BufferGeometry, Float32BufferAttribute, Group, LineBasicMaterial, LineSegments } from 'three';
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

class Skeleton extends Group {
	constructor() {
		super();
		state.register(this);

		this.material = new LineBasicMaterial({
			color: 0xff0000,
		});
	}

	show() {
		this.skeleton = new LineSegments(this.geometry, this.material);
		this.skeleton.position.y = 1;
		this.skeleton.position.z = -1.5;

		this.add(this.skeleton);
	}

	hide() {
		this.remove(this.skeleton);
	}

	onPlayerMoved(rig) {
		this.realtimePoses = rig.poseLandmarks;
	}

	createGeometry() {
		this.geometry = new BufferGeometry();
		this.poses = this.realtimePoses;
		const vertices = [];

		POSE_CONNECTIONS.forEach((connection) => {
			const start = connection[0];
			const end = connection[1];

			vertices.push(1 - this.poses[start].x, 1 - this.poses[start].y, 0);
			vertices.push(1 - this.poses[end].x, 1 - this.poses[end].y, 0);
		});

		this.geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
	}
}

export { Skeleton };
