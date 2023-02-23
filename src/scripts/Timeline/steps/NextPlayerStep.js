import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class NextPlayerStep extends Step {
	constructor() {
		super();
		this.text = 'Au suivant';
		this.duration = 2000;
	}

	start() {
		app.timeline.titleDOM.innerHTML = this.text;
		this.timeout = setTimeout(() => app.timeline.next(), this.duration);
		app.timeline.timer.setGauge(this.duration);
		app.webgl.scene.avatar.disableControl();
	}

	stop() {
		clearTimeout(this.timeout);
		app.timeline.timer.stopGauge();
	}
}
