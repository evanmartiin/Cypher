import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { EVENTS, SERVER_EVENTS } from '@utils/constants.js';
import { ServerController } from '@scripts/Server/ServerController.js';


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
		app.tools.recorder.start();
	}

	stop() {
		clearTimeout(this.timeout);
		app.timeline.timer.stopGauge();
		app.tools.recorder.stop();
		state.on(EVENTS.VIDEO_READY, this.handleVideoReady)
	}

	handleVideoReady(args) {
		app.server.emit(SERVER_EVENTS.CREATE_VIDEO, args)

		state.off(EVENTS.VIDEO_READY, this.handleVideoReady)
	}
}
