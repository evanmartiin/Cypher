import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rollupOptions: {
			manualChunks(id) {
				if (id.includes('@tensorflow/tfjs-core')) {
					return 'tensorflow';
				}
			},
		},
	},
});
