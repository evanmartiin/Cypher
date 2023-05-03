import {
	CylinderGeometry,
	DoubleSide,
	Group,
	Mesh,
	MeshNormalMaterial,
	MeshStandardMaterial,
	MeshToonMaterial,
	MirroredRepeatWrapping,
	PlaneGeometry,
	RepeatWrapping,
	ShaderMaterial,
	Vector2,
} from 'three';
import { Reflector } from '@utils/Reflector.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class Wall extends Group {
	constructor() {
		super();
		state.register(this);
		this.init();
	}

	init() {
		const ang_rad = (app.webgl.camera.fov * Math.PI) / 180;
		const fov_y = app.webgl.camera.position.z * Math.tan(ang_rad / 2) * 2;

		const geometry = new PlaneGeometry(fov_y * app.webgl.camera.aspect, fov_y, 1, 1);

		const repeat = 15;

		const normalMap = app.core.assetsManager.get('normalWall');
		normalMap.wrapS = MirroredRepeatWrapping;
		normalMap.wrapT = MirroredRepeatWrapping;
		normalMap.repeat.x = repeat;
		normalMap.repeat.y = repeat;

		const roughnessMap = app.core.assetsManager.get('roughnessWall');
		roughnessMap.wrapS = MirroredRepeatWrapping;
		roughnessMap.wrapT = MirroredRepeatWrapping;
		roughnessMap.repeat.x = repeat;
		roughnessMap.repeat.y = repeat;

		const baseMap = app.core.assetsManager.get('test3');
		baseMap.wrapS = MirroredRepeatWrapping;
		baseMap.wrapT = MirroredRepeatWrapping;
		baseMap.repeat.x = 2;
		baseMap.repeat.y = 2;

		const aoMap = app.core.assetsManager.get('aoWall');
		aoMap.wrapS = MirroredRepeatWrapping;
		aoMap.wrapT = MirroredRepeatWrapping;
		aoMap.repeat.x = repeat;
		aoMap.repeat.y = repeat;

		const material = new MeshStandardMaterial({
			metalness: 0.5,
			roughness: 0.9,
			// envMap: app.core.assetsManager.get('envmap'),
			normalMap: normalMap,
			roughnessMap: roughnessMap,
			aoMap: aoMap,
			normalScale: new Vector2(1, 1),
			map: baseMap,
			side: DoubleSide,
		});

		// const gltf = app.core.assetsManager.get('scene');

		// gltf.traverse((o) => {
		// 	console.log(o.name);
		// 	if (o.name === 'BandeDown') {
		// 		o.material = new MeshToonMaterial();
		// 	}
		// 	if (o.name === 'BandeUp') {
		// 		o.material = material;
		// 	}
		// 	if (o.name === 'Ground') {
		// 		o.visible = false;
		// 	}
		// 	if (o.name === 'SceneLeft') {
		// 		o.material = new ShaderMaterial();
		// 		o.visible = false;
		// 	}
		// 	if (o.name === 'Ceiling') {
		// 		// o.material = new ShaderMaterial({ side: DoubleSide });
		// 	}
		// });
		// app.webgl.scene.add(gltf);

		const back = new Mesh(geometry, material);
		const scaleX = 3;
		const scaleY = scaleX * 0.81;
		back.position.set(0, 4, -10);
		back.scale.set(2.5, 2.5, 1);

		const left = back.clone();
		left.rotation.y = Math.PI * 0.5;
		left.position.set(-8, 4, -2);

		const right = back.clone();
		right.rotation.y = -Math.PI * 0.5;
		right.position.set(8, 4, -2);

		app.webgl.scene.add(back, left, right);
		// app.webgl.scene.add(back);
	}
}
