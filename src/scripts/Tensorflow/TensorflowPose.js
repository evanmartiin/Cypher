import * as posedetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import * as Kalidokit from 'kalidokit';
import { Vector3 } from 'three';
import { EVENTS } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { VIDEO_SIZE } from './TensorflowCamera.js';

const DISTANCE_THRESHOLD = 0.035;

class TensorflowPose {
	constructor() {
		this.asyncInit();
	}

	async asyncInit() {
		if (app.tools.urlParams.has('tensorflow') && app.tools.urlParams.getString('tensorflow') === 'cpu') {
			this.detector = await posedetection.createDetector(posedetection.SupportedModels.BlazePose, {
				runtime: 'mediapipe',
				modelType: 'lite',
				enableSmoothing: true,
				solutionPath: '/node_modules/@mediapipe/pose',
			});
		} else {
			this.detector = await posedetection.createDetector(posedetection.SupportedModels.BlazePose, {
				runtime: 'tfjs',
				modelType: 'lite',
				enableSmoothing: true,
			});
		}

		if (this.detector !== null) this.ready = true;
		this.tick();
	}

	tick = async () => {
		const results = await this.renderResults();

		if (results && results[0]) {
			if (results[0] && !this.playerDetected) state.emit(EVENTS.PLAYER_ENTERED);
			if (!results[0] && this.playerDetected) state.emit(EVENTS.PLAYER_LEFT);
			this.playerDetected = results[0];

			if (this.playerDetected) {
				state.emit(EVENTS.PLAYER_MOVED, results[0]);
				app.tensorflow.canvas.drawResults(results[0]);
				this.computeRig(results[0]);

				// TODO: filter moves to not count really small moves and big moves (teleportations)
				if (this.isMoveEnough(results[0].keypoints3D)) {
					state.emit(EVENTS.PLAYER_MOVED_ENOUGH, posedetection.calculators.keypointsToNormalizedKeypoints(results[0].keypoints, VIDEO_SIZE));
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

	computeRig(results) {
		const riggedPose = Kalidokit.Pose.solve(results.keypoints3D, posedetection.calculators.keypointsToNormalizedKeypoints(results.keypoints, VIDEO_SIZE), {
			runtime: 'tfjs',
			imageSize: VIDEO_SIZE,
		});
		state.emit(EVENTS.RIG_COMPUTED, riggedPose);
	}
}

export { TensorflowPose };
