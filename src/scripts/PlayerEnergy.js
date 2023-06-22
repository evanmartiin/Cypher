import { EVENTS } from '@utils/constants.js';
import { state } from './State.js';

class PlayerEnergy {
	constructor() {
		state.register(this);

		this.current = 0;
		this.normalizedCurrent = 0;
		this.max = 500;
	}

	start() {
		this.reset();
		this.active = true;
		state.emit(EVENTS.ENERGY_STARTED);
	}

	stop() {
		this.active = false;
		state.emit(EVENTS.ENERGY_STOPPED);
	}

	reset() {
		this.current = 0;
	}

	add(count) {
		if (!this.active) return;

		this.current += count;

		if (this.current >= this.max) {
			this.current = this.max;
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
		this.remove(dt * 500);
	}
}

export { PlayerEnergy };
