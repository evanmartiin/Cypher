import { MUSIC_IDS, UI_IDS, UI_POOL_IDS } from '@Core/audio/AudioManager.js';
import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class PlayerDetectedStep extends Step {
	constructor() {
		super();
		this.text = 'Nouveau joueur détecté';
	}

	start() {
		this.isRunning = true;
		app.dom.ui.logo.hide();

		// app.dom.ui.panel.show();
		app.timeline.titleDOM.innerHTML = this.text;
		app.dom.cursor.enable();
		app.dom.cursor.enterHover.on(() => {
			app.timeline.timer.setGauge(2000, () => {
				console.log('enter')
				app.core.audio.playUI(UI_IDS.CURSOR);
				app.timeline.next();
			});
		});
		app.dom.cursor.exitHover.on(() => {
			app.timeline.timer.resetTimer();
		});
	}

	stop() {
		this.isRunning = false;
		app.dom.cursor.disable();
	}
}
