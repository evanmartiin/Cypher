import { Vector2 } from 'three';
import { POSE } from '@utils/constants.js';
import { state } from '@scripts/State.js';

class RigCoords {
	constructor() {
		state.register(this);
		this.rightWrist = new Vector2();
		this.rightWristOld = new Vector2();
		this.rightWristDiff = new Vector2();
		this.leftWrist = new Vector2();
		this.leftWristOld = new Vector2();
		this.leftWristDiff = new Vector2();
	}

	onPlayerMovedEnough(rig) {
		// Left Wrist Movement
		this.leftWrist.set(1.0 - rig.poseLandmarks[POSE.LEFT_WRIST].x * 2, 1.0 - rig.poseLandmarks[POSE.LEFT_WRIST].y * 2);

		// Right Wrist Movement
		this.rightWrist.set(1.0 - rig.poseLandmarks[POSE.RIGHT_WRIST].x * 2, 1.0 - rig.poseLandmarks[POSE.RIGHT_WRIST].y * 2);
	}

	update() {
		// Left Wrist Acceleration
		this.leftWristDiff.subVectors(this.leftWrist, this.leftWristOld);
		this.leftWristOld.copy(this.leftWrist);

		if (this.leftWristOld.x === 0 && this.leftWristOld.y === 0) this.leftWristDiff.set(0, 0);

		// Right Wrist Acceleration
		this.rightWristDiff.subVectors(this.rightWrist, this.rightWristOld);
		this.rightWristOld.copy(this.rightWrist);

		if (this.rightWristOld.x === 0 && this.rightWristOld.y === 0) this.rightWristDiff.set(0, 0);
	}
}

export default new RigCoords();