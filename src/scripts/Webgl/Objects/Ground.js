import { Group, PlaneGeometry } from 'three';
import { Reflector } from '@Webgl/Objects/Reflector.js';

export class Ground extends Group {
	constructor() {
		super();
		this.createMesh();
	}

	createMesh() {
		const reflectorGeometry = new PlaneGeometry(30, 30);
		const reflector = new Reflector(reflectorGeometry, {
			textureWidth: 512 * window.devicePixelRatio,
			textureHeight: 512 * window.devicePixelRatio,
			color: '#ff0000',
		});

		reflector.rotation.x = -Math.PI * 0.5;
		reflector.position.y = -0.5;

		this.add(reflector);
	}
}