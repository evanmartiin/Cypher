import { gsap } from 'gsap';
import { Group, Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import fragmentShader from '@Webgl/Materials/Title/fragment.fs';
import vertexShader from '@Webgl/Materials/Title/vertex.vs';
import { DANCES } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

const TITLE_IDS = {
	[DANCES.BABY_FREEZE]: 0,
	[DANCES.BACK_SPIN]: 1,
	[DANCES.THREE_STEPS]: 2,
	[DANCES.SIX_STEPS]: 3,
};

class Title extends Group {
	constructor() {
		super();
		state.register(this);
	}

	onAttach() {
		const textTex = app.core.assetsManager.get('moves');
		const noiseTex = app.core.assetsManager.get('noise');
		const brushNoiseTex = app.core.assetsManager.get('brushNoise');

		const geometry = new PlaneGeometry(4, 1);

		this.material = new ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			transparent: true,
			depthTest: false,
			depthWrite: false,
			uniforms: {
				tTex: { value: textTex },
				tNoise: { value: noiseTex },
				tBrushNoise: { value: brushNoiseTex },
				uTextureOffset: { value: 0 },
				uTransition: { value: 0 },
				uReverse: { value: false },
			},
		});

		this.mesh = new Mesh(geometry, this.material);
		this.mesh.position.set(0, 1.2, 2.5);
		this.mesh.rotateZ(Math.PI / 32);
		this.mesh.visible = false;

		this.add(this.mesh);
	}

	show(danceID) {
		const titleID = TITLE_IDS[danceID];

		if (this.mesh.visible || titleID === undefined) return;

		this.mesh.visible = true;

		this.material.uniforms.uTransition.value = 0;
		this.material.uniforms.uReverse.value = false;
		this.material.uniforms.uTextureOffset.value = titleID;

		gsap.to(this.material.uniforms.uTransition, {
			value: 1,
			duration: 2,
			onComplete: () => {
				this.material.uniforms.uTransition.value = 0;
				this.material.uniforms.uReverse.value = true;
			},
		});

		gsap.to(this.material.uniforms.uTransition, {
			value: 1,
			duration: 2,
			delay: 2,
			onComplete: () => {
				this.mesh.visible = false;
			},
		});
	}
}

export { Title };