import { Vector2 } from 'three';
import { assertIsInCamera } from '@utils/assertions.js';
import { EVENTS, POSE, SERVER_EVENTS } from '@utils/constants.js';
import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

const V2 = new Vector2();

export default class DanceStep extends Step {
	constructor() {
		super();
		state.register(this);

		this.text = 'Danse !';
		this.duration = 30000;

		this.rightWristPos = new Vector2();

		this.energyDOM = document.getElementById('energy');
	}

	start() {
		this.isRunning = true;

		//UI
		app.timeline.titleDOM.innerHTML = this.text;
		app.dom.ui.rec.show();
		app.dom.ui.timer.show();

		app.dom.ui.move.node.innerHTML = 'Nom du move';
		app.dom.ui.move.spawn(3000);

		//TODO : Faire spawn des mots random avec des encouragements

		app.timeline.timer.setGauge(this.duration, () => app.timeline.next());
		app.tools.recorder.start();
		app.game.start();
	}

	stop() {

		app.dom.ui.rec.hide();
		app.dom.ui.timer.hide();
		app.dom.ui.title.hide();
		app.dom.ui.music.hide();

		app.energy.stop();
		this.isRunning = false;
		app.tools.recorder.stop();
		app.timeline.timer.resetTimer();
		app.game.stop();
		state.on(EVENTS.VIDEO_READY, this.handleVideoReady);
	}

	handleVideoReady(args) {
		if (app.timeline.standby !== false) return;
		app.server.emit(SERVER_EVENTS.CREATE_VIDEO, args);

		state.off(EVENTS.VIDEO_READY, this.handleVideoReady);
	}

	onPlayerMoved(rig) {
		if (!assertIsInCamera(rig.keypoints[POSE.RIGHT_WRIST])) return;

		V2.x = rig.keypoints[POSE.RIGHT_WRIST].x;
		V2.y = rig.keypoints[POSE.RIGHT_WRIST].y;

		app.energy.add(V2.distanceTo(this.rightWristPos));

		this.rightWristPos.copy(V2);
	}

	onEnergyStarted() {
		this.energyDOM.classList.remove('hidden');
	}

	onEnergyStopped() {
		this.energyDOM.classList.add('hidden');
	}

	onRender() {
		if (app.energy.active) {
			this.energyDOM.style.background = `linear-gradient(90deg, rgba(255,255,255,1) ${app.energy.normalizedCurrent * 100}%, rgba(255,255,255,0) ${app.energy.normalizedCurrent * 100}%)`;
		}
	}
}
