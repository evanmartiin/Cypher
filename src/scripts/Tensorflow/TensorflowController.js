import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { TensorflowCamera } from './TensorflowCamera.js';
import { TensorflowCanvas } from './TensorflowCanvas.js';
import { TensorflowPose } from './TensorflowPose.js';

class TensorflowController {
	constructor() {
		state.register(this);

		/// #if DEBUG
		if (app.tools.urlParams.has('skip-camera')) return;
		/// #endif

		this.camera = new TensorflowCamera();
		this.canvas = new TensorflowCanvas();
		this.pose = new TensorflowPose();
	}
}

export { TensorflowController };
