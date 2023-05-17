import { AmbientLight, Color, Fog, Group, IcosahedronGeometry, Mesh, MeshNormalMaterial, MeshStandardMaterial, PlaneGeometry, PointLight, Scene } from 'three';
import Environment from '@Webgl/Objects/Environment.js';
import { GroundReflector } from '@Webgl/Objects/GroundReflector.js';
import { state } from '@scripts/State.js';
import { Avatar } from './Objects/Avatar.js';
import { Particles } from './Objects/Particles.js';
import { Skeleton } from './Objects/Skeleton.js';
import { VolumetricSpots } from './Objects/VolumetricSpots.js';

class MainScene extends Scene {
	constructor() {
		super();
		state.register(this);

		this.avatar = new Avatar();

		console.log(this.avatar);
		this.add(this.avatar);
		this.skeleton = new Skeleton();
		this.add(this.skeleton);
	}

	onAttach() {
		this.addLights();
		this.addSpotLights();
		this.addGroundReflector();
		this.addEnvironment();
		this.addParticles();
		// this.fluidSimulation();
		this.addFog();
		// this.environment = computeEnvmap(app.webgl.renderer, app.core.assetsManager.get('envmap'), false);
		// app.debug?.mapping.add(this, 'Scene');
	}

	addLights() {
		const lightLeft = new PointLight('#f0f0a0', 0.1);
		lightLeft.position.set(-5, 5, 0);

		const lightRight = new PointLight('#f0f0a0', 0.1);
		lightRight.position.set(5, 5, 0);

		const lightTop = new PointLight('#ffffff', 0.1);
		lightTop.position.set(0, 5, 0);

		this.add(lightLeft, lightRight, lightTop);
	}

	addSpotLights() {
		const spotLights = new VolumetricSpots();
		this.add(spotLights);
	}

	addGroundReflector() {
		const groundReflector = new GroundReflector();
		groundReflector.position.y = 0.01;
		this.add(groundReflector);
	}

	addEnvironment() {
		const environment = new Environment();
		this.add(environment);
	}

	addParticles() {
		const particles = new Particles(256);
		this.add(particles);
	}
	addFog() {
		const fog = new Fog('#ff0000', 0, 50);
		// this.fog = fog;
	}

	// fluidSimulation() {
	// 	this.mesh = new FluidSimulation();
	// }
}

export { MainScene };
