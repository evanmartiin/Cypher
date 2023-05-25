import { Group, MeshStandardMaterial } from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import fragmentShader from '@Webgl/Materials/Environment/fragment.fs';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class Environment extends Group {
	constructor() {
		super();
		state.register(this);

		this._material = this._createMaterial();
		this._mesh = this._createMesh();
	}

	onAttach() {
		app.debug?.mapping.add(this, 'Environment');
	}

	_createMaterial() {
		const sceneBase = app.core.assetsManager.get('sceneBase');
		sceneBase.flipY = false;
		const sceneNormal = app.core.assetsManager.get('sceneNormal');
		sceneNormal.flipY = false;
		const sceneRoughness = app.core.assetsManager.get('sceneRoughness');
		sceneRoughness.flipY = false;

		const sceneAo = app.core.assetsManager.get('sceneAo');
		sceneAo.flipY = false;

		const material = new CustomShaderMaterial({
			baseMaterial: MeshStandardMaterial,
			fragmentShader: fragmentShader,
			uniforms: {
				...globalUniforms,
			},
			map: sceneBase,
			normalMap: sceneNormal,
			roughnessMap: sceneRoughness,
			aoMap: sceneAo,
			metalness: 0.4,
			roughness: 0.8,
		});

		return material;
	}

	_createMesh() {
		const mesh = app.core.assetsManager.get('scene');

		mesh.traverse((o) => {
			o.material = this._material;
		});
		mesh.rotation.y = Math.PI * 0.15;
		mesh.position.z = 0.35;
		app.webgl.scene.add(mesh);

		return mesh;
	}
}
