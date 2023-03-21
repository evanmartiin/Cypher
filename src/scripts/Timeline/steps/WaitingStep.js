import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class WaitingStep extends Step {
	constructor() {
		super();
		this.text = 'Viens jouer !';
	}

	start() {
		this.isRunning = true;
		app.timeline.titleDOM.innerHTML = this.text;
	}

	stop() {
		this.isRunning = false;
	}
}
