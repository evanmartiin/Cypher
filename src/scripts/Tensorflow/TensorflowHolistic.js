// import { Holistic } from '@mediapipe/holistic';
// import { Hands } from '@mediapipe/hands';
import { Pose } from '@mediapipe/pose';
import * as Kalidokit from 'kalidokit';
import { EVENTS } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

class TensorflowHolistic {
	constructor() {
		this.holistic = new Pose({
			locateFile: (file) => {
				return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`;
			},
		});

		this.holistic.setOptions({
			modelComplexity: 1,
			smoothLandmarks: true,
			minDetectionConfidence: 0.7,
			minTrackingConfidence: 0.7,
		});

		this.holistic.onResults(this.onResults);
	}

	onResults = (results) => {
		app.tensorflow.canvas.drawResults(results);
		this.computeRig(results);
	};

	computeRig(results) {
		const pose3DLandmarks = results.poseWorldLandmarks;
		const pose2DLandmarks = results.poseLandmarks;

		if (pose2DLandmarks && pose3DLandmarks) {
			const riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks);
			state.emit(EVENTS.RIG_COMPUTED, riggedPose);
		}
	}

	async send({ image }) {
		await this.holistic.send({ image });
	}
}

export { TensorflowHolistic };
