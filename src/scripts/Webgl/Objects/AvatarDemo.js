import { AnimationMixer, Group, MeshPhysicalMaterial } from 'three';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

class AvatarDemo extends Group {
	constructor() {
		super();
		state.register(this);
		this.active = false;
	}

	onAttach() {
		this.gltf = app.core.assetsManager.get('avatarDemo');
		this.mesh = this.gltf.scene;

		const material = new MeshPhysicalMaterial({
			metalness: 0.5,
			roughness: 0.5,
		});

		this.mesh.traverse((object) => {
			if (object.isMesh) {
				object.castShadow = true;
				object.material = material;
			}
		});

		this.add(this.mesh);
		this.mesh.castShadow = true;
		this.mesh.position.x = 3;
		this.mesh.position.y = 0;
		this.mesh.position.z = 3;

		this.mixer = new AnimationMixer(this.mesh);
		this.action = this.mixer.clipAction(this.gltf.animations[0]);
		this.action.play();
	}

	enable() {
		this.active = true;
	}

	disable() {
		this.active = false;
	}

	onRender({ dt }) {
		if (this.mixer && this.active) {
			this.mixer.update(dt);
		}
	}
}

export { AvatarDemo };
