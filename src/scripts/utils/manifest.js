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

		sceneDiffuse: { path: `${import.meta.env.BASE_URL}assets/textures/scene/env/diffuse2.png`, priority: 2, callback: null },
		sceneNormal: { path: `${import.meta.env.BASE_URL}assets/textures/scene/env/normal2.png`, priority: 2, callback: null },
		sceneRoughness: { path: `${import.meta.env.BASE_URL}assets/textures/scene/env/roughness2.png`, priority: 2, callback: null },
		sceneAo: { path: `${import.meta.env.BASE_URL}assets/textures/scene/env/ao2.png`, priority: 2, callback: null },

		rampeDiffuse: { path: `${import.meta.env.BASE_URL}assets/textures/scene/rampe/diffuse.png`, priority: 2, callback: null },
		rampeNormal: { path: `${import.meta.env.BASE_URL}assets/textures/scene/rampe/normal.png`, priority: 2, callback: null },

		enceintesDiffuse: { path: `${import.meta.env.BASE_URL}assets/textures/scene/enceintes/diffuse.png`, priority: 2, callback: null },
		enceintesNormal: { path: `${import.meta.env.BASE_URL}assets/textures/scene/enceintes/normal.png`, priority: 2, callback: null },
		enceintesRoughness: { path: `${import.meta.env.BASE_URL}assets/textures/scene/enceintes/roughness.png`, priority: 2, callback: null },

		bombeDiffuse: { path: `${import.meta.env.BASE_URL}assets/textures/scene/bombe/diffuse.png`, priority: 2, callback: null },
		bombeNormal: { path: `${import.meta.env.BASE_URL}assets/textures/scene/bombe/normal.png`, priority: 2, callback: null },

		compteurDiffuse: { path: `${import.meta.env.BASE_URL}assets/textures/scene/compteur/diffuse.png`, priority: 2, callback: null },
		compteurNormal: { path: `${import.meta.env.BASE_URL}assets/textures/scene/compteur/normal.png`, priority: 2, callback: null },
		compteurRoughness: { path: `${import.meta.env.BASE_URL}assets/textures/scene/compteur/roughness.png`, priority: 2, callback: null },

		logoDiffuse: { path: `${import.meta.env.BASE_URL}assets/textures/scene/logo/diffuse.png`, priority: 2, callback: null },
		logoRoughness: { path: `${import.meta.env.BASE_URL}assets/textures/scene/logo/roughness.png`, priority: 2, callback: null },
		logoNormal: { path: `${import.meta.env.BASE_URL}assets/textures/scene/logo/normal.png`, priority: 2, callback: null },

		skateDiffuse: { path: `${import.meta.env.BASE_URL}assets/textures/scene/skate/diffuse.png`, priority: 2, callback: null },
		skateRoughness: { path: `${import.meta.env.BASE_URL}assets/textures/scene/skate/roughness.png`, priority: 2, callback: null },
		skateNormal: { path: `${import.meta.env.BASE_URL}assets/textures/scene/skate/normal.png`, priority: 2, callback: null },

		bancDiffuse: { path: `${import.meta.env.BASE_URL}assets/textures/scene/banc/diffuse.png`, priority: 2, callback: null },
		bancRoughness: { path: `${import.meta.env.BASE_URL}assets/textures/scene/banc/roughness.png`, priority: 2, callback: null },
		bancNormal: { path: `${import.meta.env.BASE_URL}assets/textures/scene/banc/normal.png`, priority: 2, callback: null },
		bancAo: { path: `${import.meta.env.BASE_URL}assets/textures/scene/banc/ao.png`, priority: 2, callback: null },

		ventilationIDiffuse: { path: `${import.meta.env.BASE_URL}assets/textures/scene/ventilation/inner/diffuse2.png`, priority: 2, callback: null },
		ventilationIRoughness: { path: `${import.meta.env.BASE_URL}assets/textures/scene/ventilation/inner/roughness2.png`, priority: 2, callback: null },
		ventilationINormal: { path: `${import.meta.env.BASE_URL}assets/textures/scene/ventilation/inner/normal2.png`, priority: 2, callback: null },
		ventilationIAo: { path: `${import.meta.env.BASE_URL}assets/textures/scene/ventilation/inner/ao2.png`, priority: 2, callback: null },

		ventilationODiffuse: { path: `${import.meta.env.BASE_URL}assets/textures/scene/ventilation/outer/diffuse2.png`, priority: 2, callback: null },
		ventilationORoughness: { path: `${import.meta.env.BASE_URL}assets/textures/scene/ventilation/outer/roughness2.png`, priority: 2, callback: null },
		ventilationONormal: { path: `${import.meta.env.BASE_URL}assets/textures/scene/ventilation/outer/normal2.png`, priority: 2, callback: null },
		ventilationOAo: { path: `${import.meta.env.BASE_URL}assets/textures/scene/ventilation/outer/ao2.png`, priority: 2, callback: null },

		cocaDiffuse: { path: `${import.meta.env.BASE_URL}assets/textures/scene/coca/diffuse.png`, priority: 2, callback: null },
		redbullIDiffuse: { path: `${import.meta.env.BASE_URL}assets/textures/scene/redbull/diffuseI.png`, priority: 2, callback: null },
		redbullODiffuse: { path: `${import.meta.env.BASE_URL}assets/textures/scene/redbull/diffuseO.png`, priority: 2, callback: null },

		noise: { path: `${import.meta.env.BASE_URL}assets/textures/noise.jpg`, priority: 2, callback: null },
		pixelSorting: { path: `${import.meta.env.BASE_URL}assets/textures/pixelSorting.jpg`, priority: 2, callback: null },
		glitch: { path: `${import.meta.env.BASE_URL}assets/textures/glitch.jpg`, priority: 2, callback: null },
		liquid: { path: `${import.meta.env.BASE_URL}assets/textures/liquid.jpg`, priority: 2, callback: null },

		logo: { path: `${import.meta.env.BASE_URL}assets/textures/logo.png`, priority: 2, callback: null },

		carpet: { path: `${import.meta.env.BASE_URL}assets/textures/carpet.png`, priority: 2, callback: null },
		roadrage: { path: `${import.meta.env.BASE_URL}assets/textures/roadrage.png`, priority: 2, callback: null },
		brushNoise: { path: `${import.meta.env.BASE_URL}assets/textures/brush-noise.png`, priority: 2, callback: null },

		rampeTexture: { path: `${import.meta.env.BASE_URL}assets/textures/rampe.png`, priority: 2, callback: null },
		// ...
	},
	envMaps: {
		envmap: { path: `${import.meta.env.BASE_URL}assets/textures/envmap.hdr`, critical: true, callback: null },
		// ...
	},
	models: {
		avatarDemo: { path: `${import.meta.env.BASE_URL}assets/models/avatar-demo-2.glb`, priority: 1, callback: null },
		// cube: { path: `${import.meta.env.BASE_URL}assets/models/cube.glb`, priority: 1, callback: null },
		scene: { path: `${import.meta.env.BASE_URL}assets/models/env.glb`, priority: 1, callback: null },
		sceneTex: { path: `${import.meta.env.BASE_URL}assets/models/envTex.glb`, priority: 1, callback: null },
		rampe: { path: `${import.meta.env.BASE_URL}assets/models/rampe.glb`, priority: 1, callback: null },
		finalScene: { path: `${import.meta.env.BASE_URL}assets/models/finalEnv2.glb`, priority: 1, callback: null },
		collider: { path: `${import.meta.env.BASE_URL}assets/models/collider.glb`, priority: 1, callback: null },
		// ...
	},
	jsons: {},
};

export { manifest };
