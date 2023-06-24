import { Vector2 } from 'three';
import { assertIsInCamera } from '@utils/assertions.js';
import { POSE } from '@utils/constants.js';
import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

const V2 = new Vector2();

export default class DanceStep extends Step {
	constructor() {
		super();
		state.register(this);

		this.text = 'Reproduis ce move';
		this.duration = 60000;

		this.rightWristPos = new Vector2();
	}

	start() {
		this.isRunning = true;

		app.dom.ui.title.node.innerHTML = this.text;

		//TODO: Faire spawn des mots random avec des encouragements

		app.timeline.timer.setGauge(this.duration, () => app.timeline.next(), true);
		app.game.start();
	}

	stop() {
		this.isRunning = false;

		app.dom.ui.energyContainer.hide();

		app.timeline.timer.resetTimer();
		app.game.stop();
	}

	onPlayerMoved(rig) {
		if (!this.isRunning) return;
		if (!assertIsInCamera(rig.keypoints[POSE.RIGHT_WRIST])) return;

		V2.x = rig.keypoints[POSE.RIGHT_WRIST].x;
		V2.y = rig.keypoints[POSE.RIGHT_WRIST].y;

		app.energy.add(V2.distanceTo(this.rightWristPos));

		this.rightWristPos.copy(V2);
	}

	onEnergyStarted() {
		if (!this.isRunning) return;
		app.dom.ui.energyContainer.show();
	}

	onEnergyStopped() {
		if (!this.isRunning) return;
		app.dom.ui.energyContainer.hide();
	}

	onRender() {
		if (!this.isRunning) return;
		if (app.energy.active) {
			app.dom.ui.energy.node.style.background = `linear-gradient(90deg, rgba(255,255,255,1) ${app.energy.normalizedCurrent * 100}%, rgba(255,255,255,0) ${app.energy.normalizedCurrent * 100}%)`;
		}
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
