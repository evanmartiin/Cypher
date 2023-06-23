import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class TimerStep extends Step {
	constructor() {
		super();
		this.text = '';
		this.duration = 5000;
	}

	start() {
		this.isRunning = true;

		//UI
		app.dom.ui.title.node.innerHTML = this.text;

		app.timeline.timer.setGauge(this.duration, () => app.timeline.next());
		app.tensorflow.hide();
		app.webgl.scene._counterAnimation._timeline.restart();
	}

	stop() {
		this.isRunning = false;
		app.timeline.timer.resetTimer();
		app.webgl.scene._counterAnimation._timeline.pause(0);
	}
}
