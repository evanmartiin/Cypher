import { AmbientLight, Color, Fog, Group, IcosahedronGeometry, Mesh, MeshNormalMaterial, MeshStandardMaterial, PlaneGeometry, PointLight, Scene } from 'three';
import { Ground } from '@Webgl/Objects/Ground.js';
import Wall from '@Webgl/Objects/Wall.js';
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
		this.skeleton = new Skeleton();
		this.add(this.skeleton);
	}

	onAttach() {
		this.addLight();
		this.addGround();
		this.addWall();
		this.addParticles();
		// this.fluidSimulation();
		this.addFog();
		// this.environment = computeEnvmap(app.webgl.renderer, app.core.assetsManager.get('envmap'), false);
		// app.debug?.mapping.add(this, 'Scene');
	}

	addLight() {
		const lightLeft = new PointLight('#0000FF', 0.3);
		lightLeft.position.set(-5, 15, 0);

		const lightRight = new PointLight('#ff0000', 0.3);
		lightRight.position.set(5, 15, 0);

		const lightTop = new PointLight('#ffffff', 0.3);
		lightTop.position.set(0, 15, 0);

		this.add(lightLeft, lightRight, lightTop);
	}
	addGround() {
		const groundReflector = new Ground();
		this.add(groundReflector);
	}

	addWall() {
		const wall = new Wall();
		this.add(wall);
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
