import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class TrainingStep extends Step {
	constructor() {
		super();
		this.text = "Teste l'environnement !";
		this.duration = 10000;
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
