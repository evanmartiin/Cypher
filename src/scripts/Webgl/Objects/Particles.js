import { AdditiveBlending, BufferGeometry, Clock, DoubleSide, Group, InstancedMesh, MultiplyBlending, PlaneGeometry, ShaderMaterial } from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import fragmentShader from '@Webgl/Materials/Particles/visual/fragment.fs';
import vertexShader from '@Webgl/Materials/Particles/visual/vertex.vs';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { GPUSimulation } from '../../utils/GPUSimulation.js';

export class Particles extends Group {
	constructor(size) {
		super();
		state.register(this);
		this.size = size;

		this.init();
	}

	init() {
		this.sim = new GPUSimulation(app.webgl.renderer, this.size);
		this._geometry = this._createGeometry();
		this._material = this._createMaterial();
		this._mesh = this._createMesh();
	}

	_createGeometry() {
		const baseGeometry = new PlaneGeometry(1, 1, 1, 1);
		// const baseGeometry = new OctahedronGeometry(1, 0);
		// const baseGeometry = app.core.assetsManager.get('cube').children[0].geometry;

		const geometry = new BufferGeometry();

		Object.keys(baseGeometry.attributes).forEach((attributeName) => {
			geometry.attributes[attributeName] = baseGeometry.attributes[attributeName];
		});
		geometry.index = baseGeometry.index;

		return geometry;
	}

	_createMaterial() {
		const material = new ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				...globalUniforms,

				posMap: { value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture },
				velMap: { value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture },
				uTexture: { value: app.core.assetsManager.get('brush') },
				uTexture2: { value: app.core.assetsManager.get('outlineBrush') },
				uSize: { value: this.size },
			},
			transparent: true,
			side: DoubleSide,
			depthWrite: false,
		});

		return material;
	}

	_createMesh() {
		const mesh = new InstancedMesh(this._geometry, this._material, this.size * this.size);
		mesh.position.set(0, 0, -3);
		mesh.scale.set(0.1, 0.1, 0.1);

		this.add(mesh);
		mesh.frustumCulled = false;

		return mesh;
	}

	onRender() {
		this._material.uniforms.posMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture;
		this._material.uniforms.velMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture;

		this.sim.gpuCompute.compute();
	}
}
