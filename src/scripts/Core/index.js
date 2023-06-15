import { AssetsManager } from './AssetsManager.js';
import { Ticker } from './Ticker.js';
import { AudioManager } from './audio/AudioManager.js';

function createCoreModules() {
	const assetsManager = new AssetsManager();
	const ticker = new Ticker();
	const audio = new AudioManager();

	return {
		assetsManager,
		ticker,
		audio,
	};
}

export { createCoreModules };
