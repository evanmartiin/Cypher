import { AmbientLight, Color, Fog, Group, IcosahedronGeometry, Mesh, MeshNormalMaterial, MeshStandardMaterial, PlaneGeometry, PointLight, Scene } from 'three';
import Environment from '@Webgl/Objects/Environment.js';
import { Ground } from '@Webgl/Objects/Ground.js';
import { state } from '@scripts/State.js';
import { Avatar } from './Objects/Avatar.js';
import { AvatarDemo } from './Objects/AvatarDemo.js';
import { Crowd } from './Objects/Crowd.js';
import { Particles } from './Objects/Particles.js';
import { Skeleton } from './Objects/Skeleton.js';

class MainScene extends Scene {
	constructor() {
		super();
		state.register(this);

		this.avatar = new Avatar();
		this.add(this.avatar);
		this.avatarDemo = new AvatarDemo();
		this.add(this.avatarDemo);
		this.skeleton = new Skeleton();
		this.add(this.skeleton);
		// this.crowd = new Crowd();
		// this.add(this.crowd);
	}

	onAttach() {
		this.addLight();
		this.addGround();
		this.addEnvironment();
		this.addParticles();
		// this.fluidSimulation();
		this.addFog();
		// this.environment = computeEnvmap(app.webgl.renderer, app.core.assetsManager.get('envmap'), false);
		// app.debug?.mapping.add(this, 'Scene');
	}

	addLight() {
		const lightLeft = new PointLight('#f0f0a0', 0.15);
		lightLeft.position.set(-5, 5, 0);

		const lightRight = new PointLight('#f0f0a0', 0.15);
		lightRight.position.set(5, 5, 0);

		const lightTop = new PointLight('#ffffff', 0.15);
		lightTop.position.set(0, 5, 0);

		this.add(lightLeft, lightRight, lightTop);
	}
	addGround() {
		const groundReflector = new Ground();
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
