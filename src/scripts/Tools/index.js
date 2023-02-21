import { Keyboard } from './Keyboard.js';
import { Mouse } from './Mouse.js';
import Recorder from './Recorder.js';
import { URLParams } from './URLParams.js';
import { Viewport } from './Viewport.js';

function createToolsModules() {
	const mouse = new Mouse();
	const viewport = new Viewport();
	const keyboard = new Keyboard();
	const recorder = new Recorder();
	const urlParams = new URLParams();

	return {
		mouse,
		viewport,
		keyboard,
		recorder,
		urlParams,
	};
}

export { createToolsModules };
