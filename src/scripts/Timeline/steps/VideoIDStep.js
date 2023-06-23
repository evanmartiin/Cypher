import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class VideoIDStep extends Step {
	constructor() {
		super();
		this.text = '';
		this.duration = 5000;
	}

	start() {
		this.isRunning = true;
		app.dom.ui.title.node.innerHTML = this.text;
		app.timeline.timer.setGauge(this.duration, () => app.timeline.next());
	}

	stop() {
		this.isRunning = false;
		app.timeline.timer.resetTimer();
	}
}
