import { Vector2 } from 'three';
import Signal from '@utils/Signal.js';
import { assertIsInCamera } from '@utils/assertions.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { VIDEO_SIZE } from '@scripts/Tensorflow/TensorflowCamera.js';
import { UiElement } from './UiElement.js';

class Cursor extends UiElement {
	constructor(bone, node) {
		super(node);
		state.register(this);

		this.bone = bone;
		this.node = node;

		this.pos = new Vector2();
		this.targetPos = new Vector2();

		this.enterHover = new Signal();
		this.exitHover = new Signal();

		this.active = false;
		this.hoveredButton = undefined;

		this.buttons = [];
	}

	onAttach() {
		for (const key in app.dom.ui) {
			if (Object.hasOwnProperty.call(app.dom.ui, key)) {
				if (app.dom.ui[key].constructor.name === 'Button') this.buttons.push(app.dom.ui[key]);
			}
		}
	}

	enable() {
		this.active = true;
		super.show();
	}

	disable() {
		this.active = false;
		super.hide();
	}

	onPlayerMoved(rig) {
		if (!this.active) return;

		const rawPos = rig.keypoints[this.bone];

		if (!assertIsInCamera(rawPos)) {
			if (!this.node.classList.contains('hide')) super.hide();
			return;
		} else {
			if (this.node.classList.contains('hide')) super.show();
		}

		this.targetPos.x = app.tools.viewport.width - (rawPos.x / VIDEO_SIZE.width) * app.tools.viewport.width;
		this.targetPos.y = (rawPos.y / VIDEO_SIZE.height) * app.tools.viewport.height;

		const hoveredButton = this.buttons
			.filter((button) => button.active)
			.map((button) => button.isHovering(this.targetPos) && button)
			.filter((v) => v)[0];

		if (hoveredButton !== this.hoveredButton) {
			if (hoveredButton) this.enterHover.emit();
			else this.exitHover.emit();
		}

		this.hoveredButton = hoveredButton;

		if (this.hoveredButton) {
			this.targetPos.x = this.hoveredButton.position.x;
			this.targetPos.y = this.hoveredButton.position.y;
		}
	}

	onRender() {
		if (!this.active) return;
		if (this.pos.distanceTo(this.targetPos) < 3) return;

		this.pos.lerp(this.targetPos, 0.05);
		this.node.style.transform = `translateX(calc(${this.pos.x}px - 50%)) translateY(calc(${this.pos.y}px - 50%))`;
	}
}

export { Cursor };
