import { VRMUtils } from '@pixiv/three-vrm';
import {
	AnimationMixer,
	BufferAttribute,
	BufferGeometry,
	CircleGeometry,
	ClampToEdgeWrapping,
	CylinderGeometry,
	Euler,
	Float32BufferAttribute,
	FloatType,
	GLSL3,
	Group,
	HalfFloatType,
	InstancedBufferAttribute,
	InstancedMesh,
	MathUtils,
	Mesh,
	MeshBasicMaterial,
	MeshDepthMaterial,
	MeshStandardMaterial,
	NearestFilter,
	Object3D,
	OctahedronGeometry,
	PerspectiveCamera,
	PlaneGeometry,
	Quaternion,
	RGBADepthPacking,
	RGBAFormat,
	Scene,
	ShaderMaterial,
	SkinnedMesh,
	Texture,
	Triangle,
	Uint16BufferAttribute,
	Vector2,
	Vector3,
	Vector4,
	WebGLMultipleRenderTargets,
	WebGLRenderTarget,
} from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import { EVENTS, POSE } from '@utils/constants.js';
import customizeMaterial from '@utils/customizeMaterial.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { VIDEO_SIZE } from '@scripts/Tensorflow/TensorflowCamera.js';
import particlesPositionShader from '../Materials/ParticulesMan/particles/position.glsl';
import particlesVelocityShader from '../Materials/ParticulesMan/particles/velocity.glsl';
import skinnedMeshFragmentShader from '../Materials/ParticulesMan/skinnedMesh/fragment.glsl';
import skinnedMeshVertexShader from '../Materials/ParticulesMan/skinnedMesh/vertex.glsl';
import { POSE_CONNECTIONS } from './Skeleton.js';

class Avatar extends Group {
	constructor() {
		super();
		state.register(this);
	}

	// onAttach() {
	// 	this.material = new MeshBasicMaterial({ color: 0xffffff });

	// 	this.scene = new Scene();
	// 	this.camera = new PerspectiveCamera();
	// 	this.camera.position.set(0.5, 0.5, 1);
	// 	this.camera.lookAt(0.5, 0.5, 0);
	// 	this.fbo = new WebGLRenderTarget(VIDEO_SIZE.width * 0.1, VIDEO_SIZE.height * 0.1, { magFilter: NearestFilter });

	// 	this.tubes = new Group();
	// 	this.wPosMaterial = new ShaderMaterial({
	// 		vertexShader: `
	// varying vec4 vPosition;
	// void main() {
	// 	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	// 	vPosition = gl_Position;
	// }
	// `,
	// 		fragmentShader: `
	// varying vec4 vPosition;
	// void main() {
	// 	gl_FragColor = vPosition;
	// }
	// `,
	// 	});
	// 	POSE_CONNECTIONS.forEach(() => {
	// 		this.tubes.add(new Mesh(new CylinderGeometry(0.05, 0.05, 1, 32), this.wPosMaterial));
	// 	});
	// 	this.scene.add(this.tubes);

	// 	const geometry = new BufferGeometry();
	// 	this.vertices = new Float32Array(4 * 3);

	// 	geometry.setIndex([0, 1, 2, 1, 2, 3]);
	// 	geometry.setAttribute('position', new BufferAttribute(this.vertices, 3));

	// 	this.torso = new Mesh(geometry, this.wPosMaterial);
	// 	this.scene.add(this.torso);

	// 	this.head = new Mesh(new CircleGeometry(0.15, 10), this.wPosMaterial);
	// 	this.scene.add(this.head);

	// 	this.neck = new Mesh(new CylinderGeometry(0.05, 0.05, 0.1, 32), this.wPosMaterial);
	// 	this.scene.add(this.neck);

	// 	this.quad = new Mesh(
	// 		new PlaneGeometry(VIDEO_SIZE.width * 0.0005, VIDEO_SIZE.height * 0.0005),
	// 		new ShaderMaterial({
	// 			vertexShader: `
	// 			varying vec2 vUv;
	// 	void main() {
	// 		gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.0);
	// 		vUv = uv;
	// 	}
	// 	`,
	// 			fragmentShader: `
	// 	uniform sampler2D tTex;
	// 	varying vec2 vUv;

	// 	void main() {
	// 		gl_FragColor = texture2D(tTex, vUv);
	// 	}
	// 	`,
	// 			uniforms: {
	// 				tTex: { value: this.fbo.texture },
	// 				// tTex: { value: app.webgl.scene.leftHandParticles.sim.gpuCompute.getCurrentRenderTarget(app.webgl.scene.leftHandParticles.sim.pos).texture },
	// 			},
	// 		}),
	// 	);
	// 	this.quad.position.y = -0.2;
	// 	this.quad.position.x = 0.35;
	// 	this.quad.position.z = -1;
	// 	this.add(this.quad);
	// }

