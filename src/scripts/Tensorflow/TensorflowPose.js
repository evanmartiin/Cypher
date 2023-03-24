import { Pose } from '@mediapipe/pose';
import * as Kalidokit from 'kalidokit';
import { Vector3 } from 'three';
import { EVENTS } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

const DISTANCE_THRESHOLD = 0.05;

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

		// TODO: filter moves to not count really small moves and big moves (teleportations)
		if (!this.isMoveEnough(results.poseLandmarks)) return;
		state.emit(EVENTS.PLAYER_MOVED_ENOUGH, results);
	};

	isMoveEnough(poses) {
		if (!this.lastPoses) {
			this.lastPoses = poses;
			return false;
		}
		if (!poses) return false;

		const isMoveEnough = poses.some((pose, index) => {
			const lastPose = this.lastPoses[index];
			if (!lastPose) return false;
			const distance = new Vector3(pose.x, pose.y, pose.z).distanceTo(new Vector3(lastPose.x, lastPose.y, lastPose.z));
			return distance > DISTANCE_THRESHOLD;
		});

		this.lastPoses = poses;
		return isMoveEnough;
	}

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
