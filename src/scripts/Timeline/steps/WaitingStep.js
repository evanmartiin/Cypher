import { MUSIC_IDS } from '@Core/audio/AudioManager.js';
import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class WaitingStep extends Step {
	constructor() {
		super();
		state.register(this);
		this.text = '';
	}

	start() {
		this.isRunning = true;

		app.dom.ui.title.node.innerHTML = this.text;
		app.tensorflow.show();
		app.tensorflow.pose.enable();
		app.dom.ui.logo.show();
		app.core.audio.playMusic(MUSIC_IDS.MUSIC_ATTENTE);

		if (app.tensorflow.pose.playerDetected) app.timeline.next();
	}

	stop() {
		this.isRunning = false;
		app.dom.ui.logo.hide();
	}

	onPlayerEntered() {
		if (!this.isRunning) return;
		app.timeline.next();
	}
}
