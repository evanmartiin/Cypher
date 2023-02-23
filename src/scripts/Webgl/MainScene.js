import { AmbientLight, Group, IcosahedronGeometry, Mesh, MeshStandardMaterial, PointLight, Scene } from 'three';
import { Ground } from '@Webgl/Objects/Ground.js';
import { computeEnvmap } from '@utils/misc.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { Avatar } from './Objects/Avatar.js';
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

		const light = new PointLight('#ffffff', 1);
		light.position.set(20, 50, -25);
		this.add(light);
		const light2 = new PointLight('#ffffff', 1);
		light2.position.set(-20, 50, -25);
		this.add(light2);

		this.environment = computeEnvmap(app.webgl.renderer, app.core.assetsManager.get('envmap'), false);

		const reflector = new Ground();
		this.add(reflector);

		app.debug?.mapping.add(this, 'Scene');
	}
}

export { MainScene };
