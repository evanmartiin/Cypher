import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { TensorflowCamera } from './TensorflowCamera.js';
import { TensorflowCanvas } from './TensorflowCanvas.js';
import { TensorflowHolistic } from './TensorflowHolistic.js';

class TensorflowController {
	constructor() {
		state.register(this);
		this.camera = new TensorflowCamera();
		this.canvas = new TensorflowCanvas();
		this.holistic = new TensorflowHolistic();
	}

	onAttach() {
		/// #if DEBUG
		if (app.tools.urlParams.has('skip-camera')) return;
		/// #endif

		this.camera.start();
	}
}

export { TensorflowController };
