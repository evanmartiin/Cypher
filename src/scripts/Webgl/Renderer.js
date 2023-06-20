import { PCFSoftShadowMap, WebGLRenderer, sRGBEncoding } from 'three';
import { DEBUG } from '@utils/config.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

class Renderer extends WebGLRenderer {
	constructor() {
		super({ powerPreference: 'high-performance' });
		state.register(this);

		this.antialias = false;
		this.stencil = false;
		this.depth = false;
		this.autoClear = false;
		// this.outputEncoding = sRGBEncoding;
		this.shadowMap.enabled = false;
		// this.shadowMap.type = PCFSoftShadowMap;
		this.debug.checkShaderErrors = DEBUG;
		// this.sortObjects = false;
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
