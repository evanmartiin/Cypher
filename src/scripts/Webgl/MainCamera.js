import { gsap } from 'gsap';
import { PerspectiveCamera, Vector3 } from 'three';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

const BASE_FOV = 37;

class MainCamera extends PerspectiveCamera {
	constructor() {
		super(BASE_FOV + 10, app.tools.viewport.ratio, 0.3, 30);
		state.register(this);

		this.baseFov = BASE_FOV + 10;
		this.target = new Vector3(0, 1, 0);
		this.position.z = 7;
		this.position.y = 1.5;
		this.lookAt(this.target);
	}

	onAttach() {
		app.debug?.mapping.add(this, 'Camera');
	}

	onResize({ ratio }) {
		this.aspect = ratio;
		this.fov = this.baseFov / Math.min(1, ratio * 1.5);
		this.updateProjectionMatrix();
	}

	enter() {
		gsap.to(this, {
			fov: BASE_FOV / Math.min(1, this.aspect * 1.5),
			baseFov: BASE_FOV / Math.min(1, this.aspect * 1.5),
			duration: 1,
			onUpdate: () => {
				this.updateProjectionMatrix();
			},
		});
	}

	exit() {
		gsap.to(this, {
			fov: (BASE_FOV + 10) / Math.min(1, this.aspect * 1.5),
			baseFov: (BASE_FOV + 10) / Math.min(1, this.aspect * 1.5),
			duration: 1,
			onUpdate: () => {
				this.updateProjectionMatrix();
			},
		});
	}

	stepBackward() {
		// gsap.to(this.position, {
		// 	duration: 1.75,
		// 	z: 8,
		// 	x: 4,
		// 	ease: 'power1.out',
		// });
	}

	stepFrontward() {
		// gsap.to(this.position, {
		// 	duration: 2,
		// 	z: 5,
		// 	x: 0,
		// 	ease: 'power1.inOut',
		// });
	}

	// onTick({ dt }) {
	// 	if (this.orbitControls) return;
	// }
}

export { MainCamera };
