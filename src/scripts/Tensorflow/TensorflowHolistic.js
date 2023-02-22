import { Holistic } from '@mediapipe/holistic';
import { app } from '@scripts/App.js';

class TensorflowHolistic {
	constructor() {
		this.holistic = new Holistic({
			locateFile: (file) => {
				return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1675471629/${file}`;
			},
		});

		this.holistic.setOptions({
			modelComplexity: 1,
			smoothLandmarks: true,
			minDetectionConfidence: 0.7,
			minTrackingConfidence: 0.7,
			refineFaceLandmarks: true,
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
