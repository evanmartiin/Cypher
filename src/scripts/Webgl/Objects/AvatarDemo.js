import { gsap } from 'gsap';
import { AnimationMixer, DoubleSide, Group, MeshStandardMaterial, MirroredRepeatWrapping } from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import fragmentShader from '@Webgl/Materials/AvatarDemo/fragment.fs';
import vertexShader from '@Webgl/Materials/AvatarDemo/vertex.vs';
import { DANCES } from '@utils/constants.js';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

const ANIM_IDS = {
	[DANCES.KICK_SIDE]: 0,
	[DANCES.SIDE_TO_SIDE]: 8,
	[DANCES.FONT_JUMP]: 10,
	[DANCES.CROSS_STEP_360]: 4,
	[DANCES.STEP_DOWN]: 6,
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

		const pixelSortingTexture = app.core.assetsManager.get('pixelSorting');
		pixelSortingTexture.wrapS = MirroredRepeatWrapping;
		pixelSortingTexture.wrapT = MirroredRepeatWrapping;

		const glitchTexture = app.core.assetsManager.get('glitch');
		glitchTexture.wrapS = MirroredRepeatWrapping;
		glitchTexture.wrapT = MirroredRepeatWrapping;

		this.material = new CustomShaderMaterial({
			baseMaterial: MeshStandardMaterial,
			fragmentShader: fragmentShader,
			vertexShader: vertexShader,
			uniforms: {
				...globalUniforms,
				uPixelSortingTexture: { value: pixelSortingTexture },
				uGlitchTexture: { value: glitchTexture },
				uOpacity: { value: 0 },
			},
			// color: '#000000',
			metalness: 0.5,
			roughness: 0.5,
			transparent: true,
			// fog: false,
			side: DoubleSide,
		});

		this.mesh.traverse((object) => {
			if (object.isMesh) {
				// object.castShadow = true;
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
		gsap.to(this.material.uniforms.uOpacity, { value: 1, duration: 1 });
	}

	hide() {
		gsap.to(this.material.uniforms.uOpacity, {
			value: 0,
			duration: 1,
			onComplete: () => {
				if (this.active) return;
				this.mesh.visible = false;
				if (this.action) this.action.paused = true;
			},
		});
	}

	onRender({ dt }) {
		if (this.mixer && this.mesh.visible) {
			this.mixer.update(dt);
		}
	}
}

export { AvatarDemo };
