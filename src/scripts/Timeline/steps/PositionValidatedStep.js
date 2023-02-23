import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class PositionValidatedStep extends Step {
	constructor() {
		super();
		this.text = 'Position validée';
		this.duration = 2000;
	}

	start() {
		app.timeline.titleDOM.innerHTML = this.text;
		app.timeline.timer.setGauge(this.duration);
	}

	stop() {}
}
