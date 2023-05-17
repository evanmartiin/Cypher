import { BoxGeometry, DoubleSide, Group, InstancedBufferGeometry, InstancedInterleavedBuffer, InstancedMesh, InterleavedBufferAttribute, Matrix4, RepeatWrapping } from 'three';
import { CrowdMaterial } from '@Webgl/Materials/Crowd/material.js';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

const COUNT = 100;

export class Crowd extends Group {
	constructor() {
		super();
		state.register(this);

		this.geometry = new InstancedBufferGeometry().copy(new BoxGeometry(1, 1, 1));

		const vbuffer = new Float32Array(COUNT);
		const ibuffer = new InstancedInterleavedBuffer(vbuffer, 1, 1);

		this.geometry.setAttribute('aOffset', new InterleavedBufferAttribute(ibuffer, 1, 0));

		this.material = new CrowdMaterial({
			uniforms: {
				...globalUniforms,
				uVAT: { value: app.core.assetsManager.get('vat') },
				uVertexCount: { value: this.geometry.index.count },
			},
			side: DoubleSide,
		});

		this.mesh = new InstancedMesh(this.geometry, this.material, COUNT);

		this.mesh.position.set(0, 0.5, -1.5);
		this.mesh.scale.set(0.5, 0.5, 0.5);

		for (let i = 0; i < COUNT; i++) {
			const m4 = new Matrix4();
			m4.makeRotationX(Math.random() * Math.PI * 2);
			m4.makeRotationY(Math.random() * Math.PI * 2);
			m4.makeRotationZ(Math.random() * Math.PI * 2);
			m4.setPosition(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10);

			this.mesh.setMatrixAt(i, m4);

			vbuffer[i] = Math.random();
		}

		this.mesh.instanceMatrix.needsUpdate = true;

		this.add(this.mesh);
	}

	onAttach() {
		this.tex = app.core.assetsManager.get('vat');
		this.tex.wrapT = RepeatWrapping;

		this.material.uniforms.uVAT.value = this.tex;
	}
}
