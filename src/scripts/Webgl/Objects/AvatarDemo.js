import { AnimationMixer, Group, MeshStandardMaterial } from 'three';
import { DANCES } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { gsap } from 'gsap';

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

		this.material = new MeshStandardMaterial({
			metalness: 0.4,
			roughness: 0.8,
			fog: false,
			transparent: true,
			opacity: 0,
		});

		this.mesh.traverse((object) => {
			if (object.isMesh) {
				object.castShadow = true;
				object.material = this.material;
			}
		});

		this.add(this.mesh);
		this.mesh.castShadow = true;
		this.mesh.position.x = -3;
		this.mesh.position.y = 0;
		this.mesh.position.z = -2;
		this.mesh.visible = false;

		this.mixer = new AnimationMixer(this.mesh);
	}
	
	dance(danceID) {
		const animID = ANIM_IDS[danceID];

		if (animID === undefined) return;

		if (this.action) {
			this.action.stop();
			this.action.reset();
		}
		this.action = this.mixer.clipAction(this.gltf.animations[animID]);
		this.action.play();

		this.active = true;
		this.show();
	}

	resume() {
		this.action.paused = false;
		this.active = true;
		this.show();
	}

	stop() {
		this.active = false;
		this.hide();
	}

	show() {
		this.mesh.visible = true;
		gsap.to(this.material, { opacity: 1, duration: 1 })
	}

	hide() {
		gsap.to(this.material, { opacity: 0, duration: 1, onComplete: () => {
			if (this.active) return;
			this.mesh.visible = false;
			if (this.action) this.action.paused = true;
		}})
	}

	onRender({ dt }) {
		if (this.mixer && this.mesh.visible) {
			this.mixer.update(dt);
		}
	}
}

export { AvatarDemo };
