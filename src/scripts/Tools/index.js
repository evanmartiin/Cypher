import { Keyboard } from './Keyboard.js';
import { Mouse } from './Mouse.js';
import Recorder from './Recorder.js';
import { Viewport } from './Viewport.js';

function createToolsModules() {
	const mouse = new Mouse();
	const viewport = new Viewport();
	const keyboard = new Keyboard();
	const recorder = new Recorder();

	return {
		mouse,
		viewport,
		keyboard,
		recorder,
	};
}

export { createToolsModules };
