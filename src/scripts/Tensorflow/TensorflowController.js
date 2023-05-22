import { DEBUG } from '@utils/config.js';
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
		this.pose = new TensorflowPose();
		if (DEBUG) this.canvas = new TensorflowCanvas();
	}
}

export { TensorflowController };
