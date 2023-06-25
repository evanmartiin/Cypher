import { Cursors } from './Cursors.js';
import { Ui } from './Ui.js';

function createDomModules() {
	const cursors = new Cursors();
	const ui = new Ui();

	return {
		cursors,
		ui,
	};
}

export { createDomModules };
