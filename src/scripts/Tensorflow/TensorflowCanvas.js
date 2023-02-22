import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { FACEMESH_TESSELATION, HAND_CONNECTIONS, POSE_CONNECTIONS } from '@mediapipe/holistic';
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
		// drawConnectors(this.ctx, results.faceLandmarks, FACEMESH_TESSELATION, {
		// 	color: '#C0C0C070',
		// 	lineWidth: 1,
		// });
		// drawConnectors(this.ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
		// 	color: '#eb1064',
		// 	lineWidth: 5,
		// });
		// drawConnectors(this.ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
		// 	color: '#22c3e3',
		// 	lineWidth: 5,
		// });
	}

	drawLandmarks(results) {
		drawLandmarks(this.ctx, results.poseLandmarks, {
			color: '#ff0364',
			lineWidth: 2,
		});
		// if (results.faceLandmarks && results.faceLandmarks.length === 478) {
		// 	// Draw pupils
		// 	drawLandmarks(this.ctx, [results.faceLandmarks[468], results.faceLandmarks[468 + 5]], {
		// 		color: '#ffe603',
		// 		lineWidth: 2,
		// 	});
		// }
		// drawLandmarks(this.ctx, results.leftHandLandmarks, {
		// 	color: '#00cff7',
		// 	lineWidth: 2,
		// });
		// drawLandmarks(this.ctx, results.rightHandLandmarks, {
		// 	color: '#ff0364',
		// 	lineWidth: 2,
		// });
	}
}

export { TensorflowCanvas };
