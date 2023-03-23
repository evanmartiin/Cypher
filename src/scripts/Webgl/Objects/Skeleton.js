import { BufferGeometry, Float32BufferAttribute, Group, LineBasicMaterial, LineSegments } from 'three';
import { POSE } from '@utils/constants.js';
import { state } from '@scripts/State.js';

export const POSE_CONNECTIONS = [
	// Chest
	[POSE.LEFT_SHOULDER, POSE.RIGHT_SHOULDER],
	[POSE.RIGHT_SHOULDER, POSE.RIGHT_HIP],
	[POSE.RIGHT_HIP, POSE.LEFT_HIP],
	[POSE.LEFT_HIP, POSE.LEFT_SHOULDER],

	// Right arm
	[POSE.RIGHT_SHOULDER, POSE.RIGHT_ELBOW],
	[POSE.RIGHT_ELBOW, POSE.RIGHT_WRIST],

	// Left arm
	[POSE.LEFT_SHOULDER, POSE.LEFT_ELBOW],
	[POSE.LEFT_ELBOW, POSE.LEFT_WRIST],

	// Right leg
	[POSE.RIGHT_HIP, POSE.RIGHT_KNEE],
	[POSE.RIGHT_KNEE, POSE.RIGHT_ANKLE],

	// Left leg
	[POSE.LEFT_HIP, POSE.LEFT_KNEE],
	[POSE.LEFT_KNEE, POSE.LEFT_ANKLE],
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

		this.add(this.skeleton);
	}

	hide() {
		this.remove(this.skeleton);
	}

	onPlayerMoved(rig) {
		this.realtimePoses = rig.poseLandmarks;
		// if (!this.realtimePoses) return;

		// const vertY = [];

		// POSE_CONNECTIONS.forEach((connection) => {
		// 	const start = connection[0];
		// 	const end = connection[1];
		// 	vertY.push(1 - this.poses[start].y, 1 - this.poses[end].y);
		// });
		// this.offset.y = Math.min(...vertY);
	}

	createGeometry() {
		this.poses = this.realtimePoses;
		if (!this.poses) return;

		this.geometry = new BufferGeometry();
		const vertices = [];
		const vertX = [];
		const vertY = [];

		POSE_CONNECTIONS.forEach((connection) => {
			const start = connection[0];
			const end = connection[1];
			vertX.push(1 - this.poses[start].x, 1 - this.poses[end].x);
			vertY.push(1 - this.poses[start].y, 1 - this.poses[end].y);
		});

		this.height = Math.abs(Math.max(...vertY) - Math.min(...vertY));
		this.width = Math.abs(Math.max(...vertX) - Math.min(...vertX));
		this.offset = {
			x: Math.abs(Math.min(...vertX)),
			y: Math.min(...vertY),
		};

		POSE_CONNECTIONS.forEach((connection) => {
			const start = connection[0];
			const end = connection[1];
			vertices.push((1 - this.poses[start].x - this.offset.x - this.width / 2) / this.height, (1 - this.poses[start].y - this.offset.y) / this.height, 0);
			vertices.push((1 - this.poses[end].x - this.offset.x - this.width / 2) / this.height, (1 - this.poses[end].y - this.offset.y) / this.height, 0);
		});

		this.geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
	}
}

export { Skeleton };
