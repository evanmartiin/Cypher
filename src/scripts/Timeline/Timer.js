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

	setGauge(duration, callback, showUI = false, offset = 0) {
		this.gauge = {
			start: this.elapsed - offset,
			duration,
			callback,
			showUI,
			elapsed: 0,
		};
		if (showUI) app.dom.ui.timer.show();
	}

	updateGauge() {
		this.gauge.elapsed = this.elapsed - this.gauge.start;
		if (this.gauge.elapsed >= this.gauge.duration) {
			this.stopGauge();
			return;
		}

		if (!this.gauge.showUI) return;

		let seconds = Math.floor((this.gauge.duration - this.elapsed + this.gauge.start) / 1000);
		const minutes = Math.floor(seconds / 60);
		seconds = seconds % 60;

		let time = minutes.toString().padStart(2, 'O') + ':' + seconds.toString().padStart(2, 'O');
		time = time.replaceAll('0', 'O');
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
