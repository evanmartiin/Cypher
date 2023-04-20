import { AmbientLight, Color, Fog, Group, IcosahedronGeometry, Mesh, MeshNormalMaterial, MeshStandardMaterial, PlaneGeometry, PointLight, Scene } from 'three';
import FluidSimulation from '@Webgl/Objects/FluidSim/FluidSimulation.js';
import { Ground } from '@Webgl/Objects/Ground.js';
import TrailSimulation from '@Webgl/Objects/TrailSim/TrailSimulation.js';
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
		this.addParticles();
		this.fluidSimulation();
		this.trailSimulation();
		this.addFog();
		// this.environment = computeEnvmap(app.webgl.renderer, app.core.assetsManager.get('envmap'), false);
		// app.debug?.mapping.add(this, 'Scene');
	}

	addLight() {
		const lightLeft = new PointLight('#0000FF', 1);
		lightLeft.position.set(-10, 10, 0);

		const lightRight = new PointLight('#FF0000', 1);
		lightRight.position.set(10, 10, 0);

		const ambientLight = new AmbientLight('#FFFFFF', 0.35);
		this.add(lightLeft, lightRight, ambientLight);
	}
	addGround() {
		const groundReflector = new Ground();
		this.add(groundReflector);
	}

	addParticles() {
		const particles = new Particles(256);
		this.add(particles);
	}
	addFog() {
		const fog = new Fog('#110A18', 5, 12);
		// this.fog = fog;
	}

	fluidSimulation() {
		this.mesh = new FluidSimulation();
	}

	trailSimulation() {
		this.mesh = new TrailSimulation();
	}
}

export { MainScene };