	// onRender() {
	// 	if (this.scene && app.webgl.camera) {
	// 		app.webgl.renderer.setRenderTarget(this.fbo);
	// 		app.webgl.renderer.clear(true, true, false);
	// 		app.webgl.renderer.render(this.scene, this.camera);
	// 		app.webgl.renderer.setRenderTarget(null);
	// 	}
	// }

	// enableControl() {
	// 	this.canControl = true;
	// 	// state.on(EVENTS.RIG_COMPUTED, this.updateRig);
	// 	// this.mesh.visible = true;
	// }

	// disableControl() {
	// 	this.canControl = false;
	// 	// state.off(EVENTS.RIG_COMPUTED, this.updateRig);
	// 	// this.mesh.visible = false;
	// }

	// onPlayerMoved(rig) {
	// 	if (!this.tubes) return;

	// 	POSE_CONNECTIONS.forEach((connection, i) => {
	// 		const src = rig.keypoints[connection[0]];
	// 		const dst = rig.keypoints[connection[1]];
	// 		const mesh = this.tubes.children[i];
	// 		if (src && dst && mesh) {
	// 			if (this.assertBoneIsInCamera(src, dst)) {
	// 				const srcV2 = new Vector2(1 - src.x / VIDEO_SIZE.width, 1 - src.y / VIDEO_SIZE.height);
	// 				const dstV2 = new Vector2(1 - dst.x / VIDEO_SIZE.width, 1 - dst.y / VIDEO_SIZE.height);
	// 				const armPos = srcV2.clone().add(dstV2).divideScalar(2);
	// 				mesh.position.set(armPos.x, armPos.y, 0);
	// 				mesh.scale.y = srcV2.distanceTo(dstV2) * 1.1;
	// 				mesh.lookAt(dstV2.x, dstV2.y, 0);
	// 				mesh.rotateX(Math.PI / 2);
	// 				mesh.visible = true;
	// 			} else {
	// 				mesh.visible = false;
	// 			}
	// 		}
	// 	});

	// 	this.vertices.set([
	// 		1 - rig.keypoints[POSE.LEFT_SHOULDER].x / VIDEO_SIZE.width,
	// 		1 - rig.keypoints[POSE.LEFT_SHOULDER].y / VIDEO_SIZE.height,
	// 		0.0,
	// 		1 - rig.keypoints[POSE.RIGHT_SHOULDER].x / VIDEO_SIZE.width,
	// 		1 - rig.keypoints[POSE.RIGHT_SHOULDER].y / VIDEO_SIZE.height,
	// 		0.0,
	// 		1 - rig.keypoints[POSE.LEFT_HIP].x / VIDEO_SIZE.width,
	// 		1 - rig.keypoints[POSE.LEFT_HIP].y / VIDEO_SIZE.height,
	// 		0.0,
	// 		1 - rig.keypoints[POSE.RIGHT_HIP].x / VIDEO_SIZE.width,
	// 		1 - rig.keypoints[POSE.RIGHT_HIP].y / VIDEO_SIZE.height,
	// 		0.0,
	// 	]);

	// 	this.torso.geometry.attributes.position.array = this.vertices;
	// 	this.torso.geometry.attributes.position.needsUpdate = true;

	// 	this.head.position.set(1 - rig.keypoints[POSE.NOSE].x / VIDEO_SIZE.width, 1 - rig.keypoints[POSE.NOSE].y / VIDEO_SIZE.height, 0.0);

	// 	const neckBase = new Vector2(
	// 		(1 - rig.keypoints[POSE.LEFT_SHOULDER].x / VIDEO_SIZE.width + 1 - rig.keypoints[POSE.RIGHT_SHOULDER].x / VIDEO_SIZE.width) / 2,
	// 		(1 - rig.keypoints[POSE.LEFT_SHOULDER].y / VIDEO_SIZE.height + 1 - rig.keypoints[POSE.RIGHT_SHOULDER].y / VIDEO_SIZE.height) / 2,
	// 	);
	// 	const neckTop = new Vector2(1 - rig.keypoints[POSE.NOSE].x / VIDEO_SIZE.width, 1 - rig.keypoints[POSE.NOSE].y / VIDEO_SIZE.height);

	// 	const neckPos = neckBase.clone().add(neckTop).divideScalar(2);

	// 	this.neck.position.set(neckPos.x, neckPos.y, 0.0);
	// 	this.neck.scale.y = neckBase.distanceTo(neckTop) * 10;
	// 	this.neck.lookAt(neckTop.x, neckTop.y, 0);
	// 	this.neck.rotateX(Math.PI / 2);
	// }

