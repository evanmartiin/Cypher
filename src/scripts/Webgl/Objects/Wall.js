import { CylinderGeometry, Group, Mesh, MeshNormalMaterial, MeshStandardMaterial, PlaneGeometry, RepeatWrapping } from 'three';
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

		const repeat = 5;

		const normalMap = app.core.assetsManager.get('normalWall');
		normalMap.wrapS = RepeatWrapping;
		normalMap.wrapT = RepeatWrapping;
		normalMap.repeat.x = repeat;
		normalMap.repeat.y = repeat;

		const roughnessMap = app.core.assetsManager.get('roughnessWall');
		roughnessMap.wrapS = RepeatWrapping;
		roughnessMap.wrapT = RepeatWrapping;
		roughnessMap.repeat.x = repeat;
		roughnessMap.repeat.y = repeat;

		const baseMap = app.core.assetsManager.get('baseWall');
		baseMap.wrapS = RepeatWrapping;
		baseMap.wrapT = RepeatWrapping;
		baseMap.repeat.x = repeat;
		baseMap.repeat.y = repeat;

		const aoMap = app.core.assetsManager.get('aoWall');
		baseMap.wrapS = RepeatWrapping;
		baseMap.wrapT = RepeatWrapping;
		baseMap.repeat.x = repeat;
		baseMap.repeat.y = repeat;

		const material = new MeshStandardMaterial({
			metalness: 0.5,
			roughness: 0.5,
			// envMap: app.core.assetsManager.get('envmap'),
			// normalMap: normalMap,
			// roughnessMap: roughnessMap,
			// map: baseMap,
			// aoMap: aoMap,
		});

		const gltf = app.core.assetsManager.get('scene');

		gltf.traverse((o) => {
			console.log(o.name);
			if (o.name === 'BandeDown') {
				console.log(o.name);
				o.material = material;
			}
			if (o.name === 'BandeUp') {
				console.log(o.name);
				o.material = material;
			}
			if (o.name === 'sol') {
				console.log(o.name);
				o.material = material;
			}
		});
		app.webgl.scene.add(gltf);
		// gltf.scale.set(0.5, 0.5, 0.5);

		const mesh = new Mesh(geometry, material);
		const scaleX = 3;
		const scaleY = scaleX * 0.81;
		mesh.position.set(0, scaleY * 0.5, -5);
		mesh.scale.set(3, 3, 1);
		// app.webgl.scene.add(mesh);
	}
}
