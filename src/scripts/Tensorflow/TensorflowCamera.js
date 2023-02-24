import { Camera } from '@mediapipe/camera_utils';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

const VIDEO_SIZE = {
	width: 640,
	height: 480,
};

class TensorflowCamera {
	constructor() {
		state.register(this);

		this.videoDOM = document.createElement('video');
		this.videoDOM.width = VIDEO_SIZE.width;
		this.videoDOM.height = VIDEO_SIZE.height;
		this.videoDOM.id = 'tf-video';

		this.camera = new Camera(this.videoDOM, {
			onFrame: async () => {
				await app.tensorflow.holistic.send({ image: this.videoDOM });
			},
			width: VIDEO_SIZE.width,
			height: VIDEO_SIZE.height,
		});
	}

	onAttach() {
		/// #if DEBUG
		if (app.tools.urlParams.has('skip-camera')) return;
		/// #endif

		app.$root.appendChild(this.videoDOM);
	}

	start() {
		this.camera.start();
	}

	stop() {
		this.camera.stop();
	}
}

export { TensorflowCamera, VIDEO_SIZE };