	// assertBoneIsInCamera(src, dst) {
	// 	const srcIsInCamera = src.x > 0 && src.x < VIDEO_SIZE.width && src.y > 0 && src.y < VIDEO_SIZE.height;
	// 	const dstIsInCamera = dst.x > 0 && dst.x < VIDEO_SIZE.width && dst.y > 0 && dst.y < VIDEO_SIZE.height;
	// 	return srcIsInCamera || dstIsInCamera;
	// }

	onAttach() {
		this.gltf = app.core.assetsManager.get('avatar');
		VRMUtils.removeUnnecessaryJoints(this.gltf.scene);
		VRMUtils.removeUnnecessaryVertices(this.gltf.scene);

		this.vrm = this.gltf.userData.vrm;
		VRMUtils.rotateVRM0(this.vrm);

		this.mesh = this.gltf.scene;
		this.mesh.visible = false;

		this.material = new MeshStandardMaterial({
			metalness: 0.4,
			roughness: 0.8,
		});

		this.mesh.traverse((object) => {
			if (object.isMesh) {
				// object.castShadow = true;
				object.material = this.material;
			}
		});

		this.add(this.mesh);
		this.mesh.castShadow = true;

		this.addParticles();

		this.quad = new Mesh(
			new PlaneGeometry(VIDEO_SIZE.width * 0.0005, VIDEO_SIZE.height * 0.0005),
			new ShaderMaterial({
				vertexShader: `
				varying vec2 vUv;
		void main() {
			gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.0);
			vUv = uv;
		}
		`,
				fragmentShader: `
		uniform sampler2D tTex;
		varying vec2 vUv;

		void main() {
			gl_FragColor = texture2D(tTex, vUv);
		}
		`,
				uniforms: {
					tTex: { value: this.vertexStore.positionMap },
					// tTex: { value: app.webgl.scene.leftHandParticles.sim.gpuCompute.getCurrentRenderTarget(app.webgl.scene.leftHandParticles.sim.pos).texture },
				},
			}),
		);
		this.quad.position.y = -0.2;
		this.quad.position.x = 0.35;
		this.quad.position.z = -1;
		this.add(this.quad);
	}

	onRender({ dt }) {
		if (this.vrm) {
			this.vrm.update(dt);
		}
		if (this.ready) {
			// this.mixer.update(dt);
			this.vertexStore.update();

			this.commonUniforms.uDelta.value = dt * 60;
			this.commonUniforms.uTime.value += dt;
			this.gpuCompute.compute();

			this.particlesUniforms.uVelocityMap.value = this.gpuCompute.getCurrentRenderTarget(this.velocityVariable).texture;
			this.particlesUniforms.uPositionMap.value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture;
		}
	}

	// onPlayerMoved(rig) {
	// 	if (!this.vrm) return;

	// 	const poses = rig.poseLandmarks;
	// 	const vertY = [];

	// 	POSE_CONNECTIONS.forEach((connection) => {
	// 		const start = connection[0];
	// 		const end = connection[1];
	// 		vertY.push(1 - poses[start].y, 1 - poses[end].y);
	// 	});
	// 	this.offsetY = Math.min(...vertY);
	// 	console.log('min', Math.min(...vertY));
	// 	console.log('max', Math.max(...vertY));
	// 	console.log('min hip', Math.min(1 - poses[POSE.LEFT_HIP].y, 1 - poses[POSE.RIGHT_HIP].y));
	// 	console.log('max hip', Math.max(1 - poses[POSE.LEFT_HIP].y, 1 - poses[POSE.RIGHT_HIP].y));
	// 	console.log('min ankle', Math.min(1 - poses[POSE.LEFT_ANKLE].y, 1 - poses[POSE.RIGHT_ANKLE].y));
	// 	// this.mesh.position.y = this.offsetY;
	// }

	enableControl() {
		this.canControl = true;
		state.on(EVENTS.RIG_COMPUTED, this.updateRig);
		this.mesh.visible = true;
	}

	disableControl() {
		this.canControl = false;
		state.off(EVENTS.RIG_COMPUTED, this.updateRig);
		this.mesh.visible = false;
	}

