import { BoxGeometry, Group, Mesh, MeshNormalMaterial, MeshStandardMaterial, MirroredRepeatWrapping, PlaneGeometry, RepeatWrapping, Vector2, Vector3 } from 'three';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import RigCoords from './RigCoords.js';

export default class TrailSimulation extends Group {
	constructor() {
		super();
		state.register(this);
		this.init();
		this.pos = new Vector3();
	}

	init() {
		this.mesh = this.createMesh();
	}

	createMesh() {
		const geometry = new BoxGeometry();
		const material = new MeshNormalMaterial();
		const mesh = new Mesh(geometry, material);
		mesh.scale.set(0.5, 0.5, 0.5);
		// app.webgl.scene.add(mesh);
		mesh.position.z = -5;

		return mesh;
	}

	onRender() {
		RigCoords.update();
		// this.mesh.rotation.x += 0.05;
		// this.mesh.rotation.y += 0.05;

		// this.mesh.position.x = RigCoords.leftTest.x;
		// this.mesh.position.y = RigCoords.leftTest.y + 1;

		this.pos.lerp(new Vector3(RigCoords.leftWrist.x, RigCoords.leftWrist.y + 1, -2), 0.1);
		this.mesh.position.copy(this.pos);

		// console.log(this.pos.x);

		// this.mesh.position.z = RigCoords.leftTest.z - 5;
		// console.log(RigCoords.leftTest.z - 5);
	}
}
