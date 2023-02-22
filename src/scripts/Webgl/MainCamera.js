import { PerspectiveCamera } from 'three';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

const BASE_FOV = 45;

class MainCamera extends PerspectiveCamera {
	constructor() {
		super(BASE_FOV, app.tools.viewport.ratio, 1, 1000);
		state.register(this);

		this.position.z = 3;
	}

	onAttach() {
		app.debug?.mapping.add(this, 'Camera');
	}

	onResize({ ratio }) {
		this.aspect = ratio;
		this.fov = BASE_FOV / Math.min(1, ratio * 1.5);
		this.updateProjectionMatrix();
	}

	// onTick({ dt }) {
	// 	if (this.orbitControls) return;
	// }
}

export { MainCamera };
