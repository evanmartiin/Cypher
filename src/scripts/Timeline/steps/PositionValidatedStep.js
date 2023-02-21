import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class PositionValidatedStep extends Step {
	constructor() {
		super();
		this.text = 'Position validée';
		this.duration = 2000;
	}

	start() {
		app.timeline.titleDOM.innerHTML = this.text;
		this.timeout = setTimeout(() => app.timeline.next(), this.duration);
		app.timeline.timer.setGauge(this.duration);
		app.webgl.scene.setColor(0x0000ff);
	}

	stop() {
		clearTimeout(this.timeout);
		app.timeline.timer.stopGauge();
	}
}
