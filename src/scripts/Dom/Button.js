import { UI_IDS } from '@Core/audio/AudioManager.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { UiElement } from './UiElement.js';

const MAGNET_DISTANCE = 100;
const HOVER_DURATION = 2;

class Button extends UiElement {
	constructor(node, callback) {
		super(node);
		state.register(this);

		this.active = false;
		this.previousHovered = false;
		this.hovered = false;
		this.callback = callback;

		this.position = this.getPositionAtCenter();

		this.hoveredTime = 0;
	}

	show() {
		this.active = true;
		super.show();
	}

	hide() {
		this.active = false;
		super.hide();
	}

	onResize() {
		this.position = this.getPositionAtCenter();
	}

	onRender({ dt }) {
		if (!this.hovered || !this.active) return;

		this.hoveredTime += dt;

		if (this.hoveredTime >= HOVER_DURATION) {
			this.callback();
			this.hoveredTime = 0;
		}
	}

	isHovering(element) {
		this.hovered = Math.hypot(this.position.x - element.x, this.position.y - element.y) <= MAGNET_DISTANCE;

		if (this.hovered !== this.previousHovered) {
			if (this.hovered) {
				app.core.audio.playUI(UI_IDS.CURSOR);
				this.node.classList.add('hovered');
			} else {
				this.node.classList.remove('hovered');
				this.hoveredTime = 0;
			}
		}

		this.previousHovered = this.hovered;

		return this.hovered;
	}

	getPositionAtCenter() {
		const { top, left, width, height } = this.node.getBoundingClientRect();
		return {
			x: left + width / 2,
			y: top + height / 2,
		};
	}
}

export { Button };
