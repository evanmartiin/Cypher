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

		baseTop: { path: `${import.meta.env.BASE_URL}assets/textures/ground/base.jpg`, priority: 2, callback: null },
		normalTop: { path: `${import.meta.env.BASE_URL}assets/textures/ground/normal.jpg`, priority: 2, callback: null },
		roughnessTop: { path: `${import.meta.env.BASE_URL}assets/textures/ground/roughness.jpg`, priority: 2, callback: null },
		aoTop: { path: `${import.meta.env.BASE_URL}assets/textures/ground/ao.jpg`, priority: 2, callback: null },

		normalGround2: { path: `${import.meta.env.BASE_URL}assets/textures/ground2/normalTest.jpg`, priority: 2, callback: null },
		roughnessGround2: { path: `${import.meta.env.BASE_URL}assets/textures/ground2/roughness2.jpg`, priority: 2, callback: null },
		baseGround2: { path: `${import.meta.env.BASE_URL}assets/textures/ground2/baseTest.jpg`, priority: 2, callback: null },

		normalGround3: { path: `${import.meta.env.BASE_URL}assets/textures/ground3/normal.jpg`, priority: 2, callback: null },
		roughnessGround3: { path: `${import.meta.env.BASE_URL}assets/textures/ground3/roughness.jpg`, priority: 2, callback: null },
		baseGround3: { path: `${import.meta.env.BASE_URL}assets/textures/ground3/base.jpg`, priority: 2, callback: null },

		normalGround4: { path: `${import.meta.env.BASE_URL}assets/textures/ground4/normal.jpg`, priority: 2, callback: null },
		roughnessGround4: { path: `${import.meta.env.BASE_URL}assets/textures/ground4/roughness.jpg`, priority: 2, callback: null },
		baseGround4: { path: `${import.meta.env.BASE_URL}assets/textures/ground4/base.jpg`, priority: 2, callback: null },

		normalGround5: { path: `${import.meta.env.BASE_URL}assets/textures/ground5/normal.jpg`, priority: 2, callback: null },
		roughnessGround5: { path: `${import.meta.env.BASE_URL}assets/textures/ground5/roughness.jpg`, priority: 2, callback: null },
		baseGround5: { path: `${import.meta.env.BASE_URL}assets/textures/ground5/base.jpg`, priority: 2, callback: null },

		normalGround6: { path: `${import.meta.env.BASE_URL}assets/textures/ground6/normal.jpg`, priority: 2, callback: null },
		roughnessGround6: { path: `${import.meta.env.BASE_URL}assets/textures/ground6/roughness.jpg`, priority: 2, callback: null },
		baseGround6: { path: `${import.meta.env.BASE_URL}assets/textures/ground6/base.jpg`, priority: 2, callback: null },

		test: { path: `${import.meta.env.BASE_URL}assets/textures/wall/test.jpg`, priority: 2, callback: null },
		test2: { path: `${import.meta.env.BASE_URL}assets/textures/wall/test2.jpg`, priority: 2, callback: null },
		test3: { path: `${import.meta.env.BASE_URL}assets/textures/wall/test3.jpg`, priority: 2, callback: null },
		baseWall: { path: `${import.meta.env.BASE_URL}assets/textures/wall/base.jpg`, priority: 2, callback: null },
		aoWall: { path: `${import.meta.env.BASE_URL}assets/textures/wall/ao.jpg`, priority: 2, callback: null },
		normalWall: { path: `${import.meta.env.BASE_URL}assets/textures/wall/normal.jpg`, priority: 2, callback: null },
		roughnessWall: { path: `${import.meta.env.BASE_URL}assets/textures/wall/roughness.jpg`, priority: 2, callback: null },

		sceneBase: { path: `${import.meta.env.BASE_URL}assets/textures/scene/base.jpg`, priority: 2, callback: null },
		sceneNormal: { path: `${import.meta.env.BASE_URL}assets/textures/scene/normal.jpg`, priority: 2, callback: null },
		sceneRoughness: { path: `${import.meta.env.BASE_URL}assets/textures/scene/roughness.jpg`, priority: 2, callback: null },
		sceneAo: { path: `${import.meta.env.BASE_URL}assets/textures/scene/ao.jpg`, priority: 2, callback: null },

		brush: { path: `${import.meta.env.BASE_URL}assets/textures/brush.jpg`, priority: 2, callback: null },
		outlineBrush: { path: `${import.meta.env.BASE_URL}assets/textures/outlineBrush.jpg`, priority: 2, callback: null },
		vat: { path: `${import.meta.env.BASE_URL}assets/textures/vat.png`, priority: 2, callback: null },

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
