import { AmbientLight, Scene } from 'three';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { Avatar } from './Objects/Avatar.js';

class MainScene extends Scene {
	constructor() {
		super();
		state.register(this);

		this.add(new AmbientLight(0xffffff, 0.5));

		this.avatar = new Avatar();
		this.add(this.avatar);
	}

	onAttach() {
		app.debug?.mapping.add(this, 'Scene');
	}
}

export { MainScene };
