import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class PlayerValidatedStep extends Step {
	constructor() {
		super();
		this.text = 'En attente de validation';
	}

	start() {
		this.isRunning = true;
		app.timeline.titleDOM.innerHTML = this.text;
	}

	stop() {
		this.isRunning = false;
	}
}