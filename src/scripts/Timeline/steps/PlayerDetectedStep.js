import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class PlayerDetectedStep extends Step {
	constructor() {
		super();
		this.text = 'Détection';
	}

	start() {
		this.isRunning = true;

		// app.dom.ui.panel.show();
		app.dom.ui.title.node.innerHTML = this.text;
		app.dom.cursor.enable();
		app.dom.cursor.enterHover.on(() => {
			app.timeline.timer.setGauge(2000, () => app.timeline.next());
		});
		app.dom.cursor.exitHover.on(() => {
			app.timeline.timer.resetTimer();
		});

		app.dom.ui.title.show();
	}

	stop() {
		this.isRunning = false;
		app.dom.cursor.disable();
	}
}
