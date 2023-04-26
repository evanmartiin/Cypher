import * as posedetection from '@tensorflow-models/pose-detection';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { VIDEO_SIZE } from './TensorflowCamera.js';

class TensorflowCanvas {
	constructor() {
		state.register(this);

		this.canvasDOM = document.createElement('canvas');
		this.canvasDOM.width = VIDEO_SIZE.width;
		this.canvasDOM.height = VIDEO_SIZE.height;
		this.canvasDOM.id = 'tf-canvas';
		this.ctx = this.canvasDOM.getContext('2d');
	}

	onAttach() {
		app.$root.appendChild(this.canvasDOM);
	}

	clearCtx() {
		this.ctx.clearRect(0, 0, VIDEO_SIZE.width, VIDEO_SIZE.height);
	}

	drawResults(results) {
		this.clearCtx();
		this.drawKeypoints(results.keypoints);
		this.drawSkeleton(results.keypoints);
	}

	drawKeypoints(keypoints) {
		const keypointInd = posedetection.util.getKeypointIndexBySide(posedetection.SupportedModels.MoveNet);
		this.ctx.fillStyle = 'Red';
		this.ctx.strokeStyle = 'White';
		this.ctx.lineWidth = 2;

		for (const i of keypointInd.middle) {
			this.drawKeypoint(keypoints[i]);
		}

		this.ctx.fillStyle = 'Green';
		for (const i of keypointInd.left) {
			this.drawKeypoint(keypoints[i]);
		}

		this.ctx.fillStyle = 'Orange';
		for (const i of keypointInd.right) {
			this.drawKeypoint(keypoints[i]);
		}
	}

	drawKeypoint(keypoint) {
		const score = keypoint.score !== null ? keypoint.score : 1;
		const scoreThreshold = 0.3;

		if (score >= scoreThreshold) {
			const circle = new Path2D();
			circle.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);
			this.ctx.fill(circle);
			this.ctx.stroke(circle);
		}
	}

	drawSkeleton(keypoints) {
		this.ctx.fillStyle = 'White';
		this.ctx.strokeStyle = 'White';
		this.ctx.lineWidth = 2;

		posedetection.util.getAdjacentPairs(posedetection.SupportedModels.BlazePose).forEach(([i, j]) => {
			const kp1 = keypoints[i];
			const kp2 = keypoints[j];

			const score1 = kp1.score !== null ? kp1.score : 1;
			const score2 = kp2.score !== null ? kp2.score : 1;
			const scoreThreshold = 0.3;

			if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
				this.ctx.beginPath();
				this.ctx.moveTo(kp1.x, kp1.y);
				this.ctx.lineTo(kp2.x, kp2.y);
				this.ctx.stroke();
			}
		});
	}
}

export { TensorflowCanvas };
