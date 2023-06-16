import gsap from 'gsap';
import { AmbientLight, Color, Fog, Group, IcosahedronGeometry, Mesh, MeshNormalMaterial, MeshStandardMaterial, PlaneGeometry, PointLight, Scene, ShaderChunk } from 'three';
import Environment from '@Webgl/Objects/Environment.js';
import { GroundReflector } from '@Webgl/Objects/GroundReflector.js';
import RigCoords from '@utils/RigCoords.js';
import { globalUniforms } from '@utils/globalUniforms.js';
import { state } from '@scripts/State.js';
import { Avatar } from './Objects/Avatar.js';
import { AvatarDemo } from './Objects/AvatarDemo.js';
import CounterAnimation from './Objects/CounterAnimation.js';
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
		this.avatarDemo = new AvatarDemo();
		this.add(this.avatarDemo);
		this.skeleton = new Skeleton();
		// this.add(this.skeleton);
		// this.crowd = new Crowd();
		// this.add(this.crowd);
	}

	onAttach() {
		this._lights = this.addLights();
		// this.addSpotLights();
		this._groundReeflector = this.addGroundReflector();
		this._environment = this.addEnvironment();
		this._particles = this.addParticles();
		this._fog = this.addFog();
		this._counterAnimation = this.addCounterAnimation();
		this._transitionTimeline = this.setTransitionTimeline();

		// document.addEventListener('click', () => {
		// 	this._transitionTimeline.restart();
		// });
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

	setTransitionTimeline() {
		const timeline = gsap.timeline({ paused: true });

		timeline.to(globalUniforms.uTransitionProgress, { duration: 2.5, value: 0.75 }, 0);
		timeline.to(globalUniforms.uSwitchTransition, { duration: 0, value: false }, 2);
		timeline.to(
			globalUniforms.uTransitionColor.value,
			{ r: globalUniforms.uTransitionColor.value.r, g: globalUniforms.uTransitionColor.value.g, b: globalUniforms.uTransitionColor.value.b, duration: 0 },
			0,
		);

		timeline.to(
			this._lights._lights.light1.color,
			{ r: this._lights._lights.light1.color.r, g: this._lights._lights.light1.color.g, b: this._lights._lights.light1.color.b, duration: 0 },
			0,
		);
		timeline.to(
			this._lights._lights.light2.color,
			{ r: this._lights._lights.light2.color.r, g: this._lights._lights.light2.color.g, b: this._lights._lights.light2.color.b, duration: 0 },
			0,
		);
		timeline.to(
			this._lights._lights.light3.color,
			{ r: this._lights._lights.light3.color.r, g: this._lights._lights.light3.color.g, b: this._lights._lights.light3.color.b, duration: 0 },
			0,
		);

		timeline.to(this._lights._lights.light1, { intensity: this._lights._lights.light1.intensity, duration: 0 }, 0);
		timeline.to(this._lights._lights.light2, { intensity: this._lights._lights.light2.intensity, duration: 0 }, 0);
		timeline.to(this._lights._lights.light3, { intensity: this._lights._lights.light3.intensity, duration: 0 }, 0);

		// timeline.to(this._environment._material, { metalness: 1.0, roughness: 0.5, duration: 2.75 }, 0);
		timeline.to(globalUniforms.uTransitionProgress, { duration: 2.75, value: -1.35 }, 2);

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
