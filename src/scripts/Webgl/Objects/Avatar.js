import {
	BufferAttribute,
	BufferGeometry,
	CircleGeometry,
	CylinderGeometry,
	Group,
	HalfFloatType,
	Mesh,
	MeshBasicMaterial,
	NearestFilter,
	PerspectiveCamera,
	PlaneGeometry,
	Scene,
	ShaderMaterial,
	Vector2,
	WebGLRenderTarget,
} from 'three';
import { POSE } from '@utils/constants.js';
import { globalUniforms } from '@utils/globalUniforms.js';
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
		this.camera = new PerspectiveCamera();
		this.camera.position.set(0.5, 0.5, 1);
		this.camera.lookAt(0.5, 0.5, 0);
		this.fbo = new WebGLRenderTarget(512, 512, { magFilter: NearestFilter, type: HalfFloatType });

		this.tubes = new Group();
		this.wPosMaterial = new ShaderMaterial({
			vertexShader: `
	varying vec4 vPosition;
	void main() {
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		vPosition = gl_Position;
	}
	`,
			fragmentShader: `
	varying vec4 vPosition;
	void main() {
		gl_FragColor = vPosition;
	}
	`,
		});
		POSE_CONNECTIONS.forEach(() => {
			this.tubes.add(new Mesh(new CylinderGeometry(0.05, 0.05, 1, 32), this.wPosMaterial));
		});
		this.scene.add(this.tubes);

		const randomColorMaterial = new ShaderMaterial({
			vertexShader: `
	varying vec2 vUv;
	void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
	`,
			fragmentShader: `
			uniform float uTime;
	varying vec2 vUv;

	float random(vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) *
		43758.5453123);
	}

	void main() {
		float rx = random(vUv );
		float ry = random(vUv + 1.);
		float rz = random(vUv + 2.);
		
		gl_FragColor = vec4(rx  -0.5, ry  -0.5, rz  -0.5, 1.0);
		gl_FragColor = vec4(vec3(0., -1., 0.), 1.0);
	}
	`,
			uniforms: {
				...globalUniforms,
			},
		});

		const randomPlane = new Mesh(new PlaneGeometry(6, 6, 1, 1), randomColorMaterial);
		this.scene.add(randomPlane);
		randomPlane.position.set(0.5, 0.5, -5);

		const geometry = new BufferGeometry();
		this.vertices = new Float32Array(4 * 3);

		geometry.setIndex([0, 1, 2, 1, 2, 3]);
		geometry.setAttribute('position', new BufferAttribute(this.vertices, 3));

		this.torso = new Mesh(geometry, this.wPosMaterial);
		this.scene.add(this.torso);

		this.head = new Mesh(new CircleGeometry(0.15, 32), this.wPosMaterial);
		this.scene.add(this.head);
		this.head.scale.y = 1.25;

		this.neck = new Mesh(new CylinderGeometry(0.05, 0.05, 0.1, 32), this.wPosMaterial);
		this.scene.add(this.neck);

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
					tTex: { value: this.fbo.texture },
					// tTex: { value: app.webgl.scene.leftHandParticles.sim.gpuCompute.getCurrentRenderTarget(app.webgl.scene.leftHandParticles.sim.pos).texture },
				},
			}),
		);
		this.quad.position.y = -0.2;
		this.quad.position.x = 0.35;
		this.quad.position.z = -1;
		this.add(this.quad);
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
		// this.mesh.visible = true;
	}

	disableControl() {
		this.canControl = false;
		// state.off(EVENTS.RIG_COMPUTED, this.updateRig);
		// this.mesh.visible = false;
	}

	onPlayerMoved(rig) {
		if (!this.tubes) return;

		POSE_CONNECTIONS.forEach((connection, i) => {
			const src = rig.keypoints[connection[0]];
			const dst = rig.keypoints[connection[1]];
			const mesh = this.tubes.children[i];
			if (src && dst && mesh) {
				if (this.assertBoneIsInCamera(src, dst)) {
					const srcV2 = new Vector2(1 - src.x / VIDEO_SIZE.width, 1 - src.y / VIDEO_SIZE.height);
					const dstV2 = new Vector2(1 - dst.x / VIDEO_SIZE.width, 1 - dst.y / VIDEO_SIZE.height);
					const armPos = srcV2.clone().add(dstV2).divideScalar(2);
					mesh.position.set(armPos.x, armPos.y, 0);
					mesh.scale.y = srcV2.distanceTo(dstV2) * 1.1;
					mesh.lookAt(dstV2.x, dstV2.y, 0);
					mesh.rotateX(Math.PI / 2);
					mesh.visible = true;
				} else {
					mesh.visible = false;
				}
			}
		});

		this.vertices.set([
			1 - rig.keypoints[POSE.LEFT_SHOULDER].x / VIDEO_SIZE.width,
			1 - rig.keypoints[POSE.LEFT_SHOULDER].y / VIDEO_SIZE.height,
			0.0,
			1 - rig.keypoints[POSE.RIGHT_SHOULDER].x / VIDEO_SIZE.width,
			1 - rig.keypoints[POSE.RIGHT_SHOULDER].y / VIDEO_SIZE.height,
			0.0,
			1 - rig.keypoints[POSE.LEFT_HIP].x / VIDEO_SIZE.width,
			1 - rig.keypoints[POSE.LEFT_HIP].y / VIDEO_SIZE.height,
			0.0,
			1 - rig.keypoints[POSE.RIGHT_HIP].x / VIDEO_SIZE.width,
			1 - rig.keypoints[POSE.RIGHT_HIP].y / VIDEO_SIZE.height,
			0.0,
		]);

		this.torso.geometry.attributes.position.array = this.vertices;
		this.torso.geometry.attributes.position.needsUpdate = true;

		this.head.position.set(1 - rig.keypoints[POSE.NOSE].x / VIDEO_SIZE.width, 1 - rig.keypoints[POSE.NOSE].y / VIDEO_SIZE.height, 0.0);

		const neckBase = new Vector2(
			(1 - rig.keypoints[POSE.LEFT_SHOULDER].x / VIDEO_SIZE.width + 1 - rig.keypoints[POSE.RIGHT_SHOULDER].x / VIDEO_SIZE.width) / 2,
			(1 - rig.keypoints[POSE.LEFT_SHOULDER].y / VIDEO_SIZE.height + 1 - rig.keypoints[POSE.RIGHT_SHOULDER].y / VIDEO_SIZE.height) / 2,
		);
		const neckTop = new Vector2(1 - rig.keypoints[POSE.NOSE].x / VIDEO_SIZE.width, 1 - rig.keypoints[POSE.NOSE].y / VIDEO_SIZE.height);

		const neckPos = neckBase.clone().add(neckTop).divideScalar(2);

		this.neck.position.set(neckPos.x, neckPos.y, 0.0);
		this.neck.scale.y = neckBase.distanceTo(neckTop) * 10;
		this.neck.lookAt(neckTop.x, neckTop.y, 0);
		this.neck.rotateX(Math.PI / 2);
	}

	assertBoneIsInCamera(src, dst) {
		const srcIsInCamera = src.x > 0 && src.x < VIDEO_SIZE.width && src.y > 0 && src.y < VIDEO_SIZE.height;
		const dstIsInCamera = dst.x > 0 && dst.x < VIDEO_SIZE.width && dst.y > 0 && dst.y < VIDEO_SIZE.height;
		return srcIsInCamera || dstIsInCamera;
	}
}

export { Avatar };
