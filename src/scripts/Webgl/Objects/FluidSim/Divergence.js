import divergenceFragment from '@Webgl/Materials/FluidSimulation/simulation/divergence.frag';
import faceVertex from '@Webgl/Materials/FluidSimulation/simulation/face.vert';
import ShaderPass from './ShaderPass.js';

export default class Divergence extends ShaderPass {
	constructor(simProps) {
		super({
			material: {
				vertexShader: faceVertex,
				fragmentShader: divergenceFragment,
				uniforms: {
					boundarySpace: {
						value: simProps.boundarySpace,
					},
					velocity: {
						value: simProps.src.texture,
					},
					px: {
						value: simProps.cellScale,
					},
					dt: {
						value: simProps.dt,
					},
				},
			},
			output: simProps.dst,
		});

		this.init();
	}

	update({ vel }) {
		this.uniforms.velocity.value = vel.texture;
		super.update();
	}
}
