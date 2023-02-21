export default class Timer {
	elapsed = 0;

	constructor() {
		this.current = Date.now();
		this.DOM = document.getElementById('timer');
		this.tick();
	}

	tick = () => {
		window.requestAnimationFrame(this.tick);

		this.elapsed += Date.now() - this.current;
		this.current = Date.now();

		if (this.gauge) this.updateGauge();
	};

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
		this.gauge = null;
		this.DOM.classList.add('hidden');
	}
}
