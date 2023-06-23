// import 'https://greggman.github.io/webgl-lint/webgl-lint.js';
import { createCoreModules } from '@Core/index.js';
import { WebglController } from '@Webgl/WebglController.js';
import { UiElement } from '@Dom/UiElement.js';
import { createDomModules } from '@Dom/index.js';
import { createToolsModules } from '@Tools/index.js';
import { createDebugModules } from '@Debug/index.js';
import { DEBUG } from '@utils/config.js';
import { EVENTS } from '@utils/constants.js';
import { PlayerEnergy } from './PlayerEnergy.js';
import { PlayerGame } from './PlayerGame.js';
import { ServerController } from './Server/ServerController.js';
import { state } from './State.js';
import { TensorflowController } from './Tensorflow/TensorflowController.js';
import { Timeline } from './Timeline/Timeline.js';

class App {
	/** @type App */
	static instance;

	async init() {
		this.$app = document.getElementById('app');
		this.$wrapper = document.getElementById('canvas-wrapper');
		this.$root = document.getElementById('root');

		this.core = createCoreModules();
		this.tools = createToolsModules();
		this.dom = createDomModules();
		this.webgl = new WebglController();
		this.server = new ServerController();
		this.tensorflow = new TensorflowController();
		this.timeline = new Timeline();
		this.game = new PlayerGame();
		this.energy = new PlayerEnergy();

		window.addEventListener('click', this.handleFirstClick);

		if (DEBUG) this.debug = await createDebugModules();

		await this.load();
	}

	async load() {
		await this.core.assetsManager.load();
		await this.tools.recorder.init();
		this.debug?.mapping.init();
		state.emit(EVENTS.ATTACH);
		state.emit(EVENTS.RESIZE, this.tools.viewport.infos);
	}

	handleFirstClick = () => {
		window.removeEventListener('click', this.handleFirstClick);
		this.dom.ui.requireSound.hide();
		this.timeline.start();
		this.tensorflow.pose.enable();
	};

	static getInstance() {
		if (!App.instance) App.instance = new App();
		return App.instance;
	}
}
const app = App.getInstance();
export { app };
