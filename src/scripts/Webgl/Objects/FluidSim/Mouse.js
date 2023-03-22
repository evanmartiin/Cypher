import { Vector2 } from 'three';
import { POSE } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

class Mouse {
	constructor() {
		state.register(this);
		this.mouseMoved = false;
		this.rightWrist = new Vector2();
		this.rightWristOld = new Vector2();
		this.rightWristDiff = new Vector2();
		this.leftWrist = new Vector2();
		this.leftWristOld = new Vector2();
		this.leftWristDiff = new Vector2();
		this.timer = null;
		this.count = 0;
	}

	init() {
		document.body.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
	}

	onPlayerMoved(rig) {
		// if (this.timer) clearTimeout(this.timer);

		// Left Wrist Movement
		this.leftWrist.set(1.0 - rig.poseLandmarks[POSE.LEFT_WRIST].x * 2, 1.0 - rig.poseLandmarks[POSE.LEFT_WRIST].y * 2);

		// Right Wrist Movement
		this.rightWrist.set(1.0 - rig.poseLandmarks[POSE.RIGHT_WRIST].x * 2, 1.0 - rig.poseLandmarks[POSE.RIGHT_WRIST].y * 2);
		// this.mouseMoved = true;
		// this.timer = setTimeout(() => {
		// 	this.mouseMoved = false;
		// }, 100);
	}

	setCoords(x, y) {
		// if (this.timer) clearTimeout(this.timer);
		// this.rightWrist.set((x / app.tools.viewport.width) * 2 - 1, -(y / app.tools.viewport.height) * 2 + 1);
		// this.mouseMoved = true;
		// this.timer = setTimeout(() => {
		// 	this.mouseMoved = false;
		// }, 100);
		// console.log(this.coords.y);
	}
	onDocumentMouseMove(event) {
		this.setCoords(event.clientX, event.clientY);
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

export default new Mouse();
