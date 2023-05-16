import { DoubleSide, Group, MeshNormalMaterial, MeshStandardMaterial, PlaneGeometry, RepeatWrapping } from 'three';
import { Reflector } from '@utils/Reflector.js';
import { app } from '@scripts/App.js';

export class Ground extends Group {
	constructor() {
		super();
		this.createMesh();
	}

	createMesh() {
		const geometry = new PlaneGeometry(1, 1);
		const reflector = new Reflector(geometry, {
			textureWidth: 512 * window.devicePixelRatio,
			textureHeight: 512 * window.devicePixelRatio,
		});

		reflector.rotation.x = -Math.PI * 0.5;
		reflector.position.z = -1;
		const scale = 28;
		reflector.scale.set(scale, scale, 1);

		const repeat = 5;

		const normalMap = app.core.assetsManager.get('normalGround6');
		normalMap.wrapS = RepeatWrapping;
		normalMap.wrapT = RepeatWrapping;
		normalMap.repeat.x = repeat;
		normalMap.repeat.y = repeat;
		normalMap.rotation = Math.PI * 0.5;

		const roughnessMap = app.core.assetsManager.get('roughnessGround6');
		roughnessMap.wrapS = RepeatWrapping;
		roughnessMap.wrapT = RepeatWrapping;
		roughnessMap.repeat.x = repeat;
		roughnessMap.repeat.y = repeat;
		roughnessMap.rotation = Math.PI * 0.5;

		// const aoMap = app.core.assetsManager.get('aoGround3');
		// aoMap.wrapS = RepeatWrapping;
		// aoMap.wrapT = RepeatWrapping;
		// aoMap.repeat.x = repeat;
		// aoMap.repeat.y = repeat;
		// aoMap.rotation = Math.PI * 0.5;

		const baseMap = app.core.assetsManager.get('baseGround6');
		baseMap.wrapS = RepeatWrapping;
		baseMap.wrapT = RepeatWrapping;
		baseMap.repeat.x = repeat;
		baseMap.repeat.y = repeat;
		baseMap.rotation = Math.PI * 0.5;

		const material = new MeshStandardMaterial({
			transparent: true,
			normalMap: normalMap,
			roughnessMap: roughnessMap,
			// aoMap: aoMap,
			map: baseMap,
			roughness: 0.9,
			metalness: 0.5,
			side: DoubleSide,
		});

		const ground = reflector.clone();
		ground.material = material;
		ground.position.y = -0.01;
		ground.position.z = -5;

		this.add(reflector);
	}
}
