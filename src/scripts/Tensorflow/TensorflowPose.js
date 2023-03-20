// import { Holistic } from '@mediapipe/holistic';
// import { Hands } from '@mediapipe/hands';
import { Pose } from '@mediapipe/pose';
import * as Kalidokit from 'kalidokit';
import { EVENTS } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

class TensorflowPose {
	constructor() {
		this.pose = new Pose({
			locateFile: (file) => {
				return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`;
			},
		});

		this.pose.setOptions({
			modelComplexity: 1,
			smoothLandmarks: true,
			minDetectionConfidence: 0.7,
			minTrackingConfidence: 0.7,
		});

		this.pose.onResults(this.onResults);
	}

	onResults = (results) => {
		state.emit(EVENTS.PLAYER_MOVED, results);
		app.tensorflow.canvas.drawResults(results);
		this.computeRig(results);
	};

	computeRig(results) {
		const pose3DLandmarks = results.poseWorldLandmarks;
		const pose2DLandmarks = results.poseLandmarks;

		if (pose2DLandmarks && pose3DLandmarks && !this.playerDetected) state.emit(EVENTS.PLAYER_ENTERED);
		if (!pose2DLandmarks && !pose3DLandmarks && this.playerDetected) state.emit(EVENTS.PLAYER_LEFT);
		this.playerDetected = pose2DLandmarks && pose3DLandmarks;

		if (this.playerDetected) {
			const riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks);
			state.emit(EVENTS.RIG_COMPUTED, riggedPose);
		}
	}

	async send({ image }) {
		await this.pose.send({ image });
	}
}

export { TensorflowPose };
