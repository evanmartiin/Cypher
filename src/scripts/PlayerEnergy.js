import { Vector2 } from 'three';
import { assertIsInCamera } from '@utils/assertions.js';
import { EVENTS, POSE } from '@utils/constants.js';
import { app } from './App.js';
import { state } from './State.js';
import { VIDEO_SIZE } from './Tensorflow/TensorflowCamera.js';

const V2A = new Vector2();
const V2B = new Vector2();

class PlayerEnergy {
	constructor() {
		state.register(this);

		this.current = 0;
		this.normalizedCurrent = 0;
		this.max = 5000;

		this.tutorial = false;
	}

	start(max) {
		this.reset();
		this.active = true;
		this.reachedMid = false;
		if (max) this.max = max;
		state.emit(EVENTS.ENERGY_STARTED);
	}

	stop() {
		this.active = false;
		this.reachedMid = false;
		state.emit(EVENTS.ENERGY_STOPPED);
	}

	reset() {
		this.current = 0;
	}

	add(count) {
		if (!this.active) return;

		this.current += count;

		if (this.current >= this.max / 2 && !this.reachedMid) {
			this.reachedMid = true;
			state.emit(EVENTS.MID_ENERGY_REACHED);
		}

		if (this.current >= this.max) {
			this.current = this.max;
			if (this.tutorial) return;
			state.emit(EVENTS.MAX_ENERGY_REACHED);
			this.reset();
		}

		this.normalizedCurrent = this.current / this.max;

		state.emit(EVENTS.ENERGY_CHANGED, this.normalizedCurrent);
	}

	remove(count) {
		if (!this.active) return;

		this.current -= count;

		if (this.current <= 0) {
			this.current = 0;
		}

		this.normalizedCurrent = this.current / this.max;

		state.emit(EVENTS.ENERGY_CHANGED, this.normalizedCurrent);
	}

	onRender({ dt }) {
		if (!this.active) return;

		this.remove(dt * 150);

		app.dom.ui.energy.node.style.background = `linear-gradient(90deg, rgba(255,255,255,1) ${this.normalizedCurrent * 100}%, rgba(255,255,255,0) ${this.normalizedCurrent * 100}%)`;
	}

	onPlayerMovedEnough(rig) {
		if (!this.active) return;

		if (this.previousKeypoints) {
			let totalDistance = 0;
			let bonesInCamera = 0;

			Object.values(POSE).forEach((pose) => {
				if (assertIsInCamera(rig.keypoints[pose])) {
					V2A.x = rig.keypoints[POSE.RIGHT_WRIST].x / VIDEO_SIZE.width;
					V2A.y = rig.keypoints[POSE.RIGHT_WRIST].y / VIDEO_SIZE.width;
					V2B.x = this.previousKeypoints[POSE.RIGHT_WRIST].x / VIDEO_SIZE.height;
					V2B.y = this.previousKeypoints[POSE.RIGHT_WRIST].y / VIDEO_SIZE.height;
					totalDistance += V2A.distanceTo(V2B);
					bonesInCamera++;
				}
			});

			if (bonesInCamera === 0) return;

			this.add(Math.min(totalDistance / bonesInCamera, 10) * 100);
		}

		this.previousKeypoints = rig.keypoints;
	}
}

export { PlayerEnergy };
