import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class VideoIDStep extends Step {
	constructor() {
		super();
		this.text = 'Partage </br> ta performance !';
		this.duration = 5000;
	}

	start() {
		app.dom.ui.idContainer.show();
		app.dom.ui.id.node.innerHTML = 'ID : ' + app.tools.recorder.id;

		this.isRunning = true;
		app.dom.ui.title.node.innerHTML = this.text;
		app.timeline.timer.setGauge(this.duration, () => app.timeline.next());
	}

	stop() {
		this.isRunning = false;
		app.timeline.timer.resetTimer();
		app.dom.ui.idContainer.hide();

	}
}
