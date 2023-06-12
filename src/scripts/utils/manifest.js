/* 
This file is used to list and load the assets you need. To configure the behavior of the loader you can edit the AssetsManager file.

You can set a priority to your asset to reorder the loading process.

You can add a callback to any of the manifest items anywhere in your code (obviously before the asset is loaded). 
This is usefull if you desactivate the blocking behavior of the loader.

Finally, you can set some item to be criticals if you want your to wait the loading of some assets before initializing the app.
*/

const manifest = {
	images: {},
	textures: {
		groundNormal: { path: `${import.meta.env.BASE_URL}assets/textures/ground3/normal.jpg`, priority: 2, callback: null },
		groundBase: { path: `${import.meta.env.BASE_URL}assets/textures/ground3/base.jpg`, priority: 2, callback: null },

		sceneBase: { path: `${import.meta.env.BASE_URL}assets/textures/scene/base.jpg`, priority: 2, callback: null },
		sceneNormal: { path: `${import.meta.env.BASE_URL}assets/textures/scene/normal.jpg`, priority: 2, callback: null },
		sceneRoughness: { path: `${import.meta.env.BASE_URL}assets/textures/scene/roughness.jpg`, priority: 2, callback: null },
		sceneAo: { path: `${import.meta.env.BASE_URL}assets/textures/scene/ao.jpg`, priority: 2, callback: null },

		noise: { path: `${import.meta.env.BASE_URL}assets/textures/noise.jpg`, priority: 2, callback: null },

		// ...
	},
	envMaps: {
		envmap: { path: `${import.meta.env.BASE_URL}assets/textures/envmap.hdr`, critical: true, callback: null },
		// ...
	},
	models: {
		avatar: { path: `${import.meta.env.BASE_URL}assets/models/avatar.vrm`, priority: 1, callback: null },
		avatarDemo: { path: `${import.meta.env.BASE_URL}assets/models/avatar-demo.glb`, priority: 1, callback: null },
		cube: { path: `${import.meta.env.BASE_URL}assets/models/cube.glb`, priority: 1, callback: null },
		scene: { path: `${import.meta.env.BASE_URL}assets/models/env.glb`, priority: 1, callback: null },
		collider: { path: `${import.meta.env.BASE_URL}assets/models/collider.glb`, priority: 1, callback: null },
		// ...
	},
	jsons: {},
};

export { manifest };
