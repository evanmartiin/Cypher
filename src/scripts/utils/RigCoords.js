import { Vector3 } from 'three';
import { POSE } from '@utils/constants.js';
import { state } from '@scripts/State.js';

class RigCoords {
	constructor() {
		state.register(this);
		this.rightWrist = new Vector3();
		this.rightWristOld = new Vector3();
		this.rightWristDiff = new Vector3();
		this.rightWristSpeed = {
			value: 0,
		};
		this.leftWrist = new Vector3();
		this.leftWristOld = new Vector3();
		this.leftWristDiff = new Vector3();
		this.leftWristSpeed = {
			value: 0,
		};
	}

	onPlayerMovedEnough(points) {
		// Left Wrist Movement
		this.leftWrist.set(1.0 - points[POSE.LEFT_WRIST].x * 2, 1.0 - points[POSE.LEFT_WRIST].y * 2, 1.0 - points[POSE.LEFT_WRIST].z * 2);

		// Right Wrist Movement
		this.rightWrist.set(1.0 - points[POSE.RIGHT_WRIST].x * 2, 1.0 - points[POSE.RIGHT_WRIST].y * 2, 1.0 - points[POSE.RIGHT_WRIST].z * 2);
	}

	update() {
		// Left Wrist Acceleration
		this.leftWristDiff.subVectors(this.leftWrist, this.leftWristOld);
		this.leftWristOld.copy(this.leftWrist);

		if (this.leftWristOld.x === 0 && this.leftWristOld.y === 0) this.leftWristDiff.set(0, 0, 0);
		this.leftWristSpeed.value += (this.leftWristDiff.length() * 10 - this.leftWristSpeed.value) * 0.03;

		// Right Wrist Acceleration
		this.rightWristDiff.subVectors(this.rightWrist, this.rightWristOld);
		this.rightWristOld.copy(this.rightWrist);

		if (this.rightWristOld.x === 0 && this.rightWristOld.y === 0) this.rightWristDiff.set(0, 0, 0);
		this.rightWristSpeed.value += (this.rightWristDiff.length() * 10 - this.rightWristSpeed.value) * 0.03;
	}
}

export default new RigCoords();
