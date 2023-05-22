import { POSE } from '@utils/constants.js';
import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { VIDEO_SIZE } from '@scripts/Tensorflow/TensorflowCamera.js';

const TRUST_TRESHOLD = 0.15;

export default class StartPositionStep extends Step {
	constructor() {
		super();
		state.register(this);
		this.text = 'En position !';

		this.SKELETON_POINTS = [
			POSE.LEFT_SHOULDER,
			POSE.RIGHT_SHOULDER,
			POSE.LEFT_ELBOW,
			POSE.RIGHT_ELBOW,
			POSE.LEFT_WRIST,
			POSE.RIGHT_WRIST,
			POSE.LEFT_HIP,
			POSE.RIGHT_HIP,
			POSE.LEFT_KNEE,
			POSE.RIGHT_KNEE,
			POSE.LEFT_ANKLE,
			POSE.RIGHT_ANKLE,
		];
	}

	start() {
		this.isRunning = true;
		app.timeline.titleDOM.innerHTML = this.text;
		app.webgl.scene.skeleton.show();
		this.checkingPose = true;
	}

	stop() {
		this.isRunning = false;
		app.webgl.scene.skeleton.hide();
		this.checkingPose = false;
	}

	onPlayerMoved(poses) {
		if (!this.checkingPose) return;

		const poseToCheck = poses.keypoints;
		const poseToHave = app.webgl.scene.skeleton.poses;

		if (!poseToHave) {
			app.timeline.next();
			return;
		}
		if (!poseToCheck) {
			return;
		}

		// TODO: handle pose height differences (caused by player position from cam)
		const isPoseCorrect = this.SKELETON_POINTS.every((point) => {
			const x = Math.abs(1 - poseToCheck[point].x / VIDEO_SIZE.width - poseToHave[point].x) < TRUST_TRESHOLD;
			const y = Math.abs(1 - poseToCheck[point].y / VIDEO_SIZE.height - poseToHave[point].y) < TRUST_TRESHOLD;
			const isPointCorrect = x && y;
			return isPointCorrect;
		});

		if (isPoseCorrect) {
			app.timeline.next();
		}
	}
}
