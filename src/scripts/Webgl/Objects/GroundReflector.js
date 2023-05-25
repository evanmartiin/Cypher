import { Group, PlaneGeometry } from 'three';
import { Reflector } from '@utils/Reflector.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export class GroundReflector extends Group {
	constructor() {
		super();
		state.register(this);
		this._reflector = this._createReflector();
	}

	onAttach() {
		app.debug?.mapping.add(this, 'GroundReflector');
	}

	_createReflector() {
		const geometry = new PlaneGeometry(1, 1);
		const reflector = new Reflector(geometry, {
			textureWidth: 512 * window.devicePixelRatio,
			textureHeight: 512 * window.devicePixelRatio,
		});

		reflector.rotation.x = -Math.PI * 0.5;
		reflector.rotation.z = 0.75;
		reflector.position.z = -1;
		const scale = 28;
		reflector.scale.set(scale, scale, 1);
		this.add(reflector);

		console.log(reflector);

		return reflector;
	}
}
