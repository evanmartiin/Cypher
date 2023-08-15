import { UI_IDS } from '@Core/audio/AudioManager.js';
import { INSTALL } from '@utils/config.js';
import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class FreestyleStep extends Step {
	constructor() {
		super();

		this.text = 'Freestyle !';
		this.duration = 15000;
	}

	start() {
		this.isRunning = true;

		app.dom.ui.title.node.innerHTML = this.text;

		app.timeline.timer.resetTimer();
		app.timeline.timer.setGauge(this.duration, () => app.timeline.next(), true);
		app.core.audio.playUI(UI_IDS.FREESTYLE);
		app.webgl.scene.title.show('FREESTYLE');
		app.webgl.scene.leftHandParticles.show();
		app.webgl.scene.carpet.show();
		app.webgl.scene.rightHandParticles.show();

		if (INSTALL) app.tools.recorder.start();
	}

	stop() {
		this.isRunning = false;

		app.timeline.timer.resetTimer();

		app.webgl.scene.avatar.disableControl();
		app.webgl.scene.carpet.hide();
		app.webgl.scene.particles.hide();
		app.webgl.camera.exit();
		app.webgl.postProcessing.blurPass.enable();
		app.webgl.scene.title.stop();
		app.webgl.scene.leftHandParticles.hide();
		app.webgl.scene.rightHandParticles.hide();
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
		app.webgl.scene.leftHandParticles.show();
		app.webgl.scene.rightHandParticles.show();
	}
}
