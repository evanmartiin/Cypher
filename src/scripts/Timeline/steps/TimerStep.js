import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class TimerStep extends Step {
	constructor() {
		super();
		this.text = '';
		this.duration = 4100;
	}

	start() {
		this.isRunning = true;

		//UI
		app.dom.ui.title.node.innerHTML = this.text;

		app.timeline.timer.setGauge(this.duration, () => app.timeline.next());
		app.tensorflow.hide();
		app.webgl.scene.counterAnimation._timeline.restart();
		// .then(() => {
		// 	if (!this.isRunning) return;
		// 	app.timeline.next();
		// });
	}

	stop() {
		this.isRunning = false;
		app.timeline.timer.resetTimer();
		app.webgl.scene.counterAnimation._timeline.pause(0);
	}

	save() {
		return {};
	}

	restore() {
		this.start();
	}
}
