import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class TimerStep extends Step {
	constructor() {
		super();
		this.text = 'Prépare toi !';
		this.duration = 5000;
	}

	start() {
		this.isRunning = true;

		//UI 
		app.dom.ui.music.show();
		app.dom.ui.title.show();

		app.timeline.titleDOM.innerHTML = this.text;
		app.timeline.timer.setGauge(this.duration, () => {
			app.timeline.next()
		});
		app.webgl.camera.enter();
		app.webgl.scene.avatar.enableControl();
		app.webgl.postProcessing.blurPass.disable();
		app.webgl.scene._counterAnimation._timeline.restart();
		
	}

	stop() {
		app.tensorflow.hide();

		this.isRunning = false;
		app.timeline.timer.resetTimer();
	}
}
