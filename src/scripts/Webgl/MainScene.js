import { AmbientLight, Color, Fog, Group, IcosahedronGeometry, Mesh, MeshNormalMaterial, MeshStandardMaterial, PlaneGeometry, PointLight, Scene, ShaderChunk } from 'three';
import Environment from '@Webgl/Objects/Environment.js';
import { GroundReflector } from '@Webgl/Objects/GroundReflector.js';
import RigCoords from '@utils/RigCoords.js';
import { state } from '@scripts/State.js';
import { Avatar } from './Objects/Avatar.js';
import { AvatarDemo } from './Objects/AvatarDemo.js';
import { Crowd } from './Objects/Crowd.js';
import { CustomFog } from './Objects/CustomFog.js';
import { Particles } from './Objects/Particles.js';
import { Skeleton } from './Objects/Skeleton.js';
import { VolumetricSpots } from './Objects/VolumetricSpots.js';

class MainScene extends Scene {
	constructor() {
		super();
		state.register(this);

		this.avatar = new Avatar();
		this.add(this.avatar);
		this.avatarDemo = new AvatarDemo();
		this.add(this.avatarDemo);
		this.skeleton = new Skeleton();
		this.add(this.skeleton);
		// this.crowd = new Crowd();
		// this.add(this.crowd);
	}

	onAttach() {
		this.addLights();
		// this.addSpotLights();
		this.addGroundReflector();
		this.addEnvironment();
		this.addParticles();
		// this.fluidSimulation();
		this.addFog();
		// this.environment = computeEnvmap(app.webgl.renderer, app.core.assetsManager.get('envmap'), false);
		// app.debug?.mapping.add(this, 'Scene');
	}

	addLights() {
		const lightLeft = new PointLight('#0f0fff', 0.6);
		lightLeft.position.set(-5, 10, 0);

		const lightRight = new PointLight('#c12600', 1);
		lightRight.position.set(5, 10, 0);

		const lightTop = new PointLight('#ffffff', 0.9);
		lightTop.position.set(5, 10, 0);

		this.add(lightLeft, lightRight, lightTop);
	}

	addSpotLights() {
		const spotLights = new VolumetricSpots();
		this.add(spotLights);
	}

	addGroundReflector() {
		const groundReflector = new GroundReflector();
		groundReflector.position.y = 0.01;
		// groundReflector.rotation.y = Math.PI * 0.35;
		// groundReflector.position.z = 15;
		this.add(groundReflector);
	}

	addEnvironment() {
		const environment = new Environment();
		this.add(environment);
	}

	addParticles() {
		const leftHandParticles = new Particles(256, RigCoords.leftWrist, RigCoords.leftWristSpeed);
		const rightHandParticles = new Particles(256, RigCoords.rightWrist, RigCoords.rightWristSpeed);
		const leftFootParticles = new Particles(256, RigCoords.leftFoot, RigCoords.leftFootSpeed);
		const rightFootParticles = new Particles(256, RigCoords.rightFoot, RigCoords.rightFootSpeed);

		// this.add(leftHandParticles);
		// this.add(rightHandParticles, leftHandParticles);
		this.add(rightFootParticles, leftFootParticles, leftHandParticles, rightHandParticles);
	}
	addFog() {
		const customFog = new CustomFog();
		this.fog = customFog._fog;

		// ShaderChunk.fog_fragment =

		// mesh.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xefd1b5) });
		// mesh.material.onBeforeCompile = (shader) => {
		// 	shader.vertexShader = shader.vertexShader.replace(`#include <fog_pars_vertex>`, fogParsVert);
		// 	shader.vertexShader = shader.vertexShader.replace(`#include <fog_vertex>`, fogVert);
		// 	shader.fragmentShader = shader.fragmentShader.replace(`#include <fog_pars_fragment>`, fogParsFrag);
		// 	shader.fragmentShader = shader.fragmentShader.replace(`#include <fog_fragment>`, fogFrag);
		// };
	}

	onRender() {
		RigCoords.update();
		// console.log(RigCoords.leftWristSpeed);
	}

	// fluidSimulation() {
	// 	this.mesh = new FluidSimulation();
	// }
}

export { MainScene };
