import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class Timer {
	constructor() {
		state.register(this);
	}

	onTick({ et, dt }) {
		this.elapsed = et;
		this.current = dt;

		if (this.gauge) this.updateGauge();
	}

	setGauge(duration, callback, showUI = false) {
		this.gauge = {
			start: this.elapsed,
			duration,
			callback,
			showUI,
		};
		if (showUI) app.dom.ui.timer.show();
	}

	updateGauge() {
		if (this.elapsed - this.gauge.start >= this.gauge.duration) {
			this.stopGauge();
			return;
		}

		if (!this.gauge.showUI) return;

		let seconds = Math.floor((this.gauge.duration - this.elapsed + this.gauge.start) / 1000);
		const minutes = Math.floor(seconds / 60);
		seconds = seconds % 60;

		const time = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
		app.dom.ui.timer.node.innerHTML = time;
	}

	stopGauge() {
		this.gauge.callback();
	}

	resetTimer() {
		app.dom.ui.timer.hide();
		this.gauge = null;
	}
}
