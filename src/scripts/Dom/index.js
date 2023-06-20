import { Cursor } from './Cursor.js';
import { Ui } from './Ui.js';

function createDomModules() {
	const cursor = new Cursor();
	const ui = new Ui();

	return {
		cursor,
		ui
	};
}

export { createDomModules };
