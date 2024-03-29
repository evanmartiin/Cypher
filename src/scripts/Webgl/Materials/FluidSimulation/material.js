import { ShaderMaterial } from 'three';
import fs from './fragment.fs?hotShader';
import vs from './vertex.vs?hotShader';

class FluidSimulationMaterial extends ShaderMaterial {
	/**
	 *
	 * @param {import("three").ShaderMaterialParameters} options
	 */
	constructor(options = {}) {
		super(options);
		fs.use(this);
		vs.use(this);
	}
}

export { FluidSimulationMaterial };
