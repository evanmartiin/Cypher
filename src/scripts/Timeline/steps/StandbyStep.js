import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class StandbyStep extends Step {
	constructor() {
		super();
		state.register(this);
		this.text = 'Joueur perdu...';
		this.duration = 3000;
	}

	start() {
		this.isRunning = true;
		app.timeline.titleDOM.innerHTML = this.text;
		app.timeline.timer.setGauge(this.duration, () => app.timeline.reset());
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
