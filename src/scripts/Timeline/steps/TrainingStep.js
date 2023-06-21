import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class TrainingStep extends Step {
	constructor() {
		super();
		state.register(this);
		this.text = 'Prépare-toi !';
		this.duration = 10000;
	}

	start() {
		this.isRunning = true;

		//UI
		app.timeline.titleDOM.innerHTML = this.text;
		app.dom.ui.music.show();
		app.dom.ui.title.show();

		app.timeline.timer.setGauge(this.duration, () => app.timeline.next());
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
