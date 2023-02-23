import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class Timer {
	constructor() {
		state.register(this);
		this.DOM = document.getElementById('timer');
	}

	onTick({ et, dt }) {
		this.elapsed = et;
		this.current = dt;

		if (this.gauge) this.updateGauge();
	}

	setGauge(duration) {
		this.gauge = {
			start: this.elapsed,
			percent: 0,
			duration,
		};
		this.DOM.classList.remove('hidden');
	}

	updateGauge() {
		this.gauge.percent = (this.elapsed - this.gauge.start) / this.gauge.duration;

		if (this.gauge.percent >= 1) {
			this.stopGauge();
			return;
		}

		this.DOM.style.background = `linear-gradient(90deg, rgba(255,255,255,1) ${this.gauge.percent * 100}%, rgba(255,255,255,0) ${this.gauge.percent * 100}%)`;
	}

	stopGauge() {
		this.resetTimer();
		app.timeline.next();
	}

	resetTimer() {
		this.gauge = null;
		this.DOM.classList.add('hidden');
	}
}
