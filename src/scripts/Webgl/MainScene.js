import { AmbientLight, IcosahedronGeometry, Mesh, MeshStandardMaterial, Scene } from 'three';
import { computeEnvmap } from '@utils/misc.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

class MainScene extends Scene {
	constructor() {
		super();
		state.register(this);

		// manifest.envMaps.envmap.callback = this.envMapLoaded;

		this.add(new AmbientLight(0xffffff, 0.5));
	}

	onAttach() {
		this.sphere = new Mesh(new IcosahedronGeometry(1, 6), new MeshStandardMaterial({ roughness: 0.2, metalness: 0.5 }));
		this.add(this.sphere);

		this.environment = computeEnvmap(app.webgl.renderer, app.core.assetsManager.get('envmap'), false);

		app.debug?.mapping.add(this, 'Scene');
	}

	setColor(color) {
		this.sphere.material.color.set(color);
	}

	// envMapLoaded = (texture) => {
	// 	this.environment = computeEnvmap(app.webgl.renderer, texture, false);
	// };
}

export { MainScene };
