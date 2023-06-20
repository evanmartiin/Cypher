import { Vector2 } from 'three';
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
		this.duration = 60000;

		this.rightWristPos = new Vector2();
	}

	start() {
		this.isRunning = true;
		app.timeline.titleDOM.innerHTML = this.text;
		app.timeline.timer.setGauge(this.duration, () => app.timeline.next());
		app.tools.recorder.start();
		app.webgl.scene.avatarDemo.enable();
		app.energy.start();
		app.energy.reachedMaxEnergy.on(() => {
			app.webgl.scene.changeEnv().then(() => {
				if (!this.isRunning) return;
				app.energy.start();
			});
			app.energy.stop();
		});
	}

	stop() {
		app.energy.stop();
		this.isRunning = false;
		app.tools.recorder.stop();
		app.webgl.scene.avatarDemo.disable();
		app.timeline.timer.resetTimer();
		state.on(EVENTS.VIDEO_READY, this.handleVideoReady);
	}

	handleVideoReady(args) {
		if (app.timeline.standby !== false) return;
		app.server.emit(SERVER_EVENTS.CREATE_VIDEO, args);

		state.off(EVENTS.VIDEO_READY, this.handleVideoReady);
	}

	onPlayerMoved(rig) {
		V2.x = rig.keypoints[POSE.RIGHT_WRIST].x;
		V2.y = rig.keypoints[POSE.RIGHT_WRIST].y;

		app.energy.add(V2.distanceTo(this.rightWristPos));

		this.rightWristPos.copy(V2);
	}
}
