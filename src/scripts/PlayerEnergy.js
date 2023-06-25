import { EVENTS, POSE } from '@utils/constants.js';
import { state } from './State.js';
import { assertIsInCamera } from '@utils/assertions.js';
import { Vector2 } from 'three';
import { app } from './App.js';

const V2 = new Vector2();

class PlayerEnergy {
	constructor() {
		state.register(this);

		this.current = 0;
		this.normalizedCurrent = 0;
		this.max = 500;

		this.tutorial = false;
		this.rightWristPos = new Vector2();
	}

	start() {
		this.reset();
		this.active = true;
		this.reachedMid = false;
		this.firstMove = true;
		state.emit(EVENTS.ENERGY_STARTED);
	}

	stop() {
		this.active = false;
		this.reachedMid = false;
		state.emit(EVENTS.ENERGY_STOPPED);
	}

	reset() {
		this.current = 0;
		this.firstMove = true;
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

		this.remove(dt * 500);

		app.dom.ui.energy.node.style.background = `linear-gradient(90deg, rgba(255,255,255,1) ${this.normalizedCurrent * 100}%, rgba(255,255,255,0) ${this.normalizedCurrent * 100}%)`;
	}

	onPlayerMoved(rig) {
		if (!this.active) return;
		if (!assertIsInCamera(rig.keypoints[POSE.RIGHT_WRIST])) return;

		V2.x = rig.keypoints[POSE.RIGHT_WRIST].x;
		V2.y = rig.keypoints[POSE.RIGHT_WRIST].y;

		if (this.firstMove) {
			this.firstMove = false;
		} else {
			this.add(V2.distanceTo(this.rightWristPos));
		}

		this.rightWristPos.copy(V2);
	}
}

export { PlayerEnergy };
