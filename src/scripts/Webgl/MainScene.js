import gsap from 'gsap';
import { Scene } from 'three';
import Environment from '@Webgl/Objects/Environment.js';
import { GroundReflector } from '@Webgl/Objects/GroundReflector.js';
import RigCoords from '@utils/RigCoords.js';
import ENVIRONMENTS from '@utils/environments.json';
import { globalUniforms } from '@utils/globalUniforms.js';
import { state } from '@scripts/State.js';
import { Avatar } from './Objects/Avatar.js';
import { AvatarDemo } from './Objects/AvatarDemo.js';
import CounterAnimation from './Objects/CounterAnimation.js';
import { CustomFog } from './Objects/CustomFog.js';
import RigCoordsFluid from './Objects/FluidSim/RigCoordsFluid.js';
import { Lights } from './Objects/Lights.js';
import MaskOverlay from './Objects/MaskOverlay.js';
import { Particles } from './Objects/Particles.js';
import { VolumetricSpots } from './Objects/VolumetricSpots.js';

class MainScene extends Scene {
	constructor() {
		super();
		state.register(this);

		this.avatar = new Avatar();
		this.avatarDemo = new AvatarDemo();
		this.add(this.avatarDemo);
	}

	onAttach() {
		this._lights = this.addLights();
		// this.addSpotLights();
		this._groundReflector = this.addGroundReflector();
		this._environment = this.addEnvironment();
		this._particles = this.addParticles();
		this._fog = this.addFog();
		this._counterAnimation = this.addCounterAnimation();

		//@ts-ignore
		this.environments = ENVIRONMENTS.list;
		this.currentEnv = 0;

		this._maskOverlay = this.addMaskOverlay();
	}

	addLights() {
		const lights = new Lights();
		this.add(lights);

		return lights;
	}

	addSpotLights() {
		const spotLights = new VolumetricSpots();
		this.add(spotLights);

		return spotLights;
	}

	addGroundReflector() {
		const groundReflector = new GroundReflector();
		groundReflector.position.y = 0.01;
		this.add(groundReflector);

		return groundReflector;
	}

	addEnvironment() {
		const environment = new Environment();

		return environment;
	}

	addParticles() {
		const particle = new Particles(128, RigCoordsFluid.coords, RigCoords.leftWristSpeed);
		this.add(particle);

		return particle;
	}

	addFog() {
		const customFog = new CustomFog();
		this.fog = customFog._fog;

		return customFog;
	}

	addCounterAnimation() {
		const counterAnimation = new CounterAnimation();

		return counterAnimation;
	}

	addMaskOverlay() {
		const maskOverlay = new MaskOverlay();

		return maskOverlay;
	}

	changeEnv() {
		this.currentEnv++;
		this.currentEnv = this.currentEnv % this.environments.length;

		const timeline = gsap.timeline();
		timeline.then(() => {
			timeline.kill();
		});

		timeline.to(globalUniforms.uTransitionProgress, { duration: 2.5, value: 1 }, 0);
		timeline.to(this._maskOverlay._mesh.material.uniforms.uOpacity, { duration: 1.25, value: 0.75 }, 0);
		timeline.to(globalUniforms.uSwitchTransition, { duration: 0, value: false }, 2);
		timeline.to(
			globalUniforms.uTransitionColor.value,
			{ r: globalUniforms.uTransitionColor.value.r, g: globalUniforms.uTransitionColor.value.g, b: globalUniforms.uTransitionColor.value.b, duration: 0 },
			1.25,
		);

		timeline.to(
			this._lights._lights.light1.color,
			{ r: this.environments[this.currentEnv].light1.color.r, g: this.environments[this.currentEnv].light1.color.g, b: this.environments[this.currentEnv].light1.color.b, duration: 0 },
			1.25,
		);
		timeline.to(
			this._lights._lights.light2.color,
			{ r: this.environments[this.currentEnv].light2.color.r, g: this.environments[this.currentEnv].light2.color.g, b: this.environments[this.currentEnv].light2.color.b, duration: 0 },
			1.25,
		);
		timeline.to(
			this._lights._lights.light3.color,
			{ r: this.environments[this.currentEnv].light3.color.r, g: this.environments[this.currentEnv].light3.color.g, b: this.environments[this.currentEnv].light3.color.b, duration: 0 },
			1.25,
		);

		timeline.to(this._lights._lights.light1, { intensity: this.environments[this.currentEnv].light1.intensity, duration: 0 }, 0);
		timeline.to(this._lights._lights.light2, { intensity: this.environments[this.currentEnv].light2.intensity, duration: 0 }, 0);
		timeline.to(this._lights._lights.light3, { intensity: this.environments[this.currentEnv].light3.intensity, duration: 0 }, 0);

		timeline.to(this._environment._material, { metalness: 0.5, roughness: 0.5, duration: 2.75 }, 0);
		timeline.to(globalUniforms.uTransitionProgress, { duration: 2.75, value: -1.35 }, 2);
		timeline.to(this._maskOverlay._mesh.material.uniforms.uOpacity, { duration: 2.75, value: 0 }, 2);

		return timeline;
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
