import { MathUtils, MeshNormalMaterial, Vector3, Vector4 } from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import positionShader from '@Webgl/Materials/FreestyleParticles/simulation/positionShader.fs';
import velocityShader from '@Webgl/Materials/FreestyleParticles/simulation/velocityShader.fs';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { globalUniforms } from '../../../utils/globalUniforms.js';

const NUM_CUBES = 1;

export class GPUSimulation {
	constructor(renderer, size, coords) {
		this.renderer = renderer;
		this.size = size;
		this.coords = coords;

		this.coordsPositions = new Vector3();
		this.tempCoordsPositions = new Vector3();

		this.cubes = this.createCube();

		this.init();
		state.register(this);
	}

	createCube() {
		this.cubeQuaternions = [];
		this.cubePositions = [];

		const collider = app.core.assetsManager.get('collider');

		collider.children.forEach((mesh) => {
			this.cubeQuaternions.push(new Vector4(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w).normalize());
			this.cubePositions.push(new Vector4(mesh.position.x, mesh.position.y, mesh.position.z, 1.9));

			// app.webgl.scene.add(mesh.clone());
			mesh.material = new MeshNormalMaterial();
		});
	}

	init() {
		this.gpuCompute = new GPUComputationRenderer(this.size, this.size, this.renderer);

		this.dataPos = this.gpuCompute.createTexture();
		this.dataVel = this.gpuCompute.createTexture();

		const posArray = this.dataPos.image.data;
		const velArray = this.dataVel.image.data;

		for (let i = 0, il = posArray.length; i < il; i += 4) {
			// const phi = Math.random() * 2 * Math.PI;
			// const theta = Math.random() * Math.PI;
			const r = 0.25 + Math.random() * 1.75;

			const bruhI = MathUtils.randFloat(0, 360);
			const bruhJ = MathUtils.randFloat(-90, 90);

			const theta = bruhI * (Math.PI / 180);
			const phi = bruhJ * (Math.PI / 180);
			const x = Math.cos(theta) * Math.cos(phi) * r;
			const y = Math.sin(theta) * Math.cos(phi) * r;
			const z = Math.sin(phi) * r;

			posArray[i + 0] = x;
			posArray[i + 1] = y;
			posArray[i + 2] = z;
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
		this.posUniforms.uDieSpeed = { value: 0.01 };
		this.posUniforms.uCoordsPositions = { value: this.coordsPositions };
		this.posUniforms.uTextureDefaultPosition = {
			value: textureDefaultPosition,
		};

		this.velUniforms = this.vel.material.uniforms;

		this.velUniforms.uTime = { value: globalUniforms.uTime.value };
		this.velUniforms.uDelta = { value: 0.0 };
		this.velUniforms.uSpeed = { value: 0.1 };
		this.velUniforms.uAttraction = { value: 1 };
		this.velUniforms.uCurlSize = { value: 0.3 };
		this.velUniforms.uTimeScale = { value: 0.75 };
		this.velUniforms.uCoordsPositions = { value: this.coordsPositions };
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

		this.coordsPositions.lerp(this.tempCoordsPositions.set(this.coords.x, this.coords.y + 1, this.coords.z), 0.22);
	}
}
