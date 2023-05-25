import { CylinderGeometry, Group, Mesh, MeshBasicMaterial, OrthographicCamera, Scene, Vector2, WebGLRenderTarget } from 'three';
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
		this.material = new MeshBasicMaterial({ color: 0xffffff });

		this.scene = new Scene();
		this.camera = new OrthographicCamera();
		this.camera.position.set(0, 1, 5);
		this.camera.lookAt(0, 1, 0);
		this.fbo = new WebGLRenderTarget(VIDEO_SIZE.width * 10, VIDEO_SIZE.height * 10);

		this.tubes = new Group();
		POSE_CONNECTIONS.forEach(() => {
			this.tubes.add(new Mesh(new CylinderGeometry(0.05, 0.05, 1, 32), this.material));
		});
		this.tubes.position.y = 1.5;
		this.scene.add(this.tubes);
	}

	onRender() {
		if (this.scene && app.webgl.camera) {
			app.webgl.renderer.setRenderTarget(this.fbo);
			app.webgl.renderer.clear(true, true, false);
			app.webgl.renderer.render(this.scene, this.camera);
			app.webgl.renderer.setRenderTarget(null);
		}
	}

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
}

export { Avatar };
