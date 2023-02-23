import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import basePositionShader from '@Webgl/Materials/Particles/simulation/basePositionShader.fs';
import positionShader from '@Webgl/Materials/Particles/simulation/positionShader.fs';
import velocityShader from '@Webgl/Materials/Particles/simulation/velocityShader.fs';

export class GPUSimulation {
	constructor(renderer, size) {
		this.renderer = renderer;
		this.size = size;
		this.init();
	}

	init() {
		this.gpuCompute = new GPUComputationRenderer(this.size, this.size, this.renderer);

		this.dataPos = this.gpuCompute.createTexture();
		this.dataVel = this.gpuCompute.createTexture();
		this.dataDef = this.gpuCompute.createTexture();

		let posArray = this.dataPos.image.data;
		let velArray = this.dataVel.image.data;
		let defArray = this.dataDef.image.data;

		for (let i = 0, il = posArray.length; i < il; i += 4) {
			let phi = Math.random() * 2 * Math.PI;
			let theta = Math.random() * Math.PI;
			let r = 0.8 + Math.random() * 2;

			defArray[i + 0] = posArray[i + 0] = r * Math.sin(theta) * Math.cos(phi);
			defArray[i + 1] = posArray[i + 1] = r * Math.sin(theta) * Math.sin(phi);
			defArray[i + 2] = posArray[i + 2] = r * Math.cos(theta);

			velArray[i + 3] = Math.random() * 100; // frames life
			// if(i < 50) console.log(velArray[ i + 3 ])
		}

		this.def = this.gpuCompute.addVariable('defTex', basePositionShader, this.dataDef);
		this.vel = this.gpuCompute.addVariable('velTex', velocityShader, this.dataVel);
		this.pos = this.gpuCompute.addVariable('posTex', positionShader, this.dataPos);

		this.gpuCompute.setVariableDependencies(this.def, [this.pos, this.vel, this.def]);
		this.gpuCompute.setVariableDependencies(this.vel, [this.pos, this.vel, this.def]);
		this.gpuCompute.setVariableDependencies(this.pos, [this.pos, this.vel, this.def]);

		this.velUniforms = this.vel.material.uniforms;

		this.velUniforms.timer = { value: 0.0 };
		this.velUniforms.delta = { value: 0.0 };
		this.velUniforms.speed = { value: 0.5 };
		this.velUniforms.factor = { value: 0.5 };
		this.velUniforms.evolution = { value: 0.5 };
		this.velUniforms.radius = { value: 2.0 };

		let error = this.gpuCompute.init();
		if (error !== null) {
			console.error(error);
		}
	}
}
