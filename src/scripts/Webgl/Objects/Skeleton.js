import { BufferGeometry, Float32BufferAttribute, Group, LineSegments, ShaderMaterial, Vector2 } from 'three';
import { Color } from 'three';
import fragmentShader from '@Webgl/Materials/Skeleton/fragment.fs';
import vertexShader from '@Webgl/Materials/Skeleton/vertex.vs';
import { POSE } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import { VIDEO_SIZE } from '@scripts/Tensorflow/TensorflowCamera.js';

export const POSE_CONNECTIONS = [
	// Chest
	[POSE.LEFT_SHOULDER, POSE.RIGHT_SHOULDER],
	[POSE.RIGHT_SHOULDER, POSE.RIGHT_HIP],
	[POSE.RIGHT_HIP, POSE.LEFT_HIP],
	[POSE.LEFT_HIP, POSE.LEFT_SHOULDER],

	// Right arm
	[POSE.RIGHT_SHOULDER, POSE.RIGHT_ELBOW],
	[POSE.RIGHT_ELBOW, POSE.RIGHT_WRIST],
	[POSE.RIGHT_WRIST, POSE.RIGHT_INDEX],

	// Left arm
	[POSE.LEFT_SHOULDER, POSE.LEFT_ELBOW],
	[POSE.LEFT_ELBOW, POSE.LEFT_WRIST],
	[POSE.LEFT_WRIST, POSE.LEFT_INDEX],

	// Right leg
	[POSE.RIGHT_HIP, POSE.RIGHT_KNEE],
	[POSE.RIGHT_KNEE, POSE.RIGHT_ANKLE],
	[POSE.RIGHT_ANKLE, POSE.RIGHT_FOOT_INDEX],

	// Left leg
	[POSE.LEFT_HIP, POSE.LEFT_KNEE],
	[POSE.LEFT_KNEE, POSE.LEFT_ANKLE],
	[POSE.LEFT_ANKLE, POSE.LEFT_FOOT_INDEX],
];

class Skeleton extends Group {
	constructor() {
		super();
		state.register(this);

		// this.material = new CustomShaderMaterial({
		// 	baseMaterial: LineBasicMaterial,
		// 	vertexShader: vertexShader,
		// 	fragmentShader: fragmentShader,
		// 	uniforms: {
		// 		uColor: { value: new Color(0xff0000) },
		// 	},
		// 	transparent: true,
		// });
		this.material = new ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				uColor: { value: new Color(0xff0000) },
			},
		});
		this.geometry = new BufferGeometry();
		this.show();
	}

	show() {
		this.skeleton = new LineSegments(this.geometry, this.material);
		// this.skeleton.position.x = 1.6;
		// this.skeleton.position.z = 1;
		this.skeleton.position.set(0, 0, 0);

		this.add(this.skeleton);
	}

	hide() {
		this.remove(this.skeleton);
	}

	onPlayerMoved(rig) {
		this.realtimePoses = rig.keypoints;
		this.createGeometry();
		// if (!this.realtimePoses) return;

		// const vertY = [];

		// POSE_CONNECTIONS.forEach((connection) => {
		// 	const start = connection[0];
		// 	const end = connection[1];
		// 	vertY.push(1 - this.poses[start].y, 1 - this.poses[end].y);
		// });
		// this.offset.y = Math.min(...vertY);
	}

	createGeometry() {
		if (!this.realtimePoses) return;

		// Normalized poses between 0-1 (0;0 is bottom-left, 1;1 is top-right)
		this.poses = this.realtimePoses.map((pose) => {
			return { x: 1 - pose.x / VIDEO_SIZE.width, y: 1 - pose.y / VIDEO_SIZE.height, name: pose.name };
		});

		const vertices = [];
		const vertX = [];
		const vertY = [];

		POSE_CONNECTIONS.forEach((connection) => {
			const start = connection[0];
			const end = connection[1];
			vertX.push(this.poses[start].x, this.poses[end].x);
			vertY.push(this.poses[start].y, this.poses[end].y);
		});

		this.height = Math.max(...vertY) - Math.min(...vertY);
		this.width = Math.max(...vertX) - Math.min(...vertX);
		this.offset = {
			x: Math.min(...vertX),
			y: Math.min(...vertY),
		};

		const project = (pose) => {
			const centeredPos = [(this.poses[pose].x - this.offset.x) / this.height - this.width / this.height / 2, (this.poses[pose].y - this.offset.y) / this.height - 0.5];
			// centeredPos[0] *= 0.8;
			// centeredPos[1] *= 0.8;
			const viewport = app.webgl.renderer.getSize(new Vector2());
			const cornerPos = [centeredPos[0] - this.width / this.height / 2 + viewport.x * 0.001, centeredPos[1] + 0.5 - viewport.y * 0.001];
			return cornerPos;
		};

		POSE_CONNECTIONS.forEach((connection) => {
			const start = connection[0];
			const end = connection[1];
			// vertices.push((1 - this.poses[start].x - this.offset.x - this.width / 2) / this.height + 3, (1 - this.poses[start].y - this.offset.y) / this.height, -5);
			// vertices.push((1 - this.poses[end].x - this.offset.x - this.width / 2) / this.height + 3, (1 - this.poses[end].y - this.offset.y) / this.height, -5);
			vertices.push(...project(start), -3);
			vertices.push(...project(end), -3);
		});

		this.geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
		this.geometry.attributes.position.needsUpdate = true;
	}
}

export { Skeleton };
