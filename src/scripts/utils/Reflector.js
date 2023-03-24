import * as POSTPROCESSING from 'postprocessing';
import {
	Color,
	HalfFloatType,
	LinearEncoding,
	LinearFilter,
	Matrix4,
	Mesh,
	MeshStandardMaterial,
	MirroredRepeatWrapping,
	NoToneMapping,
	PerspectiveCamera,
	Plane,
	RepeatWrapping,
	Vector3,
	Vector4,
	WebGLRenderTarget,
} from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import fragmentShader from '@Webgl/Materials/Reflector/fragment.fs';
import { ReflectorMaterial } from '@Webgl/Materials/Reflector/material.js';
import vertexShader from '@Webgl/Materials/Reflector/vertex.vs';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';

class Reflector extends Mesh {
	constructor(geometry, options = {}) {
		super(geometry);

		this.isReflector = true;

		this.type = 'Reflector';
		this.camera = new PerspectiveCamera();

		const scope = this;

		const color = options.color !== undefined ? new Color(options.color) : new Color(0x7f7f7f);
		const textureWidth = options.textureWidth || 512;
		const textureHeight = options.textureHeight || 512;
		const clipBias = options.clipBias || 0;
		const multisample = options.multisample !== undefined ? options.multisample : 4;

		//

		const reflectorPlane = new Plane();
		const normal = new Vector3();
		const reflectorWorldPosition = new Vector3();
		const cameraWorldPosition = new Vector3();
		const rotationMatrix = new Matrix4();
		const lookAtPosition = new Vector3(0, 0, -1);
		const clipPlane = new Vector4();

		const view = new Vector3();
		const target = new Vector3();
		const q = new Vector4();

		const textureMatrix = new Matrix4();
		const virtualCamera = this.camera;

		this.baseRenderTarget = new WebGLRenderTarget(textureWidth, textureHeight, { samples: multisample, type: HalfFloatType, minFilter: LinearFilter, magFilter: LinearFilter });
		this.blurRenderTarget = new WebGLRenderTarget(textureWidth, textureHeight, { samples: multisample, type: HalfFloatType, minFilter: LinearFilter, magFilter: LinearFilter });

		this.kawaseBlurPass = new POSTPROCESSING.KawaseBlurPass();
		this.kawaseBlurPass.setSize(textureWidth * 1.5, textureHeight * 1.5);

		const repeat = 20;

		const normalMap = app.core.assetsManager.get('normal');
		normalMap.wrapS = RepeatWrapping;
		normalMap.wrapT = RepeatWrapping;
		normalMap.repeat.x = repeat;
		normalMap.repeat.y = repeat;

		const roughnessMap = app.core.assetsManager.get('roughness');
		roughnessMap.wrapS = RepeatWrapping;
		roughnessMap.wrapT = RepeatWrapping;
		roughnessMap.repeat.x = repeat;
		roughnessMap.repeat.y = repeat;

		const baseMap = app.core.assetsManager.get('base');
		baseMap.wrapS = RepeatWrapping;
		baseMap.wrapT = RepeatWrapping;
		baseMap.repeat.x = repeat;
		baseMap.repeat.y = repeat;

		const aoMap = app.core.assetsManager.get('ao');
		aoMap.wrapS = RepeatWrapping;
		aoMap.wrapT = RepeatWrapping;
		aoMap.repeat.x = repeat;
		aoMap.repeat.y = repeat;

		this.material = new CustomShaderMaterial({
			baseMaterial: MeshStandardMaterial,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				...globalUniforms,
				uBlurTexture: { value: this.blurRenderTarget.texture },
				uTextureMatrix: { value: textureMatrix },
			},
			transparent: true,
			metalness: 0.1,
			roughness: 0.9,
			normalMap: normalMap,
			roughnessMap: roughnessMap,
			envMap: app.core.assetsManager.get('envmap'),
		});

