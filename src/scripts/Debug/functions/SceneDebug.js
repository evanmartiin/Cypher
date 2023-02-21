import { manifest } from '@utils/manifest.js';
import { computeEnvmap } from '@utils/misc.js';
import { app } from '@scripts/App.js';

/**
 *
 * @param {import('@Webgl/MainScene.js').MainScene} instance
 */
function debug(instance) {
	if (import.meta.hot) {
		import.meta.hot.on('envmap-reload', async (_data) => {
			const texture = await app.core.assetsManager.loaders.envMaps.loader.loadAsync(manifest.envMaps.envmap.path + '?t=' + new Date().getTime());
			instance.environment.dispose();
			instance.environment = computeEnvmap(app.webgl.renderer, texture, false);
		});
	}
}

export { debug };
