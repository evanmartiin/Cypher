import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class WellDoneStep extends Step {
	constructor() {
		super();
		this.text = 'Bien dansé !';
		this.duration = 5000;
	}

	start() {
		app.timeline.titleDOM.innerHTML = this.text;
		app.timeline.timer.setGauge(this.duration);
	}

	stop() {}
}
