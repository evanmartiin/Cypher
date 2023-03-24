import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class PlayerDetectedStep extends Step {
	constructor() {
		super();
		this.text = 'Nouveau joueur détecté';
		// TODO: change duration
		this.duration = 500000000000000;
	}

	start() {
		this.isRunning = true;
		app.timeline.titleDOM.innerHTML = this.text;
		app.timeline.timer.setGauge(this.duration, () => app.timeline.next());
		app.webgl.scene.avatar.enableControl();
	}

	stop() {
		this.isRunning = false;
		app.timeline.timer.resetTimer();
	}
}
