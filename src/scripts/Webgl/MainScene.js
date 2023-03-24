import { AmbientLight, Color, Fog, Group, IcosahedronGeometry, Mesh, MeshNormalMaterial, MeshStandardMaterial, PlaneGeometry, PointLight, Scene } from 'three';
import FluidSimulation from '@Webgl/Objects/FluidSim/FluidSimulation.js';
import { Ground } from '@Webgl/Objects/Ground.js';
import { computeEnvmap } from '@utils/misc.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { Avatar } from './Objects/Avatar.js';
import { BaseGround } from './Objects/BaseGround.js';
import { Particles } from './Objects/Particles.js';
import { Skeleton } from './Objects/Skeleton.js';

class MainScene extends Scene {
	constructor() {
		super();
		state.register(this);

		this.avatar = new Avatar();
		this.add(this.avatar);
		this.skeleton = new Skeleton();
		this.add(this.skeleton);
	}

	onAttach() {
		this.addLight();
		this.addGround();
		// this.addParticles();
		this.fluidSimulation();
		this.addFog();
		// this.environment = computeEnvmap(app.webgl.renderer, app.core.assetsManager.get('envmap'), false);
		// app.debug?.mapping.add(this, 'Scene');
	}

	addLight() {
		const light = new PointLight('#ffffff', 1);
		// light.shadow.mapSize.width = 2048;
		// light.shadow.mapSize.height = 2048;
		// light.shadow.radius = 5;
		// light.castShadow = true;
		light.position.set(0, 10, 0);
		this.add(light);
	}
	addGround() {
		const groundReflector = new Ground();
		this.add(groundReflector);
		const groundShadow = new BaseGround();
		// this.add(groundShadow);
	}

	// addParticles() {
	// 	const particles = new Particles(128);
	// 	// this.add(particles);
	// }
	addFog() {
		const fog = new Fog('#110A18', 5, 12);
		// this.fog = fog;
	}

	fluidSimulation() {
		this.mesh = new FluidSimulation();
	}
}

export { MainScene };
