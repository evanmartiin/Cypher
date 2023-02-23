import { EVENTS, SERVER_EVENTS, STORE } from '@utils/constants.js';
import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { store } from '@scripts/Store.js';

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
		store.set(STORE.SKELETON, app.webgl.scene.avatar.mesh.clone());
	}

	handleVideoReady(args) {
		app.server.emit(SERVER_EVENTS.CREATE_VIDEO, args);

		state.off(EVENTS.VIDEO_READY, this.handleVideoReady);
	}
}
