import { Group, PlaneGeometry } from 'three';
import { Reflector } from '@utils/Reflector.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export class GroundReflector extends Group {
	constructor() {
		super();
		state.register(this);
	}

	onAttach() {
		const geometry = new PlaneGeometry(1, 1);
		this.reflector = new Reflector(geometry, {
			textureWidth: 512 * window.devicePixelRatio,
			textureHeight: 512 * window.devicePixelRatio,
		});

		this.reflector.rotation.x = -Math.PI * 0.5;
		this.reflector.rotation.z = 0.75;
		this.reflector.position.y = 0.01;
		this.reflector.position.z = -1;
		const scale = 28;
		this.reflector.scale.set(scale, scale, 1);
		this.add(this.reflector);

		app.debug?.mapping.add(this, 'GroundReflector');
	}
}
