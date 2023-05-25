import { Group, Mesh, MeshStandardMaterial, MirroredRepeatWrapping, PlaneGeometry, RepeatWrapping, Vector2 } from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import fragmentShader from '@Webgl/Materials/FluidSimulation/fragment.fs';
import vertexShader from '@Webgl/Materials/FluidSimulation/vertex.vs';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import RigCoords from './RigCoordsFluid.js';
import Simulation from './Simulation.js';

export default class FluidSimulation extends Group {
	constructor() {
		super();
		state.register(this);
		this.init();
	}

	init() {
		this.simulation = new Simulation();

		const ang_rad = (app.webgl.camera.fov * Math.PI) / 180;
		const fov_y = app.webgl.camera.position.z * Math.tan(ang_rad / 2) * 2;

		const geometry = new PlaneGeometry(fov_y * app.webgl.camera.aspect, fov_y, 1, 1);

		const repeat = 5;

		const normalMap = app.core.assetsManager.get('normal');
		normalMap.wrapS = RepeatWrapping;
		normalMap.wrapT = RepeatWrapping;
		normalMap.repeat.x = repeat;
		normalMap.repeat.y = repeat;

		const roughnessMap = app.core.assetsManager.get('roughness');
		roughnessMap.wrapS = RepeatWrapping;
		roughnessMap.wrapT = RepeatWrapping;
		roughnessMap.repeat.x = repeat;
		roughnessMap.repeat.y = repeat;

		// const material = new CustomShaderMaterial({
		// 	baseMaterial: MeshStandardMaterial,
		// 	vertexShader: vertexShader,
		// 	fragmentShader: fragmentShader,
		// 	uniforms: {
		// 		...globalUniforms,
		// 		velocity: {
		// 			value: this.simulation.fbos.vel_0.texture,
		// 		},
		// 		boundarySpace: {
		// 			value: new Vector2(),
		// 		},
		// 	},
		// 	transparent: true,
		// 	metalness: 0.1,
		// 	roughness: 0.9,
		// 	normalMap: normalMap,
		// 	normalScale: new Vector2(0.0, 0.0),
		// 	roughnessMap: roughnessMap,
		// 	envMap: app.core.assetsManager.get('envmap'),
		// });
		const material = new MeshStandardMaterial({
			metalness: 0.4,
			roughness: 0.6,
			envMap: app.core.assetsManager.get('envmap'),
		});

		const mesh = new Mesh(geometry, material);
		const scaleX = 3;
		const scaleY = scaleX * 0.81;
		mesh.position.set(0, scaleY * 0.5, -5);
		mesh.scale.set(scaleX, scaleY, 1);
		app.webgl.scene.add(mesh);
	}

	onResize() {
		this.simulation.resize();
	}

	onRender() {
		RigCoords.update();
		this.simulation.update();
		app.webgl.renderer.setRenderTarget(null);
		app.webgl.renderer.render(app.webgl.scene, app.webgl.camera);
	}
}
