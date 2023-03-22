import faceVertex from '@Webgl/Materials/FluidSimulation/simulation/face.vert';
import pressureFragment from '@Webgl/Materials/FluidSimulation/simulation/pressure.frag';
import ShaderPass from './ShaderPass.js';

export default class Divergence extends ShaderPass {
	constructor(simProps) {
		super({
			material: {
				vertexShader: faceVertex,
				fragmentShader: pressureFragment,
				uniforms: {
					boundarySpace: {
						value: simProps.boundarySpace,
					},
					pressure: {
						value: simProps.src_p.texture,
					},
					velocity: {
						value: simProps.src_v.texture,
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

	update({ vel, pressure }) {
		this.uniforms.velocity.value = vel.texture;
		this.uniforms.pressure.value = pressure.texture;
		super.update();
	}
}
