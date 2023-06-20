import { Cursor } from './Cursor.js';
import { Ui } from './Ui.js';
import { UiElement } from './UiElement.js';

function createDomModules() {
	const cursor = new Cursor();
	const ui = new Ui();
	const uiElement = new UiElement()

	return {
		cursor,
		ui,
		uiElement,
	};
}

export { createDomModules };
