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

		this.text = 'Freestyle';
		this.duration = 60000;

		this.rightWristPos = new Vector2();
	}

	start() {
		this.isRunning = true;

		//UI
		app.dom.ui.title.node.innerHTML = this.text;
		app.dom.ui.rec.show();

		//TODO: Faire spawn des mots random avec des encouragements

		app.timeline.timer.setGauge(this.duration, () => app.timeline.next(), true);
		app.tools.recorder.start();
		app.game.start();
	}

	stop() {
		app.dom.ui.rec.hide();
		app.dom.ui.energy.hide();

		this.isRunning = false;
		app.tools.recorder.stop();
		app.timeline.timer.resetTimer();
		app.game.stop();

		app.webgl.scene.avatar.disableControl();
		app.webgl.scene.carpet.hide();
		app.webgl.scene._particles.hide();
		app.webgl.camera.exit();
		app.webgl.postProcessing.blurPass.enable();

		//TODO: vérifier que cet event n'est plus écouté à un moment donné
		state.on(EVENTS.VIDEO_READY, this.handleVideoReady);
	}

	handleVideoReady(args) {
		if (app.timeline.standby !== false) return;
		app.server.emit(SERVER_EVENTS.CREATE_VIDEO, args);

		state.off(EVENTS.VIDEO_READY, this.handleVideoReady);
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
		app.dom.ui.energy.show();
	}

	onEnergyStopped() {
		if (!this.isRunning) return;
		app.dom.ui.energy.hide();
	}

	onRender() {
		if (!this.isRunning) return;
		if (app.energy.active) {
			app.dom.ui.energy.node.style.background = `linear-gradient(90deg, rgba(255,255,255,1) ${app.energy.normalizedCurrent * 100}%, rgba(255,255,255,0) ${app.energy.normalizedCurrent * 100}%)`;
		}
	}
}
