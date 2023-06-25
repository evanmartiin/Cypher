import { POSE } from '@utils/constants.js';
import { Cursor } from './Cursor.js';

class Cursors {
	constructor() {
		this.leftHand = new Cursor(POSE.LEFT_WRIST, document.getElementsByClassName('left-cursor')[0]);
		this.rightHand = new Cursor(POSE.RIGHT_WRIST, document.getElementsByClassName('right-cursor')[0]);

		this.leftHand.enterHover.on(() => this.rightHand.disable());
		this.rightHand.enterHover.on(() => this.leftHand.disable());
		this.leftHand.exitHover.on(() => this.rightHand.enable());
		this.rightHand.exitHover.on(() => this.leftHand.enable());
	}

	enable() {
		this.leftHand.enable();
		this.rightHand.enable();
	}

	disable() {
		this.leftHand.disable();
		this.rightHand.disable();
	}
}

export { Cursors };
