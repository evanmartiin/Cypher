import { BoxGeometry, Clock, Color, DoubleSide, Group, InstancedBufferAttribute, InstancedBufferGeometry, Mesh, MeshStandardMaterial, OctahedronGeometry, Vector3 } from 'three';
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
		this.colorPallete = [new Color(0x0d0232), new Color(0xe50061), new Color(0x1cafc0), new Color(0xefcb03)];

		this.sim = new GPUSimulation(app.webgl.renderer, this.size);
		this.createObj();

		this.time = new Clock();
	}

	createObj() {
		var originalG = new OctahedronGeometry(1, 0);

		var geometry = new InstancedBufferGeometry();

		// vertex
		var vertices = originalG.attributes.position.clone();

		geometry.setAttribute('position', vertices);

		var normals = originalG.attributes.normal.clone();
		geometry.setAttribute('normal', normals);

		// uv
		var uvs = originalG.attributes.uv.clone();
		geometry.setAttribute('uv', uvs);

		geometry.instanceCount = this.size * this.size;

		var nums = new InstancedBufferAttribute(new Float32Array(this.size * this.size * 1), 1);
		var randoms = new InstancedBufferAttribute(new Float32Array(this.size * this.size * 1), 1);
		var colors = new InstancedBufferAttribute(new Float32Array(this.size * this.size * 3), 3);

		for (var i = 0; i < nums.count; i++) {
			var _color = this.colorPallete[Math.floor(Math.random() * this.colorPallete.length)];

			nums.setX(i, i);
			randoms.setX(i, Math.random() * 0.5 + 1);
			colors.setXYZ(i, _color.r, _color.g, _color.b);
		}

		geometry.setAttribute('aNum', nums);
		geometry.setAttribute('aRandom', randoms);
		geometry.setAttribute('aColor', colors);

		var scale = {
			x: 2,
			y: 6,
			z: 2,
		};

		this.material = new CustomShaderMaterial({
			baseMaterial: MeshStandardMaterial,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				...globalUniforms,

				posMap: { value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture },
				velMap: { value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture },
				size: { value: this.size },

				timer: { value: 0 },
				boxScale: { value: new Vector3(scale.x, scale.y, scale.z) },
			},
			metalness: 0.5,
			roughness: 0.5,
		});

		this.mesh = new Mesh(geometry, this.material);
		this.mesh.position.set(0, 0, -3);
		this.mesh.scale.set(0.25, 0.25, 0.25);

		this.add(this.mesh);
		this.mesh.frustumCulled = false;
	}

	onRender() {
		var delta = this.time.getDelta() * 4;
		var time = this.time.elapsedTime;

		this.sim.velUniforms.timer.value = time;
		this.sim.velUniforms.delta.value = delta;

		this.material.uniforms.posMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture;
		this.material.uniforms.velMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture;

		this.sim.gpuCompute.compute();
	}
}
