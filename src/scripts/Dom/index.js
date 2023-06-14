import { Cursor } from './Cursor.js';

function createDomModules() {
	const cursor = new Cursor();

	return {
		cursor,
	};
}

export { createDomModules };
