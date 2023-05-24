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

		this.leftFoot = new Vector3();
		this.leftFootOld = new Vector3();
		this.leftFootDiff = new Vector3();
		this.leftFootSpeed = {
			value: 0,
		};

		this.rightFoot = new Vector3();
		this.rightFootOld = new Vector3();
		this.rightFootDiff = new Vector3();
		this.rightFootSpeed = {
			value: 0,
		};
	}

	onPlayerMovedEnough(points) {
		// Left Wrist Movement
		this.leftWrist.set(1.0 - points[POSE.LEFT_WRIST].x * 2, 1.0 - points[POSE.LEFT_WRIST].y * 2, 1.0 - points[POSE.LEFT_WRIST].z * 2);

		// Right Wrist Movement
		this.rightWrist.set(1.0 - points[POSE.RIGHT_WRIST].x * 2, 1.0 - points[POSE.RIGHT_WRIST].y * 2, 1.0 - points[POSE.RIGHT_WRIST].z * 2);

		// Left Foot Movement
		this.leftFoot.set(1.0 - points[POSE.LEFT_FOOT_INDEX].x * 2, 1.0 - points[POSE.LEFT_FOOT_INDEX].y * 2, 1.0 - points[POSE.LEFT_FOOT_INDEX].z * 2);

		// Right Foot Movement
		this.rightFoot.set(1.0 - points[POSE.RIGHT_FOOT_INDEX].x * 2, 1.0 - points[POSE.RIGHT_FOOT_INDEX].y * 2, 1.0 - points[POSE.RIGHT_FOOT_INDEX].z * 2);
	}

	update() {
		// Left Wrist Acceleration
		this.leftWristDiff.subVectors(this.leftWrist, this.leftWristOld);
		this.leftWristOld.copy(this.leftWrist);

		if (this.leftWristOld.x === 0 && this.leftWristOld.y === 0) this.leftWristDiff.set(0, 0, 0);
		this.leftWristSpeed.value += (this.leftWristDiff.length() * 45 - this.leftWristSpeed.value) * 0.05;

		// Right Wrist Acceleration
		this.rightWristDiff.subVectors(this.rightWrist, this.rightWristOld);
		this.rightWristOld.copy(this.rightWrist);

		if (this.rightWristOld.x === 0 && this.rightWristOld.y === 0) this.rightWristDiff.set(0, 0, 0);
		this.rightWristSpeed.value += (this.rightWristDiff.length() * 45 - this.rightWristSpeed.value) * 0.05;

		// Left Foot Acceleration
		this.leftFootDiff.subVectors(this.leftFoot, this.leftFootOld);
		this.leftFootOld.copy(this.leftFoot);

		if (this.leftFootOld.x === 0 && this.leftFootOld.y === 0) this.leftFootDiff.set(0, 0, 0);
		this.leftFootSpeed.value += (this.leftFootDiff.length() * 45 - this.leftFootSpeed.value) * 0.05;

		// right Foot Acceleration
		this.rightFootDiff.subVectors(this.rightFoot, this.rightFootOld);
		this.rightFootOld.copy(this.rightFoot);

		if (this.rightFootOld.x === 0 && this.rightFootOld.y === 0) this.rightFootDiff.set(0, 0, 0);
		this.rightFootSpeed.value += (this.rightFootDiff.length() * 45 - this.rightFootSpeed.value) * 0.05;
	}
}

export default new RigCoords();
