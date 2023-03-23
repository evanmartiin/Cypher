import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
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

	drawResults(results) {
		this.ctx.save();
		this.ctx.clearRect(0, 0, this.canvasDOM.width, this.canvasDOM.height);

		this.drawLandmarks(results);
		this.drawConnectors(results);
	}

	drawConnectors(results) {
		drawConnectors(this.ctx, results.poseLandmarks, POSE_CONNECTIONS, {
			color: '#00cff7',
			lineWidth: 4,
		});
	}

	drawLandmarks(results) {
		drawLandmarks(this.ctx, results.poseLandmarks, {
			color: '#ff0364',
			lineWidth: 2,
		});
	}
}

export { TensorflowCanvas };
