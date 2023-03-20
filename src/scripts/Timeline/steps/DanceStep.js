import { EVENTS, SERVER_EVENTS } from '@utils/constants.js';
import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class DanceStep extends Step {
	constructor() {
		super();
		this.text = 'Danse !';
		this.duration = 15000;
	}

	start() {
		app.timeline.titleDOM.innerHTML = this.text;
		app.timeline.timer.setGauge(this.duration);
		app.tools.recorder.start();
	}

	stop() {
		app.tools.recorder.stop();
		state.on(EVENTS.VIDEO_READY, this.handleVideoReady);
		app.webgl.scene.skeleton.createGeometry();
	}

	handleVideoReady(args) {
		app.server.emit(SERVER_EVENTS.CREATE_VIDEO, args);

		state.off(EVENTS.VIDEO_READY, this.handleVideoReady);
	}
}
