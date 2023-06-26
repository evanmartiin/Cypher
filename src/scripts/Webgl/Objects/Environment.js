import { Group, MeshNormalMaterial, MeshStandardMaterial, MirroredRepeatWrapping } from 'three';
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

		const pixelSortingTexture = app.core.assetsManager.get('pixelSorting');
		pixelSortingTexture.wrapS = MirroredRepeatWrapping;
		pixelSortingTexture.wrapT = MirroredRepeatWrapping;

		const glitchTexture = app.core.assetsManager.get('glitch');
		glitchTexture.wrapS = MirroredRepeatWrapping;
		glitchTexture.wrapT = MirroredRepeatWrapping;

		this._material = this._createMaterial(pixelSortingTexture, glitchTexture);
		this._mesh = this._createMesh(pixelSortingTexture, glitchTexture);
	}

	onAttach() {
		app.debug?.mapping.add(this, 'Environment');
	}

	_createMaterial(pixelSortingTexture, glitchTexture) {
		const sceneBase = app.core.assetsManager.get('sceneDiffuse');
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
			vertexShader: vertexShader,
			uniforms: {
				...globalUniforms,
				uPixelSortingTexture: { value: pixelSortingTexture },
				uGlitchTexture: { value: glitchTexture },
			},
			map: sceneBase,
			roughnessMap: sceneRoughness,
			normalMap: sceneNormal,
			aoMap: sceneAo,
			// metalness: 0.01,
			// roughness: 0.99,
		});

		return material;
	}

	_createMesh(pixelSortingTexture, glitchTexture) {
		const mesh = app.core.assetsManager.get('finalScene');

		mesh.traverse((o) => {
			// o.material = this._material;

			if (o.name === 'env') {
				o.material = this._material;
			}
			if (o.name === 'logo') {
				const diffuse = app.core.assetsManager.get('logoDiffuse');
				diffuse.flipY = false;
				const normal = app.core.assetsManager.get('logoNormal');
				normal.flipY = false;
				const roughness = app.core.assetsManager.get('logoRoughness');
				roughness.flipY = false;

				o.material = new CustomShaderMaterial({
					baseMaterial: MeshStandardMaterial,
					fragmentShader: fragmentShader,
					vertexShader: vertexShader,
					uniforms: {
						...globalUniforms,
						uPixelSortingTexture: { value: pixelSortingTexture },
						uGlitchTexture: { value: glitchTexture },
					},
					map: diffuse,
					transparent: true,
					// metalness: 0.6,
					// roughness: 0.4,
				});
			}
			if (o.name === 'coca') {
				o.material = new MeshNormalMaterial();
			}
			if (o.name === 'redbull') {
				o.material = new MeshNormalMaterial();
			}
			if (o.name === 'bombe') {
				const diffuse = app.core.assetsManager.get('bombeDiffuse');
				diffuse.flipY = false;
				const normal = app.core.assetsManager.get('bombeNormal');
				normal.flipY = false;

				o.material = new CustomShaderMaterial({
					baseMaterial: MeshStandardMaterial,
					fragmentShader: fragmentShader,
					vertexShader: vertexShader,
					uniforms: {
						...globalUniforms,
						uPixelSortingTexture: { value: pixelSortingTexture },
						uGlitchTexture: { value: glitchTexture },
					},
					map: diffuse,
					normalMap: normal,
					// metalness: 0.6,
					// roughness: 0.4,
				});
			}
			if (o.name === 'bombe2') {
				o.material = new MeshNormalMaterial();
			}
			if (o.name === 'ventilation') {
				o.material = new MeshNormalMaterial();
			}
			if (o.name === 'fenetre') {
				o.material = new MeshNormalMaterial();
			}
			if (o.name === 'banc') {
				const diffuse = app.core.assetsManager.get('bancDiffuse');
				diffuse.flipY = false;
				const normal = app.core.assetsManager.get('bancNormal');
				normal.flipY = false;
				const roughness = app.core.assetsManager.get('bancRoughness');
				roughness.flipY = false;
				const ao = app.core.assetsManager.get('bancAo');
				ao.flipY = false;

				o.material = new CustomShaderMaterial({
					baseMaterial: MeshStandardMaterial,
					fragmentShader: fragmentShader,
					vertexShader: vertexShader,
					uniforms: {
						...globalUniforms,
						uPixelSortingTexture: { value: pixelSortingTexture },
						uGlitchTexture: { value: glitchTexture },
					},
					map: diffuse,
					// metalness: 0.6,
					// roughness: 0.4,
				});
			}
			if (o.name === 'skate') {
				const diffuse = app.core.assetsManager.get('skateDiffuse');
				diffuse.flipY = false;
				const normal = app.core.assetsManager.get('skateNormal');
				normal.flipY = false;
				const roughness = app.core.assetsManager.get('skateRoughness');
				roughness.flipY = false;

				o.material = new CustomShaderMaterial({
					baseMaterial: MeshStandardMaterial,
					fragmentShader: fragmentShader,
					vertexShader: vertexShader,
					uniforms: {
						...globalUniforms,
						uPixelSortingTexture: { value: pixelSortingTexture },
						uGlitchTexture: { value: glitchTexture },
					},
					map: diffuse,
					// metalness: 0.6,
					// roughness: 0.4,
				});
			}
			if (o.name === 'rampe') {
				const diffuse = app.core.assetsManager.get('rampeDiffuse');
				diffuse.flipY = false;
				const normal = app.core.assetsManager.get('rampeNormal');
				normal.flipY = false;

				o.material = new CustomShaderMaterial({
					baseMaterial: MeshStandardMaterial,
					fragmentShader: fragmentShader,
					vertexShader: vertexShader,
					uniforms: {
						...globalUniforms,
						uPixelSortingTexture: { value: pixelSortingTexture },
						uGlitchTexture: { value: glitchTexture },
					},
					map: diffuse,
					normalMap: normal,
					// metalness: 0.01,
					// roughness: 0.99,
				});
			}
			if (o.name === 'compteur') {
				const diffuse = app.core.assetsManager.get('compteurDiffuse');
				diffuse.flipY = false;
				const normal = app.core.assetsManager.get('compteurNormal');
				normal.flipY = false;
				const roughness = app.core.assetsManager.get('compteurRoughness');
				roughness.flipY = false;

				o.material = new CustomShaderMaterial({
					baseMaterial: MeshStandardMaterial,
					fragmentShader: fragmentShader,
					vertexShader: vertexShader,
					uniforms: {
						...globalUniforms,
						uPixelSortingTexture: { value: pixelSortingTexture },
						uGlitchTexture: { value: glitchTexture },
					},
					map: diffuse,
					normalMap: normal,
					roughnessMap: roughness,
					// metalness: 0.6,
					// roughness: 0.5,
				});
			}
			if (o.name === 'enceintes') {
				const diffuse = app.core.assetsManager.get('enceintesDiffuse');
				diffuse.flipY = false;
				const roughness = app.core.assetsManager.get('enceintesRoughness');
				roughness.flipY = false;
				const normal = app.core.assetsManager.get('enceintesNormal');
				normal.flipY = false;

				o.material = new CustomShaderMaterial({
					baseMaterial: MeshStandardMaterial,
					fragmentShader: fragmentShader,
					vertexShader: vertexShader,
					uniforms: {
						...globalUniforms,
						uPixelSortingTexture: { value: pixelSortingTexture },
						uGlitchTexture: { value: glitchTexture },
					},
					map: diffuse,
					roughnessMap: roughness,
					normalMap: normal,
					// metalness: 0.55,
					// roughness: 0.45,
				});
			}
		});
		mesh.rotation.y = Math.PI * 0.15;
		mesh.position.z = 0.35;
		app.webgl.scene.add(mesh);

		return mesh;
	}
}