	updateRig = (riggedPose) => {
		this.rigRotation('hips', riggedPose.Hips.rotation, 0.7);
		// this.rigPosition(
		// 	'hips',
		// 	{
		// 		x: riggedPose.Hips.position.x,
		// 		y: riggedPose.Hips.position.y + 1,
		// 		z: -riggedPose.Hips.position.z,
		// 	},
		// 	1,
		// 	0.07,
		// );

		this.rigRotation('chest', riggedPose.Spine, 0.25, 0.3);
		this.rigRotation('spine', riggedPose.Spine, 0.45, 0.3);

		this.rigRotation('rightUpperArm', riggedPose.RightUpperArm, 1, 0.3);
		this.rigRotation('rightLowerArm', riggedPose.RightLowerArm, 1, 0.3);
		this.rigRotation('leftUpperArm', riggedPose.LeftUpperArm, 1, 0.3);
		this.rigRotation('leftLowerArm', riggedPose.LeftLowerArm, 1, 0.3);

		this.rigRotation('leftUpperLeg', riggedPose.LeftUpperLeg, 1, 0.3);
		this.rigRotation('leftLowerLeg', riggedPose.LeftLowerLeg, 1, 0.3);
		this.rigRotation('rightUpperLeg', riggedPose.RightUpperLeg, 1, 0.3);
		this.rigRotation('rightLowerLeg', riggedPose.RightLowerLeg, 1, 0.3);

		this.rigRotation('rightHand', riggedPose.RightHand, 1, 0.3);
		this.rigRotation('lefttHand', riggedPose.LeftHand, 1, 0.3);
	};

	rigRotation = (name, rotation = { x: 0, y: 0, z: 0 }, dampener = 1, lerpAmount = 0.3) => {
		if (!this.vrm) {
			return;
		}
		const Part = this.vrm.humanoid.getNormalizedBoneNode(name);
		if (!Part) {
			return;
		}

		const euler = new Euler(rotation.x * dampener, rotation.y * dampener, rotation.z * dampener, rotation.rotationOrder || 'XYZ');
		const quaternion = new Quaternion().setFromEuler(euler);
		Part.quaternion.slerp(quaternion, lerpAmount);
	};

	rigPosition = (name, position = { x: 0, y: 0, z: 0 }, dampener = 1, lerpAmount = 0.3) => {
		if (!this.vrm) {
			return;
		}
		const Part = this.vrm.humanoid.getNormalizedBoneNode(name);
		if (!Part) {
			return;
		}
		const vector = new Vector3(position.x * dampener, position.y * dampener, position.z * dampener);
		Part.position.lerp(vector, lerpAmount);
	};

