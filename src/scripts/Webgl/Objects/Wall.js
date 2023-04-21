import gsap from 'gsap';
import { Group, InstancedBufferGeometry, InstancedInterleavedBuffer, InterleavedBufferAttribute, Mesh, PlaneGeometry, Vector2, Vector3 } from 'three';
import { TagsMaterial } from '@Webgl/Materials/Tags/material.js';
import { WallMaterial } from '@Webgl/Materials/Wall/material.js';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';

const TAGS_COUNT = 100;
const TEX_PER_ROW = 2;

export class Wall extends Group {
	constructor() {
		super();

		this.size = new Vector2(10, 4);
		this.activeTags = Array.from({ length: TAGS_COUNT }, () => (Math.random() > 0.5 ? 1 : 0));
		this.color = new Vector3(0.24, 0.32, 0.45);

		this.createWall();
		this.createTags();
		app.debug?.mapping.add(this, 'Tags');
	}

	createWall() {
		const geometry = new PlaneGeometry(1, 1);

		const material = new WallMaterial({
			uniforms: {
				...globalUniforms,
				uColor: { value: this.color },
			},
		});

		this.wall = new Mesh(geometry, material);

		this.wall.scale.set(this.size.x, this.size.y, 1);
		this.wall.position.set(0, this.wall.scale.y / 2, -5);

		this.add(this.wall);
	}

	createTags() {
		const geometry = new InstancedBufferGeometry().copy(new PlaneGeometry(0.2, 0.2));
		geometry.instanceCount = TAGS_COUNT;

		const vdata = new Float32Array(TAGS_COUNT * 6);

		// X, Y, Scale, TextureID, Rotation, Transition
		for (let i = 0; i < TAGS_COUNT; i++) {
			vdata[i * 6] = Math.random() * this.size.x * 0.9 + this.size.x * 0.05;
			vdata[i * 6 + 1] = Math.random() * this.size.y * 0.9 + this.size.y * 0.05;
			vdata[i * 6 + 2] = Math.random() * 3 + 2;
			vdata[i * 6 + 3] = Math.floor(Math.random() * TEX_PER_ROW * TEX_PER_ROW);
			vdata[i * 6 + 4] = (Math.random() * Math.PI) / 2 - Math.PI / 4;
			vdata[i * 6 + 5] = this.activeTags[i];
		}

		const vbuffer = new InstancedInterleavedBuffer(vdata, 6, 1);
		geometry.setAttribute('instancePosition', new InterleavedBufferAttribute(vbuffer, 2, 0));
		geometry.setAttribute('instanceParams', new InterleavedBufferAttribute(vbuffer, 3, 2));
		geometry.setAttribute('instanceTransition', new InterleavedBufferAttribute(vbuffer, 1, 5));

		this.vdata = vdata;

		const material = new TagsMaterial({
			uniforms: {
				...globalUniforms,
				tTag: { value: app.core.assetsManager.get('tag') },
				uTexPerRow: { value: TEX_PER_ROW },
				uColor: { value: this.color.clone().multiplyScalar(1.6) },
			},
			transparent: true,
		});

		this.tags = new Mesh(geometry, material);
		this.tags.position.set(-this.size.x / 2, 0, -4.99);
		this.tags.frustumCulled = false;

		this.add(this.tags);
	}

	async addTag() {
		let instanceIndex;

		if (this.activeTags.every((v) => v === 1)) {
			instanceIndex = await this.removeTag();
		} else {
			do {
				instanceIndex = Math.floor(Math.random() * TAGS_COUNT);
			} while (this.activeTags[instanceIndex] === 1);
		}

		this.activeTags[instanceIndex] = 1;
		const o = { transition: this.vdata[instanceIndex * 6 + 5] };

		gsap.to(o, {
			transition: 1,
			duration: 1,
			onUpdate: () => {
				this.vdata[instanceIndex * 6 + 5] = o.transition;
				this.tags.geometry.attributes.instanceTransition.needsUpdate = true;
			},
		});
	}

	removeTag() {
		let instanceIndex;

		do {
			instanceIndex = Math.floor(Math.random() * TAGS_COUNT);
		} while (this.activeTags[instanceIndex] === 0);

		this.activeTags[instanceIndex] = 0;
		const o = { transition: this.vdata[instanceIndex * 6 + 5] };

		return new Promise((resolve) => {
			gsap.to(o, {
				transition: 0,
				duration: 1,
				onUpdate: () => {
					this.vdata[instanceIndex * 6 + 5] = o.transition;
					this.tags.geometry.attributes.instanceTransition.needsUpdate = true;
				},
				onComplete: () => {
					this.vdata[instanceIndex * 6] = Math.random() * this.size.x * 0.9 + this.size.x * 0.05;
					this.vdata[instanceIndex * 6 + 1] = Math.random() * this.size.y * 0.9 + this.size.y * 0.05;
					this.vdata[instanceIndex * 6 + 2] = Math.random() * 3 + 2;
					this.vdata[instanceIndex * 6 + 3] = Math.floor(Math.random() * TEX_PER_ROW * TEX_PER_ROW);
					this.vdata[instanceIndex * 6 + 4] = (Math.random() * Math.PI) / 2 - Math.PI / 4;
					this.tags.geometry.attributes.instancePosition.needsUpdate = true;
					resolve(instanceIndex);
				},
			});
		});
	}
}
