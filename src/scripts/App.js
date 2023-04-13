import 'https://greggman.github.io/webgl-lint/webgl-lint.js';
import { createCoreModules } from '@Core/index.js';
import { WebglController } from '@Webgl/WebglController.js';
import { createDomModules } from '@Dom/index.js';
import { createToolsModules } from '@Tools/index.js';
import { createDebugModules } from '@Debug/index.js';
import { DEBUG } from '@utils/config.js';
import { EVENTS } from '@utils/constants.js';
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
		this.webgl = new WebglController();
		this.server = new ServerController();
		this.tensorflow = new TensorflowController();
		this.timeline = new Timeline();
		this.dom = createDomModules();
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

	static getInstance() {
		if (!App.instance) App.instance = new App();
		return App.instance;
	}
}
const app = App.getInstance();
export { app };
