import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class NextPlayerStep extends Step {
	constructor() {
		super();
		this.text = 'Au suivant';
		this.duration = 5000;
	}

	start() {
		this.isRunning = true;
		app.timeline.titleDOM.innerHTML = this.text;
		app.timeline.timer.setGauge(this.duration, () => app.timeline.next());
		app.webgl.scene.avatar.disableControl();
		app.webgl.camera.exit();
		app.webgl.postProcessing.blurPass.enable();
	}

	stop() {
		this.isRunning = false;
		app.timeline.timer.resetTimer();
	}
}
