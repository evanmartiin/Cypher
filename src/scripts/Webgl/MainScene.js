import { AmbientLight, Color, Fog, Group, IcosahedronGeometry, Mesh, MeshNormalMaterial, MeshStandardMaterial, PlaneGeometry, PointLight, Scene, ShaderChunk } from 'three';
import Environment from '@Webgl/Objects/Environment.js';
import { GroundReflector } from '@Webgl/Objects/GroundReflector.js';
import RigCoords from '@utils/RigCoords.js';
import { state } from '@scripts/State.js';
import { Avatar } from './Objects/Avatar.js';
import { AvatarDemo } from './Objects/AvatarDemo.js';
import { Crowd } from './Objects/Crowd.js';
import { CustomFog } from './Objects/CustomFog.js';
import FluidSimulation from './Objects/FluidSim/FluidSimulation.js';
import RigCoordsFluid from './Objects/FluidSim/RigCoordsFluid.js';
import { Lights } from './Objects/Lights.js';
import { Particles } from './Objects/Particles.js';
import { Skeleton } from './Objects/Skeleton.js';
import { VolumetricSpots } from './Objects/VolumetricSpots.js';

class MainScene extends Scene {
	constructor() {
		super();
		state.register(this);

		this.avatar = new Avatar();
		this.add(this.avatar);
		// this.avatarDemo = new AvatarDemo();
		// this.add(this.avatarDemo);
		this.skeleton = new Skeleton();
		// this.add(this.skeleton);
		// this.crowd = new Crowd();
		// this.add(this.crowd);
	}

	onAttach() {
		this.addLights();
		// this.addSpotLights();
		this.addGroundReflector();
		this.addEnvironment();
		this.addParticles();
		// this.addFog();
	}

	addLights() {
		const lights = new Lights();
		this.add(lights);
	}

	addSpotLights() {
		const spotLights = new VolumetricSpots();
		this.add(spotLights);
	}

	addGroundReflector() {
		const groundReflector = new GroundReflector();
		groundReflector.position.y = 0.01;
		// groundReflector.rotation.y = Math.PI * 0.35;
		// groundReflector.position.z = 15;
		this.add(groundReflector);
	}

	addEnvironment() {
		const environment = new Environment();
		this.add(environment);
	}

	addParticles() {
		this.leftHandParticles = new Particles(256, RigCoordsFluid.coords, RigCoords.leftWristSpeed);
		// const rightHandParticles = new Particles(256, RigCoords.rightWrist, RigCoords.rightWristSpeed);
		// const leftFootParticles = new Particles(256, RigCoords.leftFoot, RigCoords.leftFootSpeed);
		// const rightFootParticles = new Particles(256, RigCoords.rightFoot, RigCoords.rightFootSpeed);

		// this.add(leftHandParticles);
		// this.add(rightHandParticles, leftHandParticles);
		// this.add(this.leftHandParticles);
	}
	addFog() {
		const customFog = new CustomFog();
		this.fog = customFog._fog;
	}

	onRender() {
		RigCoords.update();
		RigCoordsFluid.update();
	}

	// fluidSimulation() {
	// 	this.mesh = new FluidSimulation();
	// }
}

export { MainScene };
