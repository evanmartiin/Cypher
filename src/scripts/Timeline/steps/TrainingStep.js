import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class TrainingStep extends Step {
	constructor() {
		super();
		this.text = "Teste l'environnement !";
		this.duration = 10000;
	}

	start() {
		app.timeline.titleDOM.innerHTML = this.text;
		app.timeline.timer.setGauge(this.duration);
	}

	stop() {}
}
