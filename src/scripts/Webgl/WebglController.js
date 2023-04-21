import { HalfFloatType } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { MainCamera } from './MainCamera.js';
import { MainScene } from './MainScene.js';
import { PostProcessing } from './PostProcessing.js';
import { Renderer } from './Renderer.js';

class WebglController {
	constructor() {
		state.register(this);

		this.renderer = new Renderer();
		this.postProcessing = new PostProcessing(this.renderer.capabilities.isWebGL2);
		this.scene = new MainScene();
		this.camera = new MainCamera();

		/**
		 * Post processing
		 */
		this.effectComposer = new EffectComposer(this.renderer);
		this.effectComposer.setSize(app.tools.viewport.width, app.tools.viewport.height);
		this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		const renderPass = new RenderPass(this.scene, this.camera);
		this.effectComposer.addPass(renderPass);

		const unrealBloomPass = new UnrealBloomPass();
		unrealBloomPass.strength = 0.45;
		unrealBloomPass.radius = 1;
		unrealBloomPass.threshold = 0.0;
		this.effectComposer.addPass(unrealBloomPass);

		const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
		this.effectComposer.addPass(gammaCorrectionPass);
	}

	onAttach() {
		app.$wrapper.prepend(this.renderer.domElement);
	}

	onResize() {}

	onTick({ et }) {
		globalUniforms.uTime.value = et;
	}

	onRender() {
		// this.renderer.clear();
		// this.renderer.setRenderTarget(this.postProcessing.renderTarget);
		// this.renderer.clear();
		// this.renderer.render(this.scene, this.camera);
		// this.renderer.setRenderTarget(null);
		// this.composer.render();
		// this.renderer.render(this.postProcessing.quad, this.postProcessing.camera);
		this.effectComposer.render();
	}
}

export { WebglController };
