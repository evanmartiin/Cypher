import {
	AdditiveBlending,
	BufferGeometry,
	Clock,
	DoubleSide,
	Group,
	InstancedBufferAttribute,
	InstancedMesh,
	MeshStandardMaterial,
	MultiplyBlending,
	PlaneGeometry,
	RepeatWrapping,
	ShaderMaterial,
} from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import fragmentShader from '@Webgl/Materials/Particles/visual/fragment.fs';
import vertexShader from '@Webgl/Materials/Particles/visual/vertex.vs';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { GPUSimulation } from '../../utils/GPUSimulation.js';

export class Particles extends Group {
	constructor(size, coords, acceleration) {
		super();
		state.register(this);
		this.size = size;
		this.coords = coords;
		this.acceleration = acceleration;

		this.init();
	}

	init() {
		this.sim = new GPUSimulation(app.webgl.renderer, this.size, this.coords);
		this._geometry = this._createGeometry();
		this._material = this._createMaterial();
		this._mesh = this._createMesh();
	}

	_createGeometry() {
		// const baseGeometry = new PlaneGeometry(1, 1, 1, 1);
		// const baseGeometry = new OctahedronGeometry(1, 0);
		const baseGeometry = app.core.assetsManager.get('cube').children[0].geometry;
		baseGeometry.scale(0.75, 0.75, 0.75);

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
		const material = new CustomShaderMaterial({
			baseMaterial: MeshStandardMaterial,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				...globalUniforms,

				posMap: { value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture },
				velMap: { value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture },
				uSize: { value: this.size },
				uAcceleration: { value: this.acceleration.value },
			},
			side: DoubleSide,
			metalness: 0.6,
			roughness: 0.4,
			envMap: app.core.assetsManager.get('envmap'),
		});

		return material;
	}

	_createMesh() {
		const mesh = new InstancedMesh(this._geometry, this._material, this.size * this.size);
		mesh.scale.set(0.1, 0.1, 0.1);

		this.add(mesh);
		mesh.frustumCulled = false;
		mesh.renderOrder = 2;

		return mesh;
	}

	onRender() {
		this._material.uniforms.uAcceleration.value = this.acceleration.value;
		this._material.uniforms.posMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture;
		this._material.uniforms.velMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture;

		this.sim.gpuCompute.compute();
	}
}
