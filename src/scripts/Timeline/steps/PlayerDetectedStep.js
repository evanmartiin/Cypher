import { MUSIC_IDS } from '@Core/audio/AudioManager.js';
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
		app.dom.cursor.enable();
		app.dom.cursor.enterHover.on(() => {
			app.timeline.timer.setGauge(2000, () => {
				app.core.audio.playMusic(MUSIC_IDS.MUSIC_2);
				app.timeline.next();
			});
		});
		app.dom.cursor.exitHover.on(() => {
			app.timeline.timer.resetTimer();
		});
		app.core.audio.playMusic(MUSIC_IDS.MUSIC_1);
		app.core.audio.initFrequencies(MUSIC_IDS.MUSIC_1);
	}

	stop() {
		this.isRunning = false;
		app.dom.cursor.disable();
	}
}
