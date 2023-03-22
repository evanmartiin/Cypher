import { BufferGeometry, Float32BufferAttribute, Group, LineBasicMaterial, LineSegments } from 'three';
import { POSE } from '@utils/constants.js';
import { state } from '@scripts/State.js';

const POSE_CONNECTIONS = [
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
