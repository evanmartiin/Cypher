import { VRMUtils } from '@pixiv/three-vrm';
import { CylinderGeometry, Euler, Group, Mesh, MeshBasicMaterial, Quaternion, Scene, Vector2, Vector3, WebGLRenderTarget } from 'three';
import { EVENTS, POSE } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { VIDEO_SIZE } from '@scripts/Tensorflow/TensorflowCamera.js';
import { POSE_CONNECTIONS } from './Skeleton.js';

class Avatar extends Group {
	constructor() {
		super();
		state.register(this);
	}

	onAttach() {
		this.gltf = app.core.assetsManager.get('avatar');
		VRMUtils.removeUnnecessaryJoints(this.gltf.scene);
		VRMUtils.removeUnnecessaryVertices(this.gltf.scene);

		this.vrm = this.gltf.userData.vrm;
		VRMUtils.rotateVRM0(this.vrm);

		this.mesh = this.gltf.scene;
		this.mesh.visible = false;

		this.material = new MeshBasicMaterial({ color: 0xffffff });

		this.mesh.traverse((object) => {
			if (object.isMesh) {
				// object.castShadow = true;
				object.material = this.material;
			}
		});

		// this.add(this.mesh);
		this.mesh.castShadow = true;

		this.scene = new Scene();
		this.fbo = new WebGLRenderTarget(VIDEO_SIZE.width, VIDEO_SIZE.height);

		this.tubes = new Group();
		POSE_CONNECTIONS.forEach(() => {
			this.tubes.add(new Mesh(new CylinderGeometry(0.05, 0.05, 1, 32), this.material));
		});
		this.tubes.position.y = 1.5;
		this.scene.add(this.tubes);
	}

	onRender({ dt }) {
		if (this.vrm) {
			this.vrm.update(dt);
		}
		if (this.scene && app.webgl.camera) {
			app.webgl.renderer.setRenderTarget(this.fbo);
			app.webgl.renderer.clearColor();
			app.webgl.renderer.render(this.scene, app.webgl.camera);
			app.webgl.renderer.setRenderTarget(null);
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
		// state.on(EVENTS.RIG_COMPUTED, this.updateRig);
		this.mesh.visible = true;
	}

	disableControl() {
		this.canControl = false;
		// state.off(EVENTS.RIG_COMPUTED, this.updateRig);
		this.mesh.visible = false;
	}

	onPlayerMoved(rig) {
		if (!this.tubes) return;

		POSE_CONNECTIONS.forEach((connection, i) => {
			const src = rig.keypoints[connection[0]];
			const dist = rig.keypoints[connection[1]];
			const mesh = this.tubes.children[i];
			if (src && dist && mesh) {
				const srcV2 = new Vector2(1 - src.x / VIDEO_SIZE.width, 1 - src.y / VIDEO_SIZE.height);
				const distV2 = new Vector2(1 - dist.x / VIDEO_SIZE.width, 1 - dist.y / VIDEO_SIZE.height);
				const armPos = srcV2.clone().add(distV2).divideScalar(2);
				mesh.position.set(armPos.x, armPos.y, 0);
				mesh.scale.y = srcV2.distanceTo(distV2) * 1.1;
				mesh.lookAt(distV2.x, distV2.y + this.tubes.position.y, 0);
				mesh.rotateX(Math.PI / 2);
			}
		});
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
}

export { Avatar };
