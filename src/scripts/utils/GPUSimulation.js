import { Box3, BoxGeometry, Mesh, MeshNormalMaterial, MeshStandardMaterial, Vector3, Vector4 } from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import positionShader from '@Webgl/Materials/Particles/simulation/positionShader.fs';
import velocityShader from '@Webgl/Materials/Particles/simulation/velocityShader.fs';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import RigCoords from './RigCoords.js';
import { globalUniforms } from './globalUniforms.js';

const NUM_CUBES = 20;

export class GPUSimulation {
	constructor(renderer, size) {
		this.renderer = renderer;
		this.size = size;

		this.leftHandPosition = new Vector3();
		this.tempLeftHandPosition = new Vector3();

		this.rightHandPosition = new Vector3();
		this.tempRightHandPosition = new Vector3();

		this.cubes = this.createCube();

		this.init();
		state.register(this);
	}

	createCube() {
		function randomInRange(min, max) {
			return min + Math.random() * (max - min);
		}

		this.cubeQuaternions = [];
		this.cubePositions = [];

		for (let j = 0; j < NUM_CUBES; j++) {
			this.cubeQuaternions.push(new Vector4(randomInRange(-1, 1), randomInRange(-1, 1), randomInRange(-1, 1), randomInRange(-1, 1)).normalize());
			this.cubePositions.push(new Vector4(randomInRange(-3, 3), randomInRange(0, 2), 0, randomInRange(0.3, 0.6)));

			const cube = new Mesh(
				new BoxGeometry(1, 1, 1),
				new MeshStandardMaterial({
					metalness: 0.6,
					roughness: 0.4,
				}),
			);
			cube.scale.set(this.cubePositions[j].w, this.cubePositions[j].w, this.cubePositions[j].w);
			cube.quaternion.copy(this.cubeQuaternions[j]);
			cube.position.set(this.cubePositions[j].x, this.cubePositions[j].y, this.cubePositions[j].z);
			app.webgl.scene.add(cube.clone());
		}
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
		this.posUniforms.uLeftHandPosition = { value: this.leftHandPosition };
		this.posUniforms.uRightHandPosition = { value: this.rightHandPosition };
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
		this.velUniforms.uLeftHandPosition = { value: this.leftHandPosition };
		this.velUniforms.uRightHandPosition = { value: this.rightHandPosition };
		this.velUniforms.uCubePositions = { value: this.cubePositions };
		this.velUniforms.uCubeQuaternions = { value: this.cubeQuaternions };
		this.velUniforms.uNumCubes = { value: NUM_CUBES };

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

		this.leftHandPosition.lerp(this.tempLeftHandPosition.set(RigCoords.leftTest.x, RigCoords.leftTest.y + 1, RigCoords.leftTest.z), 0.1);
		this.rightHandPosition.lerp(this.tempRightHandPosition.set(RigCoords.rightTest.x, RigCoords.rightTest.y + 1, RigCoords.rightTest.z), 0.1);
	}
}
