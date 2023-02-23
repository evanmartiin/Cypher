import { AmbientLight, Group, IcosahedronGeometry, Mesh, MeshStandardMaterial, PointLight, Scene } from 'three';
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

		this.add(new AmbientLight(0xffffff, 0.5));

		this.avatar = new Avatar();
		this.add(this.avatar);
		this.skeleton = new Skeleton();
		this.add(this.skeleton);
	}

	onAttach() {
		this.addLight();
		this.addGround();
		this.addParticles();
		this.addObjects();

		this.environment = computeEnvmap(app.webgl.renderer, app.core.assetsManager.get('envmap'), false);

		app.debug?.mapping.add(this, 'Scene');
	}

	addLight() {
		const light = new PointLight('#ffffff', 1.5);
		light.position.set(2, 8, 0);
		this.add(light);
	}
	addGround() {
		const reflector = new Ground();
		this.add(reflector);
	}

	addObjects() {
		const group = new Group();
		const m = new Mesh(new IcosahedronGeometry(1, 0), new MeshStandardMaterial({ roughness: 0.2, metalness: 0.5 }));
		for (let index = 0; index < 100; index++) {
			this.sphere = m.clone();
			this.sphere.position.x = Math.random() * 15 - 7.5;
			this.sphere.position.y = Math.abs(Math.random() * 15 - 7.5);
			this.sphere.position.z = Math.random() * 15 - 7.5;
			const rand = Math.random() + 0.2;
			this.sphere.scale.set(rand, rand, rand);
			group.add(this.sphere);
		}
		this.add(group);
	}

	addParticles() {
		// const particles = new Particles(200);
		// this.add(particles);
	}
}

export { MainScene };
