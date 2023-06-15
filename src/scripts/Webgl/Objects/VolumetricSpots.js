import { AdditiveBlending, Color, ConeGeometry, DoubleSide, Group, Mesh, ShaderMaterial, Vector3 } from 'three';
import fragmentShader from '@Webgl/Materials/VolumetricSpots/fragment.fs';
import vertexShader from '@Webgl/Materials/VolumetricSpots/vertex.vs';
import { state } from '@scripts/State.js';

export class VolumetricSpots extends Group {
	constructor() {
		super();
		state.register(this);
		this._meshes = this._createMesh();
		this._lookAtVector = new Vector3(0, 0, 0);
	}

	_createMesh() {
		const geometry = new ConeGeometry(1.5, 20, 32);
		const material = new ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				uAnglePower: { value: 0.1 },
				uLightColor: { value: new Color('#ffffff') },
			},
			transparent: true,
			side: DoubleSide,
			depthWrite: false,
			blending: AdditiveBlending,
		});

		const left = new Mesh(geometry, material);
		left.geometry.rotateX(-Math.PI * 0.5);
		left.position.set(-5, 5, 0);

		const right = left.clone();
		right.position.set(5, 5, 0);

		this.add(left, right);

		return { left, right };
	}

	onRender() {
		this._meshes.left.lookAt(0, 1, 0);
		this._meshes.right.lookAt(0, 1, 0);
		console.log('coucou');
	}
}
