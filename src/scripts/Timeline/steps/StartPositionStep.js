import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class StartPositionStep extends Step {
	constructor() {
		super();
		this.text = 'En position !';
	}

	start() {
		app.timeline.titleDOM.innerHTML = this.text;
	}

	stop() {}
}
