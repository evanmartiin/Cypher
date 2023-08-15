import { MUSIC_IDS, UI_IDS, UI_POOL_IDS } from '@Core/audio/AudioManager.js';
import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class TrainingStep extends Step {
	constructor() {
		super();
		state.register(this);
		this.text = 'Échauffement';
		this.duration = 10000;
	}

	start() {
		this.isRunning = true;
		this.readySoundPlayed = false;

		//UI
		app.dom.ui.title.node.innerHTML = this.text;

		//Sound
		app.core.audio.playUI(UI_IDS.TRANSITION_SCENE);

		setTimeout(() => {
			if (!this.isRunning) return;
			app.core.audio.playUI(UI_IDS.SCRATCH);
		}, 300);

		setTimeout(() => {
			const random = Math.floor(Math.random() * MUSIC_IDS.MUSIC_POOL.length);
			app.core.audio.playMusic(MUSIC_IDS.MUSIC_POOL[random]);
		}, 600);

		const { randomSoundDuration, random } = app.core.audio.getUiRandom(UI_POOL_IDS.READY);
		this.readySound = {
			id: random,
			duration: randomSoundDuration,
		};

		this.readySoundTimeout = setTimeout(() => {
			this.readySoundPlayed = true;
			app.core.audio.playUiRandom(UI_POOL_IDS.READY, random);
		}, this.duration - randomSoundDuration);

		app.timeline.timer.setGauge(this.duration, () => app.timeline.next(), true);

		app.webgl.camera.enter();
		app.webgl.scene.avatar.enableControl();
		app.webgl.scene.particles.show();
		app.webgl.postProcessing.blurPass.disable();
		app.webgl.scene.carpet.show();

		app.tensorflow.show();
	}

	stop() {
		this.isRunning = false;
		app.timeline.timer.resetTimer();
		clearTimeout(this.readySoundTimeout);
	}

	save() {
		return {
			time: app.timeline.timer.gauge.elapsed,
		};
	}

	restore(save) {
		this.isRunning = true;

		app.dom.ui.title.node.innerHTML = this.text;
		app.timeline.timer.setGauge(this.duration, () => app.timeline.next(), true, save.time);

		if (!this.readySoundPlayed) {
			setTimeout(() => {
				if (!this.isRunning) return;
				this.readySoundPlayed = true;
				app.core.audio.playUiRandom(UI_POOL_IDS.READY, this.readySound.id);
			}, this.duration - save.time - this.readySound.duration);
		}
	}
}