	/**
	 * This demo is implemented in 3 steps.
	 * 1. Write SkinnedMesh vertex positions to texture.
	 * 2. Advance particle simulation and write position and velocity to texture.
	 * 3. Replace particles with InstancedMesh and finally render with MeshStandardMaterial.
	 */
	addParticles() {
		const glbRoot = this.gltf;

		/**
		 * Create an object that bakes the transformed vertex positions and colors of the SinnedMesh into textures
		 */
		this.vertexStore = this.prepareSkinnedMeshSampler(glbRoot.scene, 20000);
		const numParticles = this.vertexStore.numVertices;

		/**
		 * AnimationMixer
		 */
		// this.mixer = new AnimationMixer(glbRoot.scene);
		// this.mixer.timeScale = 0.25;
		// this.mixer.clipAction(glbRoot.animations[0]).play();
		// this.mixer.update(0);
		this.vertexStore.update();

		// if (webgl.gui) {
		//   const folder = webgl.gui.addFolder('Animation')
		//   const options = {
		// 	FastRun: 0,
		// 	Dancing: 1,
		// 	NorthernSoulSpinCombo: 2,
		//   }
		//   folder
		// 	.add({ animation: 0 }, 'animation', options)
		// 	.onChange((index: number) => {
		// 	  mixer.stopAllAction()
		// 	  mixer.clipAction(glbRoot.animations[index]).play()
		// 	})
		//   folder.add(mixer, 'timeScale').min(0).max(2).step(0.01)
		// }

		/**
		 * Create GPUComputationRenderer for particle simulation
		 */
		this.gpuCompute = new GPUComputationRenderer(this.vertexStore.mapWidth, this.vertexStore.mapHeight, app.webgl.renderer);
		if (app.webgl.renderer.capabilities.isWebGL2 === false) {
			this.gpuCompute.setDataType(HalfFloatType);
		}

		const initialVelocityMap = this.gpuCompute.createTexture();
		const initialPositionMap = this.gpuCompute.createTexture();
		(function fillTextures() {
			const positionArray = initialVelocityMap.image.data;
			const velocityArray = initialPositionMap.image.data;
			for (let i = 0; i < numParticles; i++) {
				const i4 = i * 4;
				const life = 1.0 + 2.0 * Math.random();
				positionArray[i4 + 0] = 0;
				positionArray[i4 + 1] = 0;
				positionArray[i4 + 2] = 0;
				positionArray[i4 + 3] = life;
				velocityArray[i4 + 0] = 0;
				velocityArray[i4 + 1] = 0;
				velocityArray[i4 + 2] = 0;
				velocityArray[i4 + 3] = life;
			}
		})();

		this.velocityVariable = this.gpuCompute.addVariable('uVelocityMap', particlesVelocityShader, initialVelocityMap);
		this.positionVariable = this.gpuCompute.addVariable('uPositionMap', particlesPositionShader, initialPositionMap);
		this.gpuCompute.setVariableDependencies(this.velocityVariable, [this.velocityVariable, this.positionVariable]);
		this.gpuCompute.setVariableDependencies(this.positionVariable, [this.velocityVariable, this.positionVariable]);

		this.commonUniforms = {
			uDelta: {
				value: 0,
			},
			uTime: {
				value: 0,
			},
			uTargetPositionMap: {
				value: this.vertexStore.positionMap,
			},
			uPrevTargetPositionMap: {
				value: this.vertexStore.prevPositionMap,
			},
		};
		const velocityUniforms = {
			...this.commonUniforms,
			uDieSpeed: {
				value: 0.03,
			},
			uCurlSize: {
				value: 0.1,
			},
			uCurlStrength: {
				value: 0.012,
			},
			uCurlChangeSpeed: {
				value: 0.2,
			},
		};
		const positionUniforms = {
			...this.commonUniforms,
		};
		Object.assign(this.velocityVariable.material.uniforms, velocityUniforms);
		Object.assign(this.positionVariable.material.uniforms, positionUniforms);

		// if (webgl.gui) {
		//   const folder = webgl.gui.addFolder('Particles')
		//   folder
		// 	.add(velocityUniforms.uCurlSize, 'value')
		// 	.min(0.05)
		// 	.max(0.5)
		// 	.step(0.01)
		// 	.name('curlSize')
		//   folder
		// 	.add(velocityUniforms.uCurlStrength, 'value')
		// 	.min(0.003)
		// 	.max(0.03)
		// 	.step(0.001)
		// 	.name('curlStrength')
		//   folder
		// 	.add(velocityUniforms.uCurlChangeSpeed, 'value')
		// 	.min(0)
		// 	.max(1.0)
		// 	.step(0.01)
		// 	.name('curlChangeSpeed')
		//   folder
		// 	.add(velocityUniforms.uDieSpeed, 'value')
		// 	.min(0.01)
		// 	.max(0.1)
		// 	.step(0.01)
		// 	.name('dieSpeed')
		// }

		const error = this.gpuCompute.init();
		if (error !== null) {
			console.error(error);
		}

		/**
		 * Create InstancedMesh and shaders to render particles
		 */
		const geometry = (() => {
			const geom = new OctahedronGeometry().scale(0.004, 0.005, 0.012);
			// const geom = new THREE.BoxGeometry().scale(0.005, 0.004, 0.012)

			geom.computeVertexNormals();

			const refs = new Float32Array(numParticles);
			for (let i = 0; i < numParticles; i++) {
				refs[i] = i;
			}
			geom.setAttribute('aReference', new InstancedBufferAttribute(refs, 1));

			return geom;
		})();

		this.particlesUniforms = {
			uVelocityMap: {
				value: null,
			},
			uPositionMap: {
				value: null,
			},
			uColorMap: {
				value: this.vertexStore.colorMap,
			},
			uMapSize: {
				value: new Vector2(this.vertexStore.mapWidth, this.vertexStore.mapHeight),
			},
		};

		const { material } = customizeMaterial(
			new MeshStandardMaterial({
				flatShading: true,
				metalness: 0.4,
				roughness: 0.9,
				envMapIntensity: 4,
				defines: {
					USE_COLOR: '',
				},
			}),
			this.particlesUniforms,
			this.customizeShader,
		);
		// if (isDebug && webgl.gui) {
		//   const folder = webgl.gui.addFolder('Material')
		//   folder.add(material, 'metalness').min(0).max(1).step(0.01)
		//   folder.add(material, 'roughness').min(0).max(1).step(0.01)
		//   folder.add(material, 'envMapIntensity').min(0).max(10).step(0.01)
		// }
		const { material: depthMaterial } = customizeMaterial(
			new MeshDepthMaterial({
				depthPacking: RGBADepthPacking,
			}),
			this.particlesUniforms,
			this.customizeShader,
		);

		const particles = new InstancedMesh(geometry, material, numParticles);
		particles.castShadow = true;
		particles.receiveShadow = true;
		particles.customDepthMaterial = depthMaterial;

		const dummy = new Object3D();
		for (let i = 0; i < numParticles; i++) {
			particles.setMatrixAt(i, dummy.matrix);
		}

		app.webgl.scene.add(particles);

		this.ready = true;
		// webgl.events.tick.on((deltaTime) => {
		//   mixer.update(deltaTime)
		//   vertexStore.update()

		//   commonUniforms.uDelta.value = deltaTime * 60
		//   commonUniforms.uTime.value += deltaTime
		//   gpuCompute.compute()

		//   particlesUniforms.uVelocityMap.value =
		// 	gpuCompute.getCurrentRenderTarget(velocityVariable).texture
		//   particlesUniforms.uPositionMap.value =
		// 	gpuCompute.getCurrentRenderTarget(positionVariable).texture
		// })
	}

