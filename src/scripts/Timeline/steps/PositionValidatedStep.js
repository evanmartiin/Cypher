import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class PositionValidatedStep extends Step {
	constructor() {
		super();
		this.text = 'Position validée';
		this.duration = 5000;
	}

	start() {
		this.isRunning = true;
		app.timeline.titleDOM.innerHTML = this.text;
		app.timeline.timer.setGauge(this.duration, () => app.timeline.next());
	}

	stop() {
		this.isRunning = false;
		app.timeline.timer.resetTimer();
	}
}
