import { gsap } from 'gsap';
import { PerspectiveCamera, Vector3 } from 'three';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

const BASE_FOV = 37;

class MainCamera extends PerspectiveCamera {
	constructor() {
		super(BASE_FOV, app.tools.viewport.ratio, 0.3, 30);
		state.register(this);

		this.target = new Vector3(0, 1, 0);
		this.position.z = 5;
		this.position.y = 1;
		this.lookAt(this.target);
	}

	onAttach() {
		app.debug?.mapping.add(this, 'Camera');
	}

	onResize({ ratio }) {
		this.aspect = ratio;
		this.fov = BASE_FOV / Math.min(1, ratio * 1.5);
		this.updateProjectionMatrix();
	}

	stepBackward() {
		gsap.to(this.position, {
			duration: 1,
			z: 10,
			x: 3,
			ease: 'power2.out',
		});
	}

	stepFrontward() {
		gsap.to(this.position, {
			duration: 1,
			z: 5,
			x: 0,
			ease: 'power2.out',
		});
	}

	// onTick({ dt }) {
	// 	if (this.orbitControls) return;
	// }
}

export { MainCamera };
