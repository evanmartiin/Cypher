import gsap from 'gsap';
import { Scene } from 'three';
import { UI_IDS, UI_POOL_IDS } from '@Core/audio/AudioManager.js';
import Environment from '@Webgl/Objects/Environment.js';
import { GroundReflector } from '@Webgl/Objects/GroundReflector.js';
import RigCoords from '@utils/RigCoords.js';
import ENVIRONMENTS from '@utils/environments.json';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { Avatar } from './Objects/Avatar.js';
import { AvatarDemo } from './Objects/AvatarDemo.js';
import { Carpet } from './Objects/Carpet.js';
import CounterAnimation from './Objects/CounterAnimation.js';
import { CustomFog } from './Objects/CustomFog.js';
import { FreestyleParticles } from './Objects/FreestyleParticles/Particles.js';
import { Lights } from './Objects/Lights.js';
import MaskOverlay from './Objects/MaskOverlay.js';
import { Particles } from './Objects/Particles/Particles.js';
import { Reactions } from './Objects/Reactions.js';
import { Title } from './Objects/Title.js';
import { VolumetricSpots } from './Objects/VolumetricSpots.js';

class MainScene extends Scene {
	constructor() {
		super();
		state.register(this);

		this.avatar = new Avatar();

		this.avatarDemo = new AvatarDemo();
		this.add(this.avatarDemo);

		this.carpet = new Carpet();
		this.add(this.carpet);

		this.title = new Title();
		this.add(this.title);

		this.reactions = new Reactions();
		this.add(this.reactions);
	}

	onAttach() {
		this._lights = this.addLights();
		// this.addSpotLights();
		this._groundReflector = this.addGroundReflector();
		this._environment = this.addEnvironment();
		this._particles = this.addParticles();
		this.addFreestyleParticles();
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
		const particle = new Particles(256);
		this.add(particle);

		return particle;
	}

	addFreestyleParticles() {
		this.leftHandParticles = new FreestyleParticles(256, RigCoords.leftWrist, RigCoords.leftWristSpeed);
		this.leftHandParticles.position.x = -1;
		this.rightHandParticles = new FreestyleParticles(256, RigCoords.rightWrist, RigCoords.rightWristSpeed);
		this.rightHandParticles.position.x = 1;

		this.add(this.leftHandParticles, this.rightHandParticles);
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
		globalUniforms.uTransitionColor.value.r = this.environments[this.currentEnv].light1.color.r;
		globalUniforms.uTransitionColor.value.r = this.environments[this.currentEnv].light1.color.r;
		globalUniforms.uTransitionColor.value.r = this.environments[this.currentEnv].light1.color.r;

		this.currentEnv++;
		this.currentEnv = this.currentEnv % this.environments.length;

		app.core.audio.playUiRandom(UI_POOL_IDS.TRANSITION_MC);
		app.core.audio.playUI(UI_IDS.TRANSITION_SCENE);
		app.core.audio.playUI(UI_IDS.PUBLIC_TRANSITION);

		const timeline = gsap.timeline();
		timeline.then(() => {
			timeline.kill();
		});

		timeline.to(
			globalUniforms.uTransitionColor.value,
			{
				r: this.environments[this.currentEnv].light1.color.r,
				g: this.environments[this.currentEnv].light1.color.g,
				b: this.environments[this.currentEnv].light1.color.b,
				duration: 2.5,
			},
			0,
		);
		timeline.to(globalUniforms.uTransitionProgress, { duration: 2.5, value: 1 }, 0);
		timeline.to(this._maskOverlay._mesh.material.uniforms.uOpacity, { duration: 1.25, value: 0.75 }, 0);
		timeline.to(globalUniforms.uSwitchTransition, { duration: 0, value: false }, 2);

		timeline.to(
			this._lights._lights.light1.color,
			{ r: this.environments[this.currentEnv].light1.color.r, g: this.environments[this.currentEnv].light1.color.g, b: this.environments[this.currentEnv].light1.color.b, duration: 2.5 },
			1.25,
		);
		timeline.to(
			this._lights._lights.light2.color,
			{ r: this.environments[this.currentEnv].light2.color.r, g: this.environments[this.currentEnv].light2.color.g, b: this.environments[this.currentEnv].light2.color.b, duration: 2.5 },
			1.25,
		);
		timeline.to(
			this._lights._lights.light3.color,
			{ r: this.environments[this.currentEnv].light3.color.r, g: this.environments[this.currentEnv].light3.color.g, b: this.environments[this.currentEnv].light3.color.b, duration: 2.5 },
			1.25,
		);

		timeline.to(this._lights._lights.light1, { intensity: this.environments[this.currentEnv].light1.intensity, duration: 2.5 }, 0);
		timeline.to(this._lights._lights.light2, { intensity: this.environments[this.currentEnv].light2.intensity, duration: 2.5 }, 0);
		timeline.to(this._lights._lights.light3, { intensity: this.environments[this.currentEnv].light3.intensity, duration: 2.5 }, 0);

		// timeline.to(this._environment._material, { metalness: 0.5, roughness: 0.5, duration: 2.75 }, 0);
		timeline.to(globalUniforms.uTransitionProgress, { duration: 2.75, value: -1.35 }, 2);
		timeline.to(this._maskOverlay._mesh.material.uniforms.uOpacity, { duration: 2.75, value: 0 }, 2);

		return timeline;
	}

	onRender() {
		RigCoords.update();
	}

	// fluidSimulation() {
	// 	this.mesh = new FluidSimulation();
	// }
}

export { MainScene };
