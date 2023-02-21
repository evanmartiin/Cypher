import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class TimerStep extends Step {
	constructor() {
		super();
		this.text = 'Prêt ?';
		this.duration = 3000;
	}

	start() {
		app.timeline.titleDOM.innerHTML = this.text;
		this.timeout = setTimeout(() => app.timeline.next(), this.duration);
		app.timeline.timer.setGauge(this.duration);
	}

	stop() {
		clearTimeout(this.timeout);
		app.timeline.timer.stopGauge();
	}
}