	customizeShader(shader) {
		shader.vertexShader = shader.vertexShader.replace(
			'#include <common>',
			/* glsl */ `
			#include <common>
	
			uniform sampler2D uVelocityMap;
			uniform sampler2D uPositionMap;
			uniform sampler2D uColorMap;
			uniform ivec2 uMapSize;
	
			attribute float aReference;
	
			vec2 getReference(float index) {
			  return vec2(
				float(int(index) % uMapSize.x) / float(uMapSize.x - 1),
				float(int(index) / uMapSize.x) / float(uMapSize.y - 1)
			  ); 
			}
	
			mat3 getRotation(vec3 velocity) {
			  velocity.z *= -1.;
			  float xz = length( velocity.xz );
			  float xyz = 1.;
			  float x = sqrt( 1. - velocity.y * velocity.y );
			  float cosry = velocity.x / xz;
			  float sinry = velocity.z / xz;
			  float cosrz = x / xyz;
			  float sinrz = velocity.y / xyz;
			  mat3 maty =  mat3( cosry, 0, -sinry, 0    , 1, 0     , sinry, 0, cosry );
			  mat3 matz =  mat3( cosrz , sinrz, 0, -sinrz, cosrz, 0, 0     , 0    , 1 );
			  return maty * matz;
			}
	
			void displace(out vec3 displacedPosition, out vec3 displacedNormal, out vec3 displacedColor) {
			  vec2 ref = getReference(aReference);
			  vec4 positionData = texture2D(uPositionMap, ref);
			  vec3 worldPosition = positionData.xyz;
			  vec3 velocity = texture2D(uVelocityMap, ref).xyz;
			  float life = positionData.w;
			  vec3 vertexColor = texture2D(uColorMap, ref).xyz;
	
			  mat3 particleRotation = getRotation(normalize(velocity));
			  vec3 particleScale = vec3(
				100.0 * length(velocity) + 15.0,
				1.0,
				1.0
			  );
			  displacedPosition = position;
			  displacedPosition *= clamp(smoothstep(0.0, 0.5, life), 0.0, 1.0) * particleScale;
			  displacedPosition = particleRotation * displacedPosition + worldPosition;
			  displacedNormal = normalize(particleRotation * normal / particleScale);
			  displacedColor = vertexColor;
			}
		  `,
		);
		shader.vertexShader = shader.vertexShader.replace(
			'#include <uv_vertex>',
			/* glsl */ `
			vec3 displacedPosition = vec3(0.0);
			vec3 displacedNormal = vec3(0.0);
			vec3 displacedColor = vec3(0.0);
			displace(displacedPosition, displacedNormal, displacedColor);
	
			#include <uv_vertex>
		  `,
		);
		shader.vertexShader = shader.vertexShader.replace(
			'#include <color_vertex>',
			/* glsl */ `
			#include <color_vertex>
	
			#ifdef USE_COLOR
			  vColor.xyz = displacedColor;
			#endif
		  `,
		);
		shader.vertexShader = shader.vertexShader.replace(
			'#include <beginnormal_vertex>',
			/* glsl */ `
			#include <beginnormal_vertex>
			objectNormal = displacedNormal;
		  `,
		);
		shader.vertexShader = shader.vertexShader.replace(
			'#include <begin_vertex>',
			/* glsl */ `
			#include <begin_vertex>
			transformed = displacedPosition;
		  `,
		);
	}

	prepareSkinnedMeshSampler(model, numSamples) {
		/**
		 * Find the SkinnedMesh
		 */
		let skinnedMesh = new SkinnedMesh();
		model.traverse((child) => {
			if (child instanceof SkinnedMesh) {
				skinnedMesh = child;
			}
		});

		if (!skinnedMesh) throw new Error('SkinnedMesh not found');

		if (Array.isArray(skinnedMesh.material)) {
			throw new Error('Array material is not supported');
		}

		// const colorMap: THREE.Texture = (skinnedMesh.material as any).map
		// if (!colorMap) throw new Error('diffuseMap not found')
		const colorMap = new Texture();

		const newGeometry = this.createPointsGeometryForSkin(skinnedMesh, numSamples);

		/**
		 * We want to store the animated vertex positions of the SkinnedMesh
		 * as the render target textures and use them in the next pass (particle simulation).
		 */
		const vertexStore = this.createVertexStore(newGeometry, colorMap);

		const container = new Group();
		container.scale.multiplyScalar(1);
		container.add(model);
		vertexStore.scene.add(container);

		skinnedMesh.geometry.dispose();
		skinnedMesh.geometry = vertexStore.geometry;

		skinnedMesh.material.dispose();
		skinnedMesh.material = vertexStore.material;

		// @ts-ignore
		skinnedMesh.isMesh = false;
		// @ts-ignore
		skinnedMesh.isPoints = true;

		return vertexStore;
	}

