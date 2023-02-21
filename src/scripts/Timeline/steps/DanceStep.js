import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class DanceStep extends Step {
	constructor() {
		super();
		this.text = 'Danse !';
		this.duration = 5000;
	}

	start() {
		app.timeline.titleDOM.innerHTML = this.text;
		this.timeout = setTimeout(() => app.timeline.next(), this.duration);
		app.timeline.timer.setGauge(this.duration);
		app.webgl.scene.setColor(0xff0000);
	}

	stop() {
		clearTimeout(this.timeout);
		app.timeline.timer.stopGauge();
	}
}