		this.onBeforeRender = function (renderer, scene, camera) {
			reflectorWorldPosition.setFromMatrixPosition(scope.matrixWorld);
			cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);

			rotationMatrix.extractRotation(scope.matrixWorld);

			normal.set(0, 0, 1);
			normal.applyMatrix4(rotationMatrix);

			view.subVectors(reflectorWorldPosition, cameraWorldPosition);

			// Avoid rendering when reflector is facing away

			if (view.dot(normal) > 0) return;

			view.reflect(normal).negate();
			view.add(reflectorWorldPosition);

			rotationMatrix.extractRotation(camera.matrixWorld);

			lookAtPosition.set(0, 0, -1);
			lookAtPosition.applyMatrix4(rotationMatrix);
			lookAtPosition.add(cameraWorldPosition);

			target.subVectors(reflectorWorldPosition, lookAtPosition);
			target.reflect(normal).negate();
			target.add(reflectorWorldPosition);

			virtualCamera.position.copy(view);
			virtualCamera.up.set(0, 1, 0);
			virtualCamera.up.applyMatrix4(rotationMatrix);
			virtualCamera.up.reflect(normal);
			virtualCamera.lookAt(target);

			virtualCamera.far = camera.far; // Used in WebGLBackground

			virtualCamera.updateMatrixWorld();
			virtualCamera.projectionMatrix.copy(camera.projectionMatrix);

			// Update the texture matrix
			textureMatrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
			textureMatrix.multiply(virtualCamera.projectionMatrix);
			textureMatrix.multiply(virtualCamera.matrixWorldInverse);
			textureMatrix.multiply(scope.matrixWorld);

			// Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
			// Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
			reflectorPlane.setFromNormalAndCoplanarPoint(normal, reflectorWorldPosition);
			reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse);

			clipPlane.set(reflectorPlane.normal.x, reflectorPlane.normal.y, reflectorPlane.normal.z, reflectorPlane.constant);

			const projectionMatrix = virtualCamera.projectionMatrix;

			q.x = (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
			q.y = (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
			q.z = -1.0;
			q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];

			// Calculate the scaled plane vector
			clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));

			// Replacing the third row of the projection matrix
			projectionMatrix.elements[2] = clipPlane.x;
			projectionMatrix.elements[6] = clipPlane.y;
			projectionMatrix.elements[10] = clipPlane.z + 1.0 - clipBias;
			projectionMatrix.elements[14] = clipPlane.w;

			// Render
			scope.visible = false;

			const currentRenderTarget = renderer.getRenderTarget();

			const currentXrEnabled = renderer.xr.enabled;
			const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
			const currentOutputEncoding = renderer.outputEncoding;
			const currentToneMapping = renderer.toneMapping;

			renderer.xr.enabled = false; // Avoid camera modification
			renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows
			renderer.outputEncoding = LinearEncoding;
			renderer.toneMapping = NoToneMapping;

			renderer.setRenderTarget(this.baseRenderTarget);

			renderer.state.buffers.depth.setMask(true); // make sure the depth buffer is writable so it can be properly cleared, see #18897

			if (renderer.autoClear === false) renderer.clear();
			renderer.render(scene, virtualCamera);

			this.kawaseBlurPass.render(renderer, this.baseRenderTarget, this.blurRenderTarget);

			renderer.xr.enabled = currentXrEnabled;
			renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
			renderer.outputEncoding = currentOutputEncoding;
			renderer.toneMapping = currentToneMapping;

			renderer.setRenderTarget(currentRenderTarget);

			// Restore viewport

			const viewport = camera.viewport;

			if (viewport !== undefined) {
				renderer.state.viewport(viewport);
			}

			scope.visible = true;
		};

		this.getRenderTarget = function () {
			return this.baseRenderTarget;
		};

		this.dispose = function () {
			this.baseRenderTarget.dispose();
			scope.material.dispose();
		};
	}
}

export { Reflector };
