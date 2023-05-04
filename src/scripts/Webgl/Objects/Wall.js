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
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import fragmentShader from '@Webgl/Materials/Wall/fragment.fs';
import vertexShader from '@Webgl/Materials/Wall/vertex.vs';
import { globalUniforms } from '@utils/globalUniforms.js';
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

		const repeat = 2;

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
		baseMap.repeat.x = 1;
		baseMap.repeat.y = 1;

		const aoMap = app.core.assetsManager.get('aoWall');
		aoMap.wrapS = MirroredRepeatWrapping;
		aoMap.wrapT = MirroredRepeatWrapping;
		aoMap.repeat.x = repeat;
		aoMap.repeat.y = repeat;

		const backMaterial = new CustomShaderMaterial({
			baseMaterial: MeshStandardMaterial,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				...globalUniforms,
				uMap: { value: baseMap },
			},
			metalness: 0.5,
			roughness: 0.8,
			envMap: app.core.assetsManager.get('envmap'),
			// map: baseMap,
			normalMap: normalMap,
			roughnessMap: roughnessMap,
			aoMap: aoMap,
			normalScale: new Vector2(0.9, 0.9),
			side: DoubleSide,
		});

		const repeatTop = 1;

		const normalTopMap = app.core.assetsManager.get('normalTop');
		normalTopMap.wrapS = MirroredRepeatWrapping;
		normalTopMap.wrapT = MirroredRepeatWrapping;
		normalTopMap.repeat.x = repeatTop * 2;
		normalTopMap.repeat.y = repeatTop;

		const roughnessTopMap = app.core.assetsManager.get('roughnessTop');
		roughnessTopMap.wrapS = MirroredRepeatWrapping;
		roughnessTopMap.wrapT = MirroredRepeatWrapping;
		roughnessTopMap.repeat.x = repeatTop * 2;
		roughnessTopMap.repeat.y = repeatTop;

		const baseTopMap = app.core.assetsManager.get('baseTop');
		baseTopMap.wrapS = MirroredRepeatWrapping;
		baseTopMap.wrapT = MirroredRepeatWrapping;
		baseTopMap.repeat.x = repeatTop * 2;
		baseTopMap.repeat.y = repeatTop;

		const aoTopMap = app.core.assetsManager.get('baseTop');
		aoTopMap.wrapS = MirroredRepeatWrapping;
		aoTopMap.wrapT = MirroredRepeatWrapping;
		aoTopMap.repeat.x = repeatTop * 2;
		aoTopMap.repeat.y = repeatTop;

		const topMaterial = new MeshStandardMaterial({
			metalness: 0.7,
			roughness: 0.5,
			envMap: app.core.assetsManager.get('envmap'),
			normalMap: normalTopMap,
			roughnessMap: roughnessTopMap,
			aoMap: aoTopMap,
			map: baseTopMap,
			normalScale: new Vector2(3, 3),
			side: DoubleSide,
			color: '#ffffff',
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

		const back = new Mesh(geometry, backMaterial);
		const scaleX = 3;
		const scaleY = scaleX * 0.81;
		back.position.set(0, 6.8, -15);
		back.scale.set(4.1, 4.1, 1);

		const left = back.clone();
		left.rotation.y = Math.PI * 0.5;
		left.position.set(-8, 4, -2);

		const right = back.clone();
		right.rotation.y = -Math.PI * 0.5;
		right.position.set(8, 4, -2);

		const top = back.clone();
		top.material = topMaterial;
		top.rotation.x = Math.PI * 0.5;
		top.position.set(0, 6, -9);

		// app.webgl.scene.add(back, left, right);
		// app.webgl.scene.add(back, top);
		app.webgl.scene.add(back);
	}
}
