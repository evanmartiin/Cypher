import { Group, Mesh, MeshStandardMaterial, MirroredRepeatWrapping, PlaneGeometry, ShaderMaterial } from 'three';
import fragmentShader from '@Webgl/Materials/CounterAnimation/fragment.fs';
import vertexShader from '@Webgl/Materials/CounterAnimation/vertex.vs';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class CounterAnimation extends Group {
	constructor() {
		super();
		state.register(this);

		this._mesh = this._createCounterMesh();
	}

	onAttach() {
		// app.debug?.mapping.add(this, 'Environment');
	}

	_createCounterMesh() {
		const pixelSortingTexture = app.core.assetsManager.get('pixelSorting');
		pixelSortingTexture.wrapS = MirroredRepeatWrapping;
		pixelSortingTexture.wrapT = MirroredRepeatWrapping;

		const glitchTexture = app.core.assetsManager.get('glitch');
		glitchTexture.wrapS = MirroredRepeatWrapping;
		glitchTexture.wrapT = MirroredRepeatWrapping;

		const number1 = app.core.assetsManager.get('1');
		const number2 = app.core.assetsManager.get('2');
		const number3 = app.core.assetsManager.get('3');

		const material = new ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				...globalUniforms,
				uPixelSortingTexture: { value: pixelSortingTexture },
				uGlitchTexture: { value: glitchTexture },
				uNumber1: { value: number1 },
				uNumber2: { value: number2 },
				uNumber3: { value: number3 },
			},
			transparent: true,
		});

		const mesh = new Mesh(new PlaneGeometry(1, 1.25, 1, 1), material);
		mesh.position.y = 1;
		mesh.position.z = 1;

		// app.webgl.postProcessing.sceneWithoutPP.add(mesh);

		return mesh;
	}
}
