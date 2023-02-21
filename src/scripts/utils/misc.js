import { CubeUVReflectionMapping, EquirectangularReflectionMapping, EquirectangularRefractionMapping, PMREMGenerator } from 'three';

function computeEnvmap(renderer, texture, refraction = false) {
	texture.mapping = refraction ? EquirectangularRefractionMapping : EquirectangularReflectionMapping;
	const pmremGenerator = new PMREMGenerator(renderer);
	pmremGenerator.compileEquirectangularShader();

	const pmrem = pmremGenerator.fromEquirectangular(texture).texture;

	const envMapCubeUVHeight = !!pmrem && pmrem.mapping === CubeUVReflectionMapping ? pmrem.image.height : null;
	if (envMapCubeUVHeight === null) return null;
	const maxMip = Math.log2(envMapCubeUVHeight) - 2;
	const texelHeight = 1.0 / envMapCubeUVHeight;
	const texelWidth = 1.0 / (3 * Math.max(Math.pow(2, maxMip), 7 * 16));
	pmrem.userData = {
		...pmrem.userData,
		texelWidth,
		texelHeight,
		maxMip,
	};

	texture.dispose();
	pmremGenerator.dispose();

	return pmrem;
}

function disposeMesh(mesh) {
	mesh.traverse((child) => {
		if (child.material) {
			child.material.map?.dispose();
			child.material.normalMap?.dispose();
			child.material.alphaMap?.dispose();
			child.material.aoMap?.dispose();
			child.material.specularMap?.dispose();
			child.material.metalnessMap?.dispose();
			child.material.emissiveMap?.dispose();
			child.material.dispose();

			if (child.material.uniforms) {
				Object.values(child.material.uniforms).forEach((u) => {
					if (u.value?.isTexture) u.value.dispose();
				});
			}

			if (child.userData?.uniforms) {
				Object.values(child.userData.uniforms).forEach((u) => {
					if (u.value?.isTexture) u.value.dispose();
				});
			}
		}
		child.geometry?.dispose();
	});
}

export { computeEnvmap, disposeMesh };
