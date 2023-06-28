import { gsap } from 'gsap';
import { Group, InstancedBufferAttribute, InstancedMesh, Matrix4, PlaneGeometry, ShaderMaterial } from 'three';
import { UI_IDS } from '@Core/audio/AudioManager.js';
import fragmentShader from '@Webgl/Materials/Reactions/fragment.fs';
import vertexShader from '@Webgl/Materials/Reactions/vertex.vs';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

const REACTIONS_NB = 7;
const REACTIONS = [
	{
		sound: UI_IDS.LETS_GO,
		texOffset: 0,
	},
	{
		sound: UI_IDS.YEAH,
		texOffset: 1,
	},
	{
		sound: UI_IDS.INSANE,
		texOffset: 2,
	},
	{
		sound: UI_IDS.NICE,
		texOffset: 3,
	},
];

const DUMMY = new Matrix4();

class Reactions extends Group {
	constructor() {
		super();
		state.register(this);
	}

	onAttach() {
		const textTex = app.core.assetsManager.get('roadrage');

		const geometry = new PlaneGeometry(4, 1);
		const lifes = new Float32Array(REACTIONS_NB);
		for (let i = 0; i < REACTIONS_NB; i++) {
			lifes[i] = Math.random() * 0.5;
		}
		geometry.setAttribute('iLife', new InstancedBufferAttribute(lifes, 1));

		this.material = new ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			transparent: true,
			depthTest: false,
			depthWrite: false,
			uniforms: {
				tTex: { value: textTex },
				uTextureOffset: { value: 0 },
				uTransition: { value: 0 },
			},
		});

		this.mesh = new InstancedMesh(geometry, this.material, REACTIONS_NB);
		this.mesh.position.set(-2.75, 1.3, -2);
		this.mesh.scale.set(0.25, 0.25, 0.25);
		this.mesh.visible = false;

		for (let i = 0; i < REACTIONS_NB; i++) {
			DUMMY.makeRotationZ(((i / REACTIONS_NB) * Math.PI) / 2 - Math.PI / 4);
			DUMMY.setPosition(
				3.5 * Math.cos((i / REACTIONS_NB) * Math.PI) + (Math.random() * 2 - 1),
				3.5 * Math.sin((i / REACTIONS_NB) * Math.PI) + (Math.random() * 2 - 1),
				Math.random() * 2 - 1,
			);
			this.mesh.setMatrixAt(i, DUMMY);
		}
		this.mesh.instanceMatrix.needsUpdate = true;

		this.add(this.mesh);
	}

	show() {
		if (this.mesh.visible) return;

		const reactionID = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];

		this.mesh.visible = true;

		this.material.uniforms.uTransition.value = 0;
		this.material.uniforms.uTextureOffset.value = reactionID.texOffset;

		gsap.to(this.material.uniforms.uTransition, {
			value: 1,
			duration: 5,
			onComplete: () => {
				this.material.uniforms.uTransition.value = 0;
				this.stop();
			},
		});

		app.core.audio.playUI(reactionID.sound);
	}

	stop() {
		if (!this.mesh.visible) return;

		gsap.killTweensOf(this.material.uniforms.uTransition);
		this.mesh.visible = false;
	}
}

export { Reactions };
