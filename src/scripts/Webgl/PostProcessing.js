import { MathUtils } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

class PostProcessing {
	constructor(_isWebGL2 = true, renderer, scene, camera) {
		state.register(this);

		/**
		 * Post processing
		 */
		this.effectComposer = new EffectComposer(renderer);
		this.effectComposer.setSize(app.tools.viewport.width, app.tools.viewport.height);
		this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		const renderPass = new RenderPass(scene, camera);
		this.effectComposer.addPass(renderPass);

		const unrealBloomPass = new UnrealBloomPass();
		unrealBloomPass.strength = 1.25;
		unrealBloomPass.radius = 1;
		unrealBloomPass.threshold = 0.0;
		this.effectComposer.addPass(unrealBloomPass);

		const fisheyes = new ShaderPass(this.getDistortionShaderDefinition());
		this.effectComposer.addPass(fisheyes);

		// Setup distortion effect
		const horizontalFOV = 140;
		const strength = 0.35;
		const cylindricalRatio = 2;
		const height = Math.tan(MathUtils.degToRad(horizontalFOV) / 2) / camera.aspect;

		camera.fov = (Math.atan(height) * 2 * 180) / 3.1415926535;
		camera.updateProjectionMatrix();

		fisheyes.uniforms['strength'].value = strength;
		fisheyes.uniforms['height'].value = height;
		fisheyes.uniforms['aspectRatio'].value = camera.aspect;
		fisheyes.uniforms['cylindricalRatio'].value = cylindricalRatio;

		const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
		// this.effectComposer.addPass(gammaCorrectionPass);

		const smaaPass = new SMAAPass();
		this.effectComposer.addPass(smaaPass);
	}

	getDistortionShaderDefinition() {
		return {
			uniforms: {
				tDiffuse: { type: 't', value: null },
				strength: { type: 'f', value: 0 },
				height: { type: 'f', value: 1 },
				aspectRatio: { type: 'f', value: 1 },
				cylindricalRatio: { type: 'f', value: 1 },
			},

			vertexShader: [
				'uniform float strength;', // s: 0 = perspective, 1 = stereographic
				'uniform float height;', // h: tan(verticalFOVInRadians / 2)
				'uniform float aspectRatio;', // a: screenWidth / screenHeight
				'uniform float cylindricalRatio;', // c: cylindrical distortion ratio. 1 = spherical

				'varying vec3 vUV;', // output to interpolate over screen
				'varying vec2 vUVDot;', // output to interpolate over screen

				'void main() {',
				'gl_Position = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));',

				'float scaledHeight = strength * height;',
				'float cylAspectRatio = aspectRatio * cylindricalRatio;',
				'float aspectDiagSq = aspectRatio * aspectRatio + 1.0;',
				'float diagSq = scaledHeight * scaledHeight * aspectDiagSq;',
				'vec2 signedUV = (2.0 * uv + vec2(-1.0, -1.0));',

				'float z = 0.5 * sqrt(diagSq + 1.0) + 0.5;',
				'float ny = (z - 1.0) / (cylAspectRatio * cylAspectRatio + 1.0);',

				'vUVDot = sqrt(ny) * vec2(cylAspectRatio, 1.0) * signedUV;',
				'vUV = vec3(0.5, 0.5, 1.0) * z + vec3(-0.5, -0.5, 0.0);',
				'vUV.xy += uv;',
				'}',
			].join('\n'),

			fragmentShader: [
				'uniform sampler2D tDiffuse;', // sampler of rendered scene?s render target
				'varying vec3 vUV;', // interpolated vertex output data
				'varying vec2 vUVDot;', // interpolated vertex output data

				'void main() {',
				'vec3 uv = dot(vUVDot, vUVDot) * vec3(-0.5, -0.5, -1.0) + vUV;',
				'gl_FragColor = texture2DProj(tDiffuse, uv);',
				'}',
			].join('\n'),
		};
	}

	onAttach() {}

	onResize() {}

	onRender() {
		this.effectComposer.render();
	}
}

export { PostProcessing };
