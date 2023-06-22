import {
	BoxGeometry,
	BufferGeometry,
	DoubleSide,
	Group,
	InstancedBufferAttribute,
	InstancedMesh,
	MeshStandardMaterial,
	MirroredRepeatWrapping,
	OctahedronGeometry,
	PlaneGeometry,
	SphereGeometry,
	Texture,
	Vector2,
} from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import fragmentShader from '@Webgl/Materials/Particles/visual/fragment.fs';
import vertexShader from '@Webgl/Materials/Particles/visual/vertex.vs';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { VIDEO_SIZE } from '@scripts/Tensorflow/TensorflowCamera.js';
import { GPUSimulation } from '../../utils/GPUSimulation.js';

export class Particles extends Group {
	constructor(size, coords, acceleration) {
		super();
		state.register(this);
		this.size = size;
		this.coords = coords;
		this.acceleration = acceleration;
		this.visible = false;

		this.init();
	}

	init() {
		this.sim = new GPUSimulation(app.webgl.renderer, this.size, this.coords, this.acceleration);
		this._geometry = this._createGeometry();
		this._material = this._createMaterial();
		this._mesh = this._createMesh();
	}

	show() {
		this.visible = true;
	}

	hide() {
		this.visible = false;
	}

	_createGeometry() {
		// const baseGeometry = new PlaneGeometry(1, 1, 1, 1);
		// const baseGeometry = new BoxGeometry(1, 1, 1, 1);
		const baseGeometry = new OctahedronGeometry(1, 0);
		// const baseGeometry = new SphereGeometry();
		// const baseGeometry = app.core.assetsManager.get('cube').children[0].geometry;
		baseGeometry.scale(2, 2, 2);

		const geometry = new BufferGeometry();

		Object.keys(baseGeometry.attributes).forEach((attributeName) => {
			geometry.attributes[attributeName] = baseGeometry.attributes[attributeName];
		});
		geometry.index = baseGeometry.index;

		const particleAmout = this.size * this.size;
		const randomAttribute = new InstancedBufferAttribute(new Float32Array(particleAmout), 1, 1);

		for (let i = 0; i < particleAmout; i++) {
			randomAttribute.setX(i, Math.random() + 0.1);
		}

		geometry.setAttribute('aRandom', randomAttribute);

		return geometry;
	}

	_createMaterial() {
		const pixelSortingTexture = app.core.assetsManager.get('pixelSorting');
		pixelSortingTexture.wrapS = MirroredRepeatWrapping;
		pixelSortingTexture.wrapT = MirroredRepeatWrapping;

		const glitchTexture = app.core.assetsManager.get('glitch');
		glitchTexture.wrapS = MirroredRepeatWrapping;
		glitchTexture.wrapT = MirroredRepeatWrapping;

		const material = new CustomShaderMaterial({
			baseMaterial: MeshStandardMaterial,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				...globalUniforms,

				posMap: { value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture },
				velMap: { value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture },
				uRigPositionMap: { value: new Texture() },
				uSize: { value: this.size },
				uAcceleration: { value: this.acceleration.value },
				uPixelSortingTexture: { value: pixelSortingTexture },
				uGlitchTexture: { value: glitchTexture },
				uVideoBounds: { value: new Vector2(VIDEO_SIZE.width, VIDEO_SIZE.height) },
			},
			side: DoubleSide,
			metalness: 0.5,
			roughness: 0.5,
			envMap: app.core.assetsManager.get('envmap'),
		});

		return material;
	}

	_createMesh() {
		const mesh = new InstancedMesh(this._geometry, this._material, this.size * this.size);
		mesh.scale.set(0.03, 0.03, 0.03);

		this.add(mesh);
		mesh.position.set(-1.1, 0, 2.5);
		mesh.frustumCulled = false;
		mesh.renderOrder = 2;

		return mesh;
	}

	onRender() {
		this._material.uniforms.uAcceleration.value = this.acceleration.value;
		this._material.uniforms.posMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture;
		this._material.uniforms.velMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture;
		this._material.uniforms.uRigPositionMap.value = app.webgl.scene.avatar.vertexStore.positionMap;

		this.sim.gpuCompute.compute();
	}
}
