import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class WellDoneStep extends Step {
	constructor() {
		super();
		this.text = 'Bien dansé !';
		this.duration = 5000;
	}

	start() {
		this.isRunning = true;
		app.timeline.titleDOM.innerHTML = this.text;
		app.timeline.timer.setGauge(this.duration, () => app.timeline.next());
		app.server.on('SEND_ID', this.handleId);
	}

	stop() {
		this.isRunning = false;
		app.timeline.timer.resetTimer();
		app.server.off('SEND_ID', this.handleId);
	}

	handleId = (id) => {
		app.timeline.titleDOM.innerHTML = this.text + ' ID vidéo: ' + id;
	};
}
