import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class PlayerDetectedStep extends Step {
	constructor() {
		super();
		this.text = 'Nouveau joueur détecté';
	}

	start() {
		this.isRunning = true;
		app.timeline.titleDOM.innerHTML = this.text;
		app.webgl.scene.avatar.enableControl();
		app.dom.cursor.enable();
	}

	stop() {
		this.isRunning = false;
		app.dom.cursor.disable();
	}
}