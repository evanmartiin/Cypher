import { EVENTS, SERVER_EVENTS } from '@utils/constants.js';
import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class DanceStep extends Step {
	constructor() {
		super();
		this.text = 'Danse !';
		this.duration = 10000;
	}

	start() {
		this.isRunning = true;
		app.timeline.titleDOM.innerHTML = this.text;
		app.timeline.timer.setGauge(this.duration, () => app.timeline.next());
		app.tools.recorder.start();
	}

	stop() {
		this.isRunning = false;
		app.tools.recorder.stop();
		app.webgl.scene.skeleton.createGeometry();
		app.timeline.timer.resetTimer();
		state.on(EVENTS.VIDEO_READY, this.handleVideoReady);
	}

	handleVideoReady(args) {
		if (app.timeline.standby !== false) return;
		app.server.emit(SERVER_EVENTS.CREATE_VIDEO, args);

		state.off(EVENTS.VIDEO_READY, this.handleVideoReady);
	}
}
