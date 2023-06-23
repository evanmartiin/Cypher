import { MUSIC_IDS, UI_POOL_IDS } from '@Core/audio/AudioManager.js';
import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class TrainingStep extends Step {
	constructor() {
		super();
		state.register(this);
		this.text = 'Prépare-toi !';
		this.duration = 3000;
	}

	start() {
		this.isRunning = true;

		//UI
		app.dom.ui.title.node.innerHTML = this.text;

		//Sound
		app.core.audio.playMusic(MUSIC_IDS.MUSIC_FUNK_1_FILTERED);
		const { randomSoundDuration, random } = app.core.audio.getUiRandom(UI_POOL_IDS.READY);

		setTimeout(() => {
			app.core.audio.playUiRandom(UI_POOL_IDS.READY, random);
		}, this.duration - randomSoundDuration);

		app.timeline.timer.setGauge(this.duration, () => app.timeline.next(), true);

		app.webgl.camera.enter();
		app.webgl.scene.avatar.enableControl();
		app.webgl.scene._particles.show();
		app.webgl.postProcessing.blurPass.disable();
		app.webgl.scene.carpet.show();
	}

	stop() {
		this.isRunning = false;
		app.timeline.timer.resetTimer();
	}
}
