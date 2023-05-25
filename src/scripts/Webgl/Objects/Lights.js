import { Group, PointLight, PointLightHelper } from 'three';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export class Lights extends Group {
	constructor() {
		super();
		state.register(this);
		this._lights = this._createLights();
	}

	onAttach() {
		app.debug?.mapping.add(this, 'Lights');
	}

	_createLights() {
		const light1 = new PointLight('#0f0fff', 1);
		// const light1 = new PointLight('#ffffff', 1);
		light1.position.set(-5, 10, 0);

		const helper1 = new PointLightHelper(light1, 1);

		const light2 = new PointLight('#FF0000', 1);
		// const light2 = new PointLight('#ffffff', 1);
		light2.position.set(5, 10, 0);

		const helper2 = new PointLightHelper(light2, 1);

		const light3 = new PointLight('#ffffff', 1);
		light3.position.set(5, 10, 0);

		const helper3 = new PointLightHelper(light3, 1);

		this.add(light1, light2, light3, helper1, helper2, helper3);

		return { light1, light2, light3, helper1, helper2, helper3 };
	}
}
