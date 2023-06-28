import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class StandbyStep extends Step {
	constructor() {
		super();
		state.register(this);
		this.text = 'Joueur perdu...';
		this.duration = 5000;
	}

	start() {
		this.isRunning = true;
		app.dom.ui.title.node.innerHTML = this.text;
		app.timeline.timer.resetTimer();
		app.timeline.timer.setGauge(this.duration, () => app.timeline.reset(), true);
		app.tensorflow.show();
		app.tools.recorder.recording && app.tools.recorder.cancel();

		app.webgl.scene.avatar.disableControl();
		app.webgl.scene.carpet.hide();
		app.webgl.scene._particles.hide();
		app.webgl.camera.exit();
		app.webgl.postProcessing.blurPass.enable();

		app.dom.ui.energyContainer.hide();
		app.game.stop();
	}

	abort() {
		this.isRunning = false;
		app.timeline.timer.resetTimer();
		app.webgl.camera.enter();
		app.webgl.postProcessing.blurPass.disable();

		if (app.timeline.current.constructor.name === 'TutorialStep') return;

		if (app.timeline.current.constructor.name !== 'TrainingStep') app.tensorflow.hide();

		app.webgl.scene.avatar.enableControl();
		app.webgl.scene.carpet.show();
		app.webgl.scene._particles.show();
	}

	stop() {
		this.isRunning = false;
		app.timeline.timer.resetTimer();
	}

	onPlayerEntered() {
		if (!this.isRunning) return;
		app.timeline.resume();
	}
}
