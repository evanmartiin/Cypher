import { Group, PlaneGeometry } from 'three';
import { Reflector } from '@utils/Reflector.js';

export class Ground extends Group {
	constructor() {
		super();
		this.createMesh();
	}

	createMesh() {
		const geometry = new PlaneGeometry(1, 1);
		const mesh = new Reflector(geometry, {
			textureWidth: 256 * window.devicePixelRatio,
			textureHeight: 256 * window.devicePixelRatio,
		});

		mesh.rotation.x = -Math.PI * 0.5;
		const scale = 10;
		mesh.scale.set(scale, scale, 1);
		// this.add(mesh);
	}
}
