import { VRMUtils } from '@pixiv/three-vrm';
import { Euler, Group, MeshNormalMaterial, MeshPhysicalMaterial, Quaternion, Vector3 } from 'three';
import { EVENTS } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

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

		this.mesh = this.gltf.scene;
		// this.mesh.visible = false;

		const material = new MeshPhysicalMaterial({
			metalness: 0.5,
			roughness: 0.5,
			// transmission: 0.8,
			// thickness: 1,
		});
		// const material = new MeshNormalMaterial();
		this.mesh.traverse((object) => {
			if (object.isMesh) {
				object.castShadow = true;
				object.material = material;
			}
		});

		this.mesh.position.y = 0;
		this.mesh.rotation.y = Math.PI;
		this.add(this.mesh);
		this.mesh.castShadow = true;
	}

	onRender({ dt }) {
		if (this.vrm) {
			this.vrm.update(dt);
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
	}

	disableControl() {
		this.canControl = false;
		state.off(EVENTS.RIG_COMPUTED, this.updateRig);
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
