import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

const SELECTED_POINTS = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
const TRUST_TRESHOLD = 0.2;

export default class StartPositionStep extends Step {
	constructor() {
		super();
		state.register(this);
		this.text = 'En position !';
	}

	start() {
		app.timeline.titleDOM.innerHTML = this.text;
		app.webgl.scene.skeleton.show();
		this.checkingPose = true;
	}

	stop() {
		app.webgl.scene.skeleton.hide();
		this.checkingPose = false;
	}

	onPlayerMoved(poses) {
		if (!this.checkingPose) return;

		const poseToCheck = poses.poseLandmarks;
		const poseToHave = app.webgl.scene.skeleton.poses;

		if (!poseToHave) {
			app.timeline.next();
			return;
		}
		if (!poseToCheck) {
			app.timeline.reset();
			return;
		}

		const isPoseCorrect = SELECTED_POINTS.every((point) => {
			const x = Math.abs(poseToCheck[point].x - poseToHave[point].x) < TRUST_TRESHOLD;
			const y = Math.abs(poseToCheck[point].y - poseToHave[point].y) < TRUST_TRESHOLD;
			const z = Math.abs(poseToCheck[point].z - poseToHave[point].z) < TRUST_TRESHOLD;
			const isPointCorrect = x && y && z;
			return isPointCorrect;
		});

		if (isPoseCorrect) {
			app.timeline.next();
		}
	}
}
