export default {
	build: {
		rollupOptions: {
			external: ['@tensorflow/tfjs-backend-cpu/dist/shared'],
		},
	},
};
