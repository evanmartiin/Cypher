import { BufferGeometry, DepthTexture, Float32BufferAttribute, Mesh, OrthographicCamera, Vector2, WebGLRenderTarget } from 'three';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { PostProcessingMaterial } from './Materials/PostProcessing/material.js';

class PostProcessing {
	#material;
	constructor(_isWebGL2 = true) {
		state.register(this);

		this.renderTarget = this.#createRenderTarget();

		this.#material = new PostProcessingMaterial({
			uniforms: {
				...globalUniforms,

				// Textures
				tDiffuse: { value: this.renderTarget.texture },

				// Viewport
				uResolution: { value: new Vector2() },
				uRatio: { value: app.tools.viewport.ratio },
			},
		});

		const geo = new BufferGeometry()
			.setAttribute('position', new Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3))
			.setAttribute('uv', new Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2));

		this.quad = new Mesh(geo, this.#material);
		this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
	}

	#createRenderTarget(withDepth = false) {
		const renderTarget = new WebGLRenderTarget(app.tools.viewport.width * app.tools.viewport.dpr, app.tools.viewport.height * app.tools.viewport.dpr, {
			samples: 2,
		});
		if (withDepth) {
			const depthTexture = new DepthTexture(app.tools.viewport.width * app.tools.viewport.dpr, app.tools.viewport.height * app.tools.viewport.dpr);
			renderTarget.depthTexture = depthTexture;
		}
		return renderTarget;
	}

	onAttach() {}

	onResize({ width, height, dpr, ratio }) {
		this.#material.uniforms.uResolution.value.set(width * dpr, height * dpr);
		this.#material.uniforms.uRatio.value = ratio;

		this.renderTarget.setSize(width * dpr, height * dpr);
	}

	get uniforms() {
		return this.#material.uniforms;
	}
}

export { PostProcessing };