	/**
	 * Emulate the Transform Feedback of SkinnedMesh using the render target texture.
	 * https://stackoverflow.com/questions/29053870/retrieve-vertices-data-in-three-js
	 */
	createVertexStore(geometry, colorMap) {
		const numVertices = geometry.attributes.position.count;

		/**
		 * Add a vertex attribute to find the 2D coordinates of the fragment
		 * that will store the vertex position and color.
		 * One vertex corresponds to one fragment.
		 */
		const fragIndices = new Float32Array(numVertices);
		for (let i = 0; i < numVertices; i++) {
			fragIndices[i] = i;
		}
		geometry.setAttribute('aFragIndex', new Float32BufferAttribute(fragIndices, 1));

		const mapWidth = 512;
		const mapHeight = MathUtils.ceilPowerOfTwo(Math.ceil(numVertices / mapWidth));

		const renderTargetOptions = {
			depthBuffer: false,
			stencilBuffer: false,
			type: FloatType,
			format: RGBAFormat,
			minFilter: NearestFilter,
			magFilter: NearestFilter,
			wrapS: ClampToEdgeWrapping,
			wrapT: ClampToEdgeWrapping,
		};
		const renderTarget = new WebGLMultipleRenderTargets(mapWidth, mapHeight, 2, renderTargetOptions);
		renderTarget.texture[0].name = 'position';
		renderTarget.texture[1].name = 'color';

		/**
		 * An object to copy the texture where the vertex positions are stored.
		 * It will be used later to calculate the vertex velocity.
		 */
		const positionMapSaver = this.createSavePass(renderTarget.texture[0], mapWidth, mapHeight, renderTargetOptions);

		const material = new ShaderMaterial({
			defines: {
				USE_UV: '',
			},
			uniforms: {
				uMapWidth: {
					value: mapWidth,
				},
				uMapHeight: {
					value: mapHeight,
				},
				uColorMap: {
					value: colorMap,
				},
			},
			glslVersion: GLSL3,
			vertexShader: skinnedMeshVertexShader,
			fragmentShader: skinnedMeshFragmentShader,
		});

		const scene = new Scene();

		return {
			numVertices,
			mapWidth,
			mapHeight,
			geometry,
			material,
			scene,
			positionMap: renderTarget.texture[0],
			colorMap: renderTarget.texture[1],
			prevPositionMap: positionMapSaver.texture,
			update,
		};

		function update() {
			positionMapSaver.update();

			const renderer = app.webgl.renderer;
			const camera = app.webgl.camera;
			const originalRenderTarget = renderer.getRenderTarget();
			renderer.setRenderTarget(renderTarget);
			renderer.render(scene, camera);
			renderer.setRenderTarget(originalRenderTarget);
		}
	}

	/**
	 * Create point cloud geometry capable of skin animation
	 */
	createPointsGeometryForSkin(skinnedMesh, numSamples) {
		const sampler = this.createSkinnedMeshSurfaceSampler(skinnedMesh);

		const sample = {
			position: new Vector3(),
			normal: new Vector3(),
			skinIndex: new Vector4(),
			skinWeight: new Vector4(),
			uv: new Vector2(),
		};

		const positions = new Float32Array(numSamples * 3);
		const normals = new Float32Array(numSamples * 3);
		const uvs = new Float32Array(numSamples * 2);
		const skinIndices = new Uint16Array(numSamples * 4);
		const skinWeights = new Float32Array(numSamples * 4);
		for (let i = 0; i < numSamples; i++) {
			sampler(sample.position, sample.normal, sample.uv, sample.skinIndex, sample.skinWeight);

			positions[i * 3 + 0] = sample.position.x;
			positions[i * 3 + 1] = sample.position.y;
			positions[i * 3 + 2] = sample.position.z;

			normals[i * 3 + 0] = sample.normal.x;
			normals[i * 3 + 1] = sample.normal.y;
			normals[i * 3 + 2] = sample.normal.z;

			uvs[i * 2 + 0] = sample.uv.x;
			uvs[i * 2 + 1] = sample.uv.y;

			skinIndices[i * 4 + 0] = sample.skinIndex.x;
			skinIndices[i * 4 + 1] = sample.skinIndex.y;
			skinIndices[i * 4 + 2] = sample.skinIndex.z;
			skinIndices[i * 4 + 3] = sample.skinIndex.w;

			skinWeights[i * 4 + 0] = sample.skinWeight.x;
			skinWeights[i * 4 + 1] = sample.skinWeight.y;
			skinWeights[i * 4 + 2] = sample.skinWeight.z;
			skinWeights[i * 4 + 3] = sample.skinWeight.w;
		}

		const geometry = new BufferGeometry();
		geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
		geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
		geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
		geometry.setAttribute('skinIndex', new Uint16BufferAttribute(skinIndices, 4));
		geometry.setAttribute('skinWeight', new Float32BufferAttribute(skinWeights, 4));
		return geometry;
	}

