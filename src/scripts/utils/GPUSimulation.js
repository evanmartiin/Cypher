import { Vector3 } from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import positionShader from '@Webgl/Materials/Particles/simulation/positionShader.fs';
import velocityShader from '@Webgl/Materials/Particles/simulation/velocityShader.fs';
import { state } from '@scripts/State.js';
import RigCoords from './RigCoords.js';
import { globalUniforms } from './globalUniforms.js';

export class GPUSimulation {
	constructor(renderer, size) {
		this.renderer = renderer;
		this.size = size;
		this.handPosition = new Vector3();
		this.tempPosition = new Vector3();
		this.lerpedPosition = new Vector3();
		this.init();
		state.register(this);
	}

	init() {
		this.gpuCompute = new GPUComputationRenderer(this.size, this.size, this.renderer);

		this.dataPos = this.gpuCompute.createTexture();
		this.dataVel = this.gpuCompute.createTexture();

		const posArray = this.dataPos.image.data;
		const velArray = this.dataVel.image.data;

		for (let i = 0, il = posArray.length; i < il; i += 4) {
			const phi = Math.random() * 2 * Math.PI;
			const theta = Math.random() * Math.PI;
			const r = 0.8 + Math.random() * 2;

			posArray[i + 0] = r * Math.cos(theta) * Math.cos(phi);
			posArray[i + 1] = r * Math.sin(phi);
			posArray[i + 2] = r * Math.cos(theta) * Math.cos(phi);
			posArray[i + 3] = Math.random();
			velArray[i + 0] = 0;
			velArray[i + 1] = 0;
			velArray[i + 2] = 0;
			velArray[i + 3] = 0;
		}

		const textureDefaultPosition = this.dataPos.clone();
		this.pos = this.gpuCompute.addVariable('posTex', positionShader, this.dataPos);
		this.vel = this.gpuCompute.addVariable('velTex', velocityShader, this.dataVel);

		this.gpuCompute.setVariableDependencies(this.pos, [this.pos, this.vel]);
		this.gpuCompute.setVariableDependencies(this.vel, [this.pos, this.vel]);

		this.posUniforms = this.pos.material.uniforms;

		this.posUniforms.uTime = { value: globalUniforms.uTime.value };
		this.posUniforms.uDelta = { value: 0.0 };
		this.posUniforms.uDieSpeed = { value: 0.015 };
		this.posUniforms.uHandPosition = { value: this.handPosition };
		this.posUniforms.uTextureDefaultPosition = {
			value: textureDefaultPosition,
		};

		this.velUniforms = this.vel.material.uniforms;

		this.velUniforms.uTime = { value: globalUniforms.uTime.value };
		this.velUniforms.uDelta = { value: 0.0 };
		this.velUniforms.uSpeed = { value: 0.5 };
		this.velUniforms.uAttraction = { value: 1 };
		this.velUniforms.uCurlSize = { value: 0.1 };
		this.velUniforms.uTimeScale = { value: 1 };
		this.velUniforms.uHandPosition = { value: this.handPosition };

		const error = this.gpuCompute.init();
		if (error !== null) {
			console.error(error);
		}
	}

	onRender({ dt }) {
		let deltaRatio = 60 * dt;
		deltaRatio = Math.min(deltaRatio, 0.6);

		this.posUniforms.uDelta.value = deltaRatio;

		RigCoords.update();

		this.tempPosition.lerp(this.lerpedPosition.set(RigCoords.leftTest.x, RigCoords.leftTest.y + 1, RigCoords.leftTest.z), 0.1);
		this.handPosition.copy(this.tempPosition);
	}
}
