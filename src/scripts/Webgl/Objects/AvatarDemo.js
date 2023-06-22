import { AnimationMixer, Group, MeshStandardMaterial } from 'three';
import { DANCES } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

const ANIM_IDS = {
	[DANCES.BABY_FREEZE]: 0,
	[DANCES.BACK_SPIN]: 1,
	[DANCES.THREE_STEPS]: 2,
	[DANCES.SIX_STEPS]: 3,
};

class AvatarDemo extends Group {
	constructor() {
		super();
		state.register(this);
		this.active = false;
	}

	onAttach() {
		this.gltf = app.core.assetsManager.get('avatarDemo');
		this.mesh = this.gltf.scene;

		const material = new MeshStandardMaterial({
			metalness: 0.4,
			roughness: 0.8,
			fog: false,
		});

		this.mesh.traverse((object) => {
			if (object.isMesh) {
				object.castShadow = true;
				object.material = material;
			}
		});

		this.add(this.mesh);
		this.mesh.castShadow = true;
		this.mesh.position.x = -2;
		this.mesh.position.y = 0;
		this.mesh.position.z = -3;
		this.mesh.visible = false;

		this.mixer = new AnimationMixer(this.mesh);
		this.action = this.mixer.clipAction(this.gltf.animations[0]);
		this.action.play();
	}

	enable() {
		this.active = true;
		this.mesh.visible = true;
	}

	disable() {
		this.active = false;
		this.mesh.visible = false;
	}

	onRender({ dt }) {
		if (this.mixer && this.active) {
			this.mixer.update(dt);
		}
	}
}

export { AvatarDemo };
