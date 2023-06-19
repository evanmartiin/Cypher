import Signal from '@utils/Signal.js';
import { state } from './State.js';

class PlayerEnergy {
	constructor() {
		state.register(this);

		this.current = 0;
		this.max = 10000;

		this.reachedZeroEnergy = new Signal();
		this.reachedMaxEnergy = new Signal();
	}

	start() {
		this.reset();
		this.active = true;
	}

	stop() {
		this.active = false;
	}

	reset() {
		this.current = 0;
	}

	add(count) {
		if (!this.active) return;

		this.current += count;

		if (this.current >= this.max) {
			this.current = this.max;
			this.reachedMaxEnergy.emit();
			this.reset();
		}
	}

	remove(count) {
		if (!this.active) return;

		this.current -= count;

		if (this.current <= 0) {
			this.current = 0;
			this.reachedZeroEnergy.emit();
		}
	}
}

export { PlayerEnergy };
