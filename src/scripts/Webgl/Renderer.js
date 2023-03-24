import { PCFSoftShadowMap, WebGLRenderer, sRGBEncoding } from 'three';
import { DEBUG } from '@utils/config.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

class Renderer extends WebGLRenderer {
	constructor() {
		super({ antialias: true, powerPreference: 'high-performance' });
		state.register(this);

		this.autoClear = false;
		this.outputEncoding = sRGBEncoding;
		this.shadowMap.enabled = true;
		this.shadowMap.type = PCFSoftShadowMap;
		this.debug.checkShaderErrors = DEBUG;
	}

	onAttach() {
		app.debug?.mapping.add(this, 'Stats');
	}

	onResize({ width, height, dpr }) {
		this.setSize(width, height);
		this.setPixelRatio(dpr);
	}
}

export { Renderer };
