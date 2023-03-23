import { BufferAttribute, BufferGeometry, LineSegments, RawShaderMaterial } from 'three';
import advectionFragment from '@Webgl/Materials/FluidSimulation/simulation/advection.frag';
import faceVertex from '@Webgl/Materials/FluidSimulation/simulation/face.vert';
import lineVertex from '@Webgl/Materials/FluidSimulation/simulation/line.vert';
import ShaderPass from './ShaderPass.js';

export default class Advection extends ShaderPass {
	constructor(simProps) {
		super({
			material: {
				vertexShader: faceVertex,
				fragmentShader: advectionFragment,
				uniforms: {
					boundarySpace: {
						value: simProps.cellScale,
					},
					px: {
						value: simProps.cellScale,
					},
					fboSize: {
						value: simProps.fboSize,
					},
					velocity: {
						value: simProps.src.texture,
					},
					dt: {
						value: simProps.dt,
					},
					isBFECC: {
						value: true,
					},
				},
			},
			output: simProps.dst,
		});

		this.init();
	}

	init() {
		super.init();
		this.createBoundary();
	}

	createBoundary() {
		const boundaryG = new BufferGeometry();
		const vertices_boundary = new Float32Array([
			// left
			-1, -1, 0, -1, 1, 0,

			// top
			-1, 1, 0, 1, 1, 0,

			// right
			1, 1, 0, 1, -1, 0,

			// bottom
			1, -1, 0, -1, -1, 0,
		]);
		boundaryG.setAttribute('position', new BufferAttribute(vertices_boundary, 3));

		const boundaryM = new RawShaderMaterial({
			vertexShader: lineVertex,
			fragmentShader: advectionFragment,
			uniforms: this.uniforms,
		});

		this.line = new LineSegments(boundaryG, boundaryM);
		this.scene.add(this.line);
	}

	update({ dt, isBounce, BFECC }) {
		this.uniforms.dt.value = dt;
		this.line.visible = isBounce;
		this.uniforms.isBFECC.value = BFECC;

		super.update();
	}
}
