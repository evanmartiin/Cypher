import { Group, Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import fragmentShader from '@Webgl/Materials/MaskOverlay/fragment.fs';
import vertexShader from '@Webgl/Materials/MaskOverlay/vertex.vs';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class MaskOverlay extends Group {
	constructor() {
		super();
		state.register(this);

		this._mesh = this._createMesh();
	}

	_createMesh() {
		const geometry = new PlaneGeometry(2, 2, 1, 1);

		const material = new ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				...globalUniforms,
				uOpacity: { value: 0.0 },
			},
			transparent: true,
		});

		const mesh = new Mesh(geometry, material);

		app.webgl.scene.add(mesh);

		return mesh;
	}
}
