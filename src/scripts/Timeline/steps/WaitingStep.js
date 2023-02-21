import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class WaitingStep extends Step {
	constructor() {
		super();
		this.text = 'Viens jouer !';
	}

	start() {
		app.timeline.titleDOM.innerHTML = this.text;
	}

	stop() {}
}
