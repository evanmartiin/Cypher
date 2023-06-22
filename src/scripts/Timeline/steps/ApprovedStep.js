import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { UI_POOL_IDS } from '@Core/audio/AudioManager.js';

export default class ApprovedStep extends Step {
	constructor() {
		super();
		this.duration = 5000;
	}

	start() {
		this.isRunning = true;

		//UI
		app.dom.ui.approuved.show();
		app.dom.ui.title.hide();

		app.tensorflow.pose.disable();

		//SOUND
		app.core.audio.playUiRandom(UI_POOL_IDS.END)

		app.timeline.timer.setGauge(this.duration, () => app.timeline.next());
		app.server.on('SEND_ID', this.handleId);
	}

	stop() {
		this.isRunning = false;

		app.dom.ui.approuved.hide();

		app.timeline.timer.resetTimer();
		app.server.off('SEND_ID', this.handleId);
	}

	handleId = (id) => {
		// app.timeline.titleDOM.innerHTML = this.text + ' ID vidéo: ' + id;
	};
}
