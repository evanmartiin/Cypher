import { Group, MeshStandardMaterial, MirroredRepeatWrapping } from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import fragmentShader from '@Webgl/Materials/Environment/fragment.fs';
import vertexShader from '@Webgl/Materials/Environment/vertex.vs';
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

		const pixelSortingTexture = app.core.assetsManager.get('pixelSorting');
		pixelSortingTexture.wrapS = MirroredRepeatWrapping;
		pixelSortingTexture.wrapT = MirroredRepeatWrapping;

		const glitchTexture = app.core.assetsManager.get('glitch');
		glitchTexture.wrapS = MirroredRepeatWrapping;
		glitchTexture.wrapT = MirroredRepeatWrapping;

		const logoTexture = app.core.assetsManager.get('logo');
		logoTexture.flipY = false;

		const uvs = app.core.assetsManager.get('sceneTex').children[0].geometry.getAttribute('uv').array;
		console.log(uvs);

		const material = new CustomShaderMaterial({
			baseMaterial: MeshStandardMaterial,
			fragmentShader: fragmentShader,
			vertexShader: vertexShader,
			uniforms: {
				...globalUniforms,
				uPixelSortingTexture: { value: pixelSortingTexture },
				uGlitchTexture: { value: glitchTexture },
				aNewUvs: { value: uvs },
				uLogoTexture: { value: logoTexture },
			},
			map: sceneBase,
			normalMap: sceneNormal,
			roughnessMap: sceneRoughness,
			aoMap: sceneAo,
			metalness: 0.01,
			roughness: 0.99,
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
