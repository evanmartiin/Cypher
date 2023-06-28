import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class DanceStep extends Step {
	constructor() {
		super();
		state.register(this);

		this.text = 'Reproduis ce move';
		this.duration = 60000;
	}

	start() {
		this.isRunning = true;

		app.dom.ui.title.node.innerHTML = this.text;

		app.timeline.timer.setGauge(this.duration, () => app.timeline.next(), true);
		app.game.start();
	}

	stop() {
		this.isRunning = false;
	}

	onEnergyStarted() {
		app.dom.ui.energyContainer.show();
	}

	onEnergyStopped() {
		app.dom.ui.energyContainer.hide();
	}

	save() {
		return {
			time: app.timeline.timer.gauge.elapsed,
			...app.game.save(),
		};
	}

	restore(save) {
		this.isRunning = true;

		app.dom.ui.title.node.innerHTML = this.text;
		app.timeline.timer.setGauge(this.duration, () => app.timeline.next(), true, save.time);

		app.game.restore(save);
	}
}
