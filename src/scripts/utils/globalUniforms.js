import { Color } from 'three';

const globalUniforms = {
	uTime: { value: 0.0 },
	uTransitionProgress: { value: -1 },
	uSwitchTransition: { value: true },
	uTransitionColor: { value: new Color('#18f89d') },
};

export { globalUniforms };