	/**
	 * Resample vertices uniformly from the SkinnedMesh surface.
	 * Skin weights are copied from the nearest vertex.
	 */
	createSkinnedMeshSurfaceSampler(mesh) {
		const sampler = new MeshSurfaceSampler(mesh).build();
		const positionAttribute = getAttribute('position');
		const uvAttribute = getAttribute('uv');
		const skinIndexAttribute = getAttribute('skinIndex');
		const skinWeightAttribute = getAttribute('skinWeight');

		const face = new Triangle();
		const uvFace = [new Vector2(), new Vector2(), new Vector2()];
		const p = new Vector3();

		return sample;

		function getAttribute(name) {
			const attribute = mesh.geometry.getAttribute(name);
			if (attribute instanceof BufferAttribute) {
				return attribute;
			}
			return null;
		}

		function sample(targetPosition, targetNormal, targetUv, targetSkinIndex, targetSkinWeight) {
			const cumulativeTotal = sampler.distribution[sampler.distribution.length - 1];

			const faceIndex = sampler.binarySearch(Math.random() * cumulativeTotal);

			let u = Math.random();
			let v = Math.random();

			if (u + v > 1) {
				u = 1 - u;
				v = 1 - v;
			}

			if (positionAttribute) {
				face.a.fromBufferAttribute(positionAttribute, faceIndex * 3);
				face.b.fromBufferAttribute(positionAttribute, faceIndex * 3 + 1);
				face.c.fromBufferAttribute(positionAttribute, faceIndex * 3 + 2);

				if (!face.a.x) return;

				if (targetPosition) {
					targetPosition
						.set(0, 0, 0)
						.addScaledVector(face.a, u)
						.addScaledVector(face.b, v)
						.addScaledVector(face.c, 1 - (u + v));
				}

				if (targetNormal !== undefined) {
					face.getNormal(targetNormal);
				}
			}

			if (targetUv && uvAttribute) {
				uvFace[0].fromBufferAttribute(uvAttribute, faceIndex * 3);
				uvFace[1].fromBufferAttribute(uvAttribute, faceIndex * 3 + 1);
				uvFace[2].fromBufferAttribute(uvAttribute, faceIndex * 3 + 2);

				targetUv
					.set(0, 0)
					.addScaledVector(uvFace[0], u)
					.addScaledVector(uvFace[1], v)
					.addScaledVector(uvFace[2], 1 - (u + v));
			}

			if (positionAttribute) {
				let minDistance = Number.POSITIVE_INFINITY;
				let nearestVertIndex = -1;
				for (let i = 0; i < 3; i++) {
					const vertIndex = faceIndex * 3 + i;
					p.fromBufferAttribute(positionAttribute, vertIndex);
					const distance = p.distanceTo(targetPosition);
					if (distance < minDistance) {
						minDistance = distance;
						nearestVertIndex = vertIndex;
					}
				}

				if (targetSkinIndex && skinIndexAttribute) {
					targetSkinIndex.fromBufferAttribute(skinIndexAttribute, nearestVertIndex);
				}

				if (targetSkinWeight && skinWeightAttribute) {
					targetSkinWeight.fromBufferAttribute(skinWeightAttribute, nearestVertIndex);
				}
			}
		}
	}

	createSavePass(texture, width, height, options) {
		const renderTarget = new WebGLRenderTarget(width, height, options);

		const scene = new Scene();
		const uniforms = {
			uTexture: {
				value: texture,
			},
		};
		const material = new ShaderMaterial({
			uniforms,
			vertexShader: /* glsl */ `
		varying vec2 vUv;
  
		void main() {
		  gl_Position = vec4(position, 1.0);
		  vUv = uv;
		}
	  `,
			fragmentShader: /* glsl */ `
		uniform sampler2D uTexture;
		varying vec2 vUv;
  
		void main() {
		  gl_FragColor = texture2D(uTexture, vUv);
		}
	  `,
		});
		scene.add(new Mesh(new PlaneGeometry(2, 2), material));
		return {
			texture: renderTarget.texture,
			update,
		};

		function update() {
			const renderer = app.webgl.renderer;
			const camera = app.webgl.camera;
			const originalRenderTarget = renderer.getRenderTarget();
			renderer.setRenderTarget(renderTarget);
			renderer.render(scene, camera);
			renderer.setRenderTarget(originalRenderTarget);
		}
	}
}

export { Avatar };
