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
		flares: { path: `${import.meta.env.BASE_URL}assets/textures/background-flares.jpg`, priority: 2, callback: null },
		normal: { path: `${import.meta.env.BASE_URL}assets/textures/normal.png`, priority: 2, callback: null },
		roughness: { path: `${import.meta.env.BASE_URL}assets/textures/roughness.jpg`, priority: 2, callback: null },
		// ...
	},
	envMaps: {
		envmap: { path: `${import.meta.env.BASE_URL}assets/textures/envmap.hdr`, critical: true, callback: null },
		// ...
	},
	models: {
		avatar: { path: `${import.meta.env.BASE_URL}assets/models/avatar.vrm`, priority: 1, callback: null },
		avatar2: { path: `${import.meta.env.BASE_URL}assets/models/avatar2.vrm`, priority: 1, callback: null },
		// ...
	},
	jsons: {},
};

export { manifest };
