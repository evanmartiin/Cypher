import { MUSIC_IDS } from '@Core/audio/AudioManager.js';
import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class WaitingStep extends Step {
	constructor() {
		super();
		state.register(this);
		this.text = 'Viens jouer !';
	}

	start() {
		this.isRunning = true;

		app.timeline.titleDOM.innerHTML = this.text;
		app.tensorflow.show();
		app.tensorflow.pose.playerAlreadyHere().then((v) => v && app.timeline.next());
		app.core.audio.playMusic(MUSIC_IDS.MUSIC_1);
	}

	stop() {
		this.isRunning = false;
	}

	onPlayerEntered() {
		if (!this.isRunning) return;
		app.timeline.next();
	}
}
