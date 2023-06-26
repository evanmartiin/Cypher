import { Box3, BoxGeometry, MathUtils, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshStandardMaterial, PlaneGeometry, Texture, Vector3, Vector4, ZeroStencilOp } from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import positionShader from '@Webgl/Materials/Particles/simulation/positionShader.fs';
import velocityShader from '@Webgl/Materials/Particles/simulation/velocityShader.fs';
import Simulation from '@Webgl/Objects/FluidSim/Simulation.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import RigCoords from './RigCoords.js';
import { globalUniforms } from './globalUniforms.js';

const NUM_CUBES = 1;

export class GPUSimulation {
	constructor(renderer, size, coords, acceleration) {
		state.register(this);

		this.renderer = renderer;
		this.size = size;
		this.coords = coords;
		this.acceleration = acceleration;

		this.coordsPositions = new Vector3();
		this.tempCoordsPositions = new Vector3();

		this.cubes = this.createCube();

		this.fluidSim();

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

		// function randomInRange(min, max) {
		// 	return min + Math.random() * (max - min);
		// }

		// for (let j = 0; j < NUM_CUBES; j++) {
		// 	this.cubeQuaternions.push(new Vector4(randomInRange(-1, 1), randomInRange(-1, 1), randomInRange(-1, 1), randomInRange(-1, 1)).normalize());
		// 	this.cubePositions.push(new Vector4(randomInRange(-3, 3), randomInRange(0, 2), 0, randomInRange(0.3, 0.6)));

		// 	const cube = new Mesh(
		// 		new BoxGeometry(1, 1, 1),
		// 		new MeshStandardMaterial({
		// 			metalness: 0.6,
		// 			roughness: 0.4,
		// 		}),
		// 	);
		// 	cube.scale.set(this.cubePositions[j].w, this.cubePositions[j].w, this.cubePositions[j].w);
		// 	cube.quaternion.copy(this.cubeQuaternions[j]);
		// 	cube.position.set(this.cubePositions[j].x, this.cubePositions[j].y, this.cubePositions[j].z);
		// 	app.webgl.scene.add(cube.clone());
		// }
	}

	init() {
		this.gpuCompute = new GPUComputationRenderer(this.size, this.size, this.renderer);

		this.dataPos = this.gpuCompute.createTexture();
		this.dataVel = this.gpuCompute.createTexture();

		const posArray = this.dataPos.image.data;
		const velArray = this.dataVel.image.data;

		for (let i = 0, il = posArray.length; i < il; i += 4) {
			const r = 0.5 + Math.random() * 2;

			const bruhI = MathUtils.randFloat(0, 360);
			const bruhJ = MathUtils.randFloat(-90, 90);

			const theta = bruhI * (Math.PI / 180);
			const phi = bruhJ * (Math.PI / 180);
			const x = (Math.random() * 2 - 1) * 100;
			const y = (Math.random() * 2 - 1) * 100;
			const z = (Math.random() * 2 - 1) * 20;
			// const x = Math.cos(theta) * Math.cos(phi) * r;
			// const y = Math.sin(theta) * Math.cos(phi) * r;
			// const z = Math.sin(phi) * r;

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
		this.posUniforms.uDieSpeed = { value: 0.02 };
		this.posUniforms.uAcceleration = { value: this.acceleration.value };
		this.posUniforms.uCoordsPositions = { value: this.coordsPositions };
		this.posUniforms.uTextureDefaultPosition = {
			value: textureDefaultPosition,
		};
		this.posUniforms.uFluidTexture = { value: this.simulation.fbos.vel_0.texture };
		this.posUniforms.uRigPositionTexture = { value: new Texture() };

		this.velUniforms = this.vel.material.uniforms;

		this.velUniforms.uTime = { value: globalUniforms.uTime.value };
		this.velUniforms.uDelta = { value: 0.0 };
		this.velUniforms.uSpeed = { value: 0.05 };
		this.velUniforms.uAcceleration = { value: this.acceleration.value };
		this.velUniforms.uAttraction = { value: 1 };
		this.velUniforms.uCurlSize = { value: 0.02 };
		this.velUniforms.uTimeScale = { value: 0.5 };
		this.velUniforms.uCoordsPositions = { value: this.coordsPositions };
		this.velUniforms.uCubePositions = { value: this.cubePositions };
		this.velUniforms.uCubeQuaternions = { value: this.cubeQuaternions };
		this.velUniforms.uNumCubes = { value: NUM_CUBES };
		this.velUniforms.uFluidTexture = { value: this.simulation.fbos.vel_0.texture };
		this.velUniforms.uRigPositionTexture = { value: new Texture() };

		const error = this.gpuCompute.init();
		if (error !== null) {
			console.error(error);
		}
	}

	fluidSim() {
		this.simulation = new Simulation();

		this.material = new MeshBasicMaterial({
			map: this.simulation.fbos.vel_0.texture,
			// map: new Texture(),
			fog: false,
		});

		const mesh = new Mesh(new PlaneGeometry(1.6, 0.9), this.material);
		// app.webgl.scene.add(mesh);
		mesh.position.x = 2;
		mesh.position.y = 1;
	}

	onResize() {
		this.simulation.resize();
	}

	onRender({ dt }) {
		RigCoords.update();
		this.simulation.update();

		this.posUniforms.uFluidTexture.value = this.simulation.fbos.vel_0.texture;
		this.velUniforms.uFluidTexture.value = this.simulation.fbos.vel_0.texture;

		let deltaRatio = 60 * dt;
		deltaRatio = Math.min(deltaRatio, 0.6);

		this.posUniforms.uDelta.value = deltaRatio;
		this.velUniforms.uAcceleration.value = this.acceleration.value;
		this.posUniforms.uAcceleration.value = this.acceleration.value;

		if (app.webgl.scene.avatar.vertexStore.positionMap) {
			this.posUniforms.uRigPositionTexture.value = app.webgl.scene.avatar.vertexStore.positionMap;
			this.velUniforms.uRigPositionTexture.value = app.webgl.scene.avatar.vertexStore.positionMap;
		}

		this.coordsPositions.lerp(this.tempCoordsPositions.set(this.coords.x, this.coords.y + 1, this.coords.z), 0.1);
	}

	onEnergyChanged(energy) {
		this.posUniforms.uDieSpeed.value = 0.04 - 0.03 * energy;
	}
}
