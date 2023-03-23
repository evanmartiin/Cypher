import { AmbientLight, Fog, Group, IcosahedronGeometry, Mesh, MeshStandardMaterial, PointLight, Scene } from 'three';
import FluidSimulation from '@Webgl/Objects/FluidSim/FluidSimulation.js';
import { Ground } from '@Webgl/Objects/Ground.js';
import { computeEnvmap } from '@utils/misc.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { Avatar } from './Objects/Avatar.js';
import { Particles } from './Objects/Particles.js';
import { Skeleton } from './Objects/Skeleton.js';

class MainScene extends Scene {
	constructor() {
		super();
		state.register(this);

		this.avatar = new Avatar();
		this.add(this.avatar);
		this.avatar.visible = false;
		this.skeleton = new Skeleton();
		this.add(this.skeleton);
	}

	onAttach() {
		this.addLight();
		this.addGround();
		// this.addParticles();
		this.addFog();
		this.fluidSimulation();

		// this.environment = computeEnvmap(app.webgl.renderer, app.core.assetsManager.get('envmap'), false);

		// app.debug?.mapping.add(this, 'Scene');
	}

	addLight() {
		const light = new PointLight('#ffffff', 1);
		light.position.set(5, 5, -3);
		this.add(light);
	}
	addGround() {
		const reflector = new Ground();
		this.add(reflector);
	}

	// addParticles() {
	// 	const particles = new Particles(128);
	// 	// this.add(particles);
	// }
	addFog() {
		const fog = new Fog('#000000', 5, 9);
		this.fog = fog;
	}

	fluidSimulation() {
		this.mesh = new FluidSimulation();
	}
}

export { MainScene };
