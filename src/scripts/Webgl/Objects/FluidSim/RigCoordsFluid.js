import { Vector2 } from 'three';
import { POSE } from '@utils/constants.js';
import { state } from '@scripts/State.js';

class RigCoordsFluid {
	constructor() {
		state.register(this);
		// this.rightWrist = new Vector2();
		// this.rightWristOld = new Vector2();
		// this.rightWristDiff = new Vector2();
		// this.leftWrist = new Vector2();
		// this.leftWristOld = new Vector2();
		// this.leftWristDiff = new Vector2();
		this.mouseMoved = false;
		this.coords = new Vector2();
		this.coords_old = new Vector2();
		this.diff = new Vector2();
		this.timer = null;
		this.count = 0;
		document.body.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
		document.body.addEventListener('touchstart', this.onDocumentTouchStart.bind(this), false);
		document.body.addEventListener('touchmove', this.onDocumentTouchMove.bind(this), false);
	}

	setCoords(x, y) {
		if (this.timer) clearTimeout(this.timer);
		this.coords.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
		this.mouseMoved = true;
		this.timer = setTimeout(() => {
			this.mouseMoved = false;
		}, 100);
	}
	onDocumentMouseMove(event) {
		this.setCoords(event.clientX, event.clientY);
	}
	onDocumentTouchStart(event) {
		if (event.touches.length === 1) {
			// event.preventDefault();
			this.setCoords(event.touches[0].pageX, event.touches[0].pageY);
		}
	}
	onDocumentTouchMove(event) {
		if (event.touches.length === 1) {
			// event.preventDefault();

			this.setCoords(event.touches[0].pageX, event.touches[0].pageY);
		}
	}

	update() {
		this.diff.subVectors(this.coords, this.coords_old);
		this.coords_old.copy(this.coords);

		if (this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);
	}
}

export default new RigCoordsFluid();
