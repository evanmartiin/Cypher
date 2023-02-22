// import { Holistic } from '@mediapipe/holistic';
// import { Hands } from '@mediapipe/hands';
import { Pose } from '@mediapipe/pose';
import { app } from '@scripts/App.js';

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
			// refineFaceLandmarks: true,
		});

		this.holistic.onResults(this.onResults);
	}

	onResults(results) {
		app.tensorflow.canvas.drawResults(results);
	}

	async send({ image }) {
		await this.holistic.send({ image });
	}
}

export { TensorflowHolistic };
