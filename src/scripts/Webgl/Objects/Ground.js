import { Group, PlaneGeometry } from 'three';
import { Reflector } from '@utils/Reflector.js';

export class Ground extends Group {
	constructor() {
		super();
		this.createMesh();
	}

	createMesh() {
		const reflectorGeometry = new PlaneGeometry(1, 1);
		const reflector = new Reflector(reflectorGeometry, {
			textureWidth: 512 * window.devicePixelRatio,
			textureHeight: 512 * window.devicePixelRatio,
		});

		reflector.rotation.x = -Math.PI * 0.5;
		reflector.position.y = 0;
		reflector.scale.set(15, 15, 5);

		this.add(reflector);
	}
}
