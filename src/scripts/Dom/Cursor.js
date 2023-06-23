import { Vector2 } from 'three';
import { UI_IDS } from '@Core/audio/AudioManager.js';
import Signal from '@utils/Signal.js';
import { assertIsInCamera } from '@utils/assertions.js';
import { POSE } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { VIDEO_SIZE } from '@scripts/Tensorflow/TensorflowCamera.js';

const MAGNET_DISTANCE = 100;

class Cursor {
	constructor() {
		state.register(this);

		this.startDOM = document.getElementsByClassName('start')[0];

		this.cursorDOM = document.createElement('div');
		this.cursorDOM.classList.add('custom-cursor', 'hide');
		app.$root.appendChild(this.cursorDOM);

		this.pos = new Vector2();
		this.targetPos = new Vector2();

		this.enterHover = new Signal();
		this.exitHover = new Signal();

		this.active = false;
		this.hovered = false;
	}

	enable() {
		this.active = true;
		this.show();
	}

	disable() {
		this.active = false;
		this.hide();

		this.enterHover.release();
		this.exitHover.release();
	}

	show() {
		this.cursorDOM.classList.remove('hide');
		this.startDOM.classList.add('show');
	}

	hide() {
		this.cursorDOM.classList.add('hide');
		this.startDOM.classList.remove('show');
	}

	onPlayerMoved(rig) {
		if (!this.active) return;

		const rawPos = rig.keypoints[POSE.RIGHT_WRIST];

		if (!assertIsInCamera(rawPos)) {
			if (!this.cursorDOM.classList.contains('hide')) this.cursorDOM.classList.add('hide');
			return;
		} else {
			if (this.cursorDOM.classList.contains('hide')) this.cursorDOM.classList.remove('hide');
		}

		this.targetPos.x = app.tools.viewport.width - (rawPos.x / VIDEO_SIZE.width) * app.tools.viewport.width;
		this.targetPos.y = (rawPos.y / VIDEO_SIZE.height) * app.tools.viewport.height;

		if (this.getDistanceFromCursor(this.startDOM) < MAGNET_DISTANCE) {
			this.targetPos.x = app.tools.viewport.width / 2;
			this.targetPos.y = app.tools.viewport.height / 2;

			if (!this.hovered) {
				this.hovered = true;
				this.enterHover.emit();
				app.core.audio.playUI(UI_IDS.CURSOR);
				this.startDOM.classList.add('hovered');
			}
		} else {
			this.startDOM.classList.remove('hovered');

			if (this.hovered) {
				this.hovered = false;
				this.exitHover.emit();
			}
		}
	}

	onRender() {
		if (!this.active) return;
		if (this.pos.distanceTo(this.targetPos) < 3) return;

		this.pos.lerp(this.targetPos, 0.05);
		this.cursorDOM.style.transform = `translateX(calc(${this.pos.x}px - 50%)) translateY(calc(${this.pos.y}px - 50%))`;
	}

	getPositionAtCenter(element) {
		const { top, left, width, height } = element.getBoundingClientRect();
		return {
			x: left + width / 2,
			y: top + height / 2,
		};
	}

	getDistanceFromCursor(element) {
		const elementPosition = this.getPositionAtCenter(element);

		return Math.hypot(elementPosition.x - this.targetPos.x, elementPosition.y - this.targetPos.y);
	}
}

export { Cursor };
