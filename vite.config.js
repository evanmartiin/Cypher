export default {
	build: {
		rollupOptions: {
			external: ['@tensorflow-models/pose-detection', '@tensorflow/tfjs-core'],
		},
	},
};
