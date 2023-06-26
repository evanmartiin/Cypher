import * as posedetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import { Vector3 } from 'three';
import { EVENTS } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { VIDEO_SIZE } from './TensorflowCamera.js';

const DISTANCE_THRESHOLD = 0.035;
const DETECTION_THRESHOLD = 0.4;
const UNDETECTION_THRESHOLD = 0.3;

class TensorflowPose {
	constructor() {
		state.register(this);
		this.asyncInit();
	}

	onFirstClick() {
		this.enable();
	}

	enable() {
		if (!this.detector) return;
		this.ready = true;
	}

	disable() {
		this.ready = false;
		this.playerDetected = undefined;
	}

	async asyncInit() {
		if (app.tools.urlParams.has('tensorflow') && app.tools.urlParams.getString('tensorflow') === 'cpu') {
			this.detector = await posedetection.createDetector(posedetection.SupportedModels.BlazePose, {
				runtime: 'mediapipe',
				modelType: 'lite',
				enableSmoothing: true,
				solutionPath: '/node_modules/@mediapipe/pose',
			});
			this.runtime = 'mediapipe';
		} else {
			this.detector = await posedetection.createDetector(posedetection.SupportedModels.BlazePose, {
				runtime: 'tfjs',
				modelType: 'lite',
				enableSmoothing: true,
			});
			this.runtime = 'tfjs';
		}

		this.tick();
	}

	tick = async () => {
		const results = await this.renderResults();

		if (results) {
			const confidenceScores = results.map((result) => result.keypoints.map((keypoint) => keypoint.score).reduce((a, b) => a + b, 0) / result.keypoints.length);
			const highestConfidenceScore = Math.max(...confidenceScores);
			const mostReliableRig = results[confidenceScores.indexOf(highestConfidenceScore)];

			if (mostReliableRig) {
				app.tensorflow.canvas.drawResults(mostReliableRig);
			}

			if ((mostReliableRig && highestConfidenceScore >= DETECTION_THRESHOLD) || (mostReliableRig && highestConfidenceScore >= UNDETECTION_THRESHOLD && this.playerDetected)) {
				if (!this.playerDetected) {
					this.playerDetected = mostReliableRig;
					state.emit(EVENTS.PLAYER_ENTERED);
				} else {
					this.playerDetected = mostReliableRig;
					state.emit(EVENTS.PLAYER_MOVED, mostReliableRig);

					// TODO: filter moves to not count really small moves and big moves (teleportations)
					if (this.isMoveEnough(mostReliableRig.keypoints3D)) {
						state.emit(EVENTS.PLAYER_MOVED_ENOUGH, posedetection.calculators.keypointsToNormalizedKeypoints(mostReliableRig.keypoints, VIDEO_SIZE));
					}
				}
			} else {
				if (this.playerDetected) {
					this.playerDetected = undefined;
					state.emit(EVENTS.PLAYER_LEFT);
				}
			}
		}

		requestAnimationFrame(this.tick);
	};

	async renderResults() {
		if (this.ready !== true || app.tensorflow.camera.ready !== true) return;

		if (app.tensorflow.camera.videoDOM.readyState < 2) {
			await new Promise((resolve) => {
				app.tensorflow.camera.videoDOM.onloadeddata = (video) => {
					resolve(video);
				};
			});
		}

		let poses = null;

		try {
			poses = await this.detector.estimatePoses(app.tensorflow.camera.videoDOM, { maxPoses: 1, flipHorizontal: false });
		} catch (error) {
			this.detector.dispose();
			this.detector = null;
			alert(error);
		}

		return poses;
	}

	isMoveEnough(poses) {
		if (!poses) return false;
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
}

export { TensorflowPose };
