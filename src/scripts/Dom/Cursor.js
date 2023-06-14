import { Vector2 } from 'three';
import { POSE } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { VIDEO_SIZE } from '@scripts/Tensorflow/TensorflowCamera.js';

class Cursor {
	constructor() {
		state.register(this);

		this.DOM = document.createElement('div');
		this.DOM.classList.add('custom-cursor', 'hide');
		app.$root.appendChild(this.DOM);

		this.pos = new Vector2();
		this.targetPos = new Vector2();

		this.active = false;
	}

	enable() {
		this.active = true;
		this.show();
	}

	disable() {
		this.active = false;
		this.hide();
	}

	show() {
		this.DOM.classList.remove('hide');
	}

	hide() {
		this.DOM.classList.add('hide');
	}

	onPlayerMoved(rig) {
		if (!this.active) return;

		const rawPos = rig.keypoints[POSE.LEFT_WRIST];

		if (!this.assertHandIsInCamera(rawPos)) {
			if (!this.DOM.classList.contains('hide')) this.hide();
			return;
		} else {
			if (this.DOM.classList.contains('hide')) this.show();
		}

		this.targetPos.x = app.tools.viewport.width - (rawPos.x / VIDEO_SIZE.width) * app.tools.viewport.width;
		this.targetPos.y = (rawPos.y / VIDEO_SIZE.height) * app.tools.viewport.height;
	}

	onRender() {
		if (!this.active) return;
		if (this.pos.distanceTo(this.targetPos) < 3) return;

		this.pos.lerp(this.targetPos, 0.05);
		this.DOM.style.transform = `translateX(${this.pos.x}px) translateY(${this.pos.y}px)`;
	}

	assertHandIsInCamera(pos) {
		return pos.x > 0 && pos.x < VIDEO_SIZE.width && pos.y > 0 && pos.y < VIDEO_SIZE.height;
	}
}

export { Cursor };
