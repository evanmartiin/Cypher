import gsap from 'gsap';
import { Group, Mesh, MirroredRepeatWrapping, PlaneGeometry, ShaderMaterial, Vector2 } from 'three';
import { UI_IDS, UI_POOL_IDS } from '@Core/audio/AudioManager.js';
import fragmentShader from '@Webgl/Materials/CounterAnimation/fragment.fs';
import vertexShader from '@Webgl/Materials/CounterAnimation/vertex.vs';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class CounterAnimation extends Group {
	constructor() {
		super();
		state.register(this);
	}

	onAttach() {
		this._textures = this._getTextures();

		const geometry = new PlaneGeometry(1, 1, 1, 1);

		this._mesh3 = this._createMesh3(geometry);
		this._mesh2 = this._createMesh2(geometry);
		this._mesh1 = this._createMesh1(geometry);
		this._meshGo = this._createMeshGo(geometry);

		this.add(this._mesh3, this._mesh2, this._mesh1, this._meshGo);

		this._timeline = this.setTransitionTimeline();
	}

	_getTextures() {
		const pixelSortingTexture = app.core.assetsManager.get('pixelSorting');
		pixelSortingTexture.wrapS = MirroredRepeatWrapping;
		pixelSortingTexture.wrapT = MirroredRepeatWrapping;

		const glitchTexture = app.core.assetsManager.get('glitch');
		glitchTexture.wrapS = MirroredRepeatWrapping;
		glitchTexture.wrapT = MirroredRepeatWrapping;

		const liquidTexture = app.core.assetsManager.get('liquid');
		liquidTexture.wrapS = MirroredRepeatWrapping;
		liquidTexture.wrapT = MirroredRepeatWrapping;

		const counterTexture = app.core.assetsManager.get('roadrage');

		return { counterTexture, liquidTexture, glitchTexture, pixelSortingTexture };
	}

	_createMesh3(geometry) {
		const material = new ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				...globalUniforms,
				uPixelSortingTexture: { value: this._textures.pixelSortingTexture },
				uGlitchTexture: { value: this._textures.glitchTexture },
				uLiquidTexture: { value: this._textures.liquidTexture },
				uNumberTexture: { value: this._textures.counterTexture },
				uProgress: { value: -1 },
				uSwitchTransition: { value: true },
				uTextureOffset: { value: new Vector2(0, 1) },
			},
			transparent: true,
			depthWrite: false,
			depthTest: false,
		});

		const mesh = new Mesh(geometry, material);
		mesh.position.y = 1.2;
		mesh.position.z = 1;

		return mesh;
	}

	_createMesh2(geometry) {
		const material = new ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				...globalUniforms,
				uPixelSortingTexture: { value: this._textures.pixelSortingTexture },
				uGlitchTexture: { value: this._textures.glitchTexture },
				uLiquidTexture: { value: this._textures.liquidTexture },
				uNumberTexture: { value: this._textures.counterTexture },
				uProgress: { value: -1 },
				uSwitchTransition: { value: true },
				uTextureOffset: { value: new Vector2(1, 1) },
			},
			transparent: true,
			depthWrite: false,
			depthTest: false,
		});

		const mesh = new Mesh(geometry, material);
		mesh.position.y = 1.2;
		mesh.position.z = 1;

		return mesh;
	}

	_createMesh1(geometry) {
		const material = new ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				...globalUniforms,
				uPixelSortingTexture: { value: this._textures.pixelSortingTexture },
				uGlitchTexture: { value: this._textures.glitchTexture },
				uLiquidTexture: { value: this._textures.liquidTexture },
				uNumberTexture: { value: this._textures.counterTexture },
				uProgress: { value: -1 },
				uSwitchTransition: { value: true },
				uTextureOffset: { value: new Vector2(0, 0) },
			},
			transparent: true,
			depthWrite: false,
			depthTest: false,
		});

		const mesh = new Mesh(geometry, material);
		mesh.position.y = 1.2;
		mesh.position.z = 1;

		return mesh;
	}

	_createMeshGo(geometry) {
		const material = new ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				...globalUniforms,
				uPixelSortingTexture: { value: this._textures.pixelSortingTexture },
				uGlitchTexture: { value: this._textures.glitchTexture },
				uLiquidTexture: { value: this._textures.liquidTexture },
				uNumberTexture: { value: this._textures.counterTexture },
				uProgress: { value: -1 },
				uSwitchTransition: { value: true },
				uTextureOffset: { value: new Vector2(1, 0) },
			},
			transparent: true,
			depthWrite: false,
			depthTest: false,
		});

		const mesh = new Mesh(geometry, material);
		mesh.position.y = 1.2;
		mesh.position.z = 1;

		return mesh;
	}

	setTransitionTimeline() {
		const timeline = gsap.timeline({ paused: true });
		timeline.timeScale(1.25);

		timeline.to(
			this._mesh3.material.uniforms.uProgress,
			{
				duration: 0.5,
				value: 1.25,
				onStart: () => {
					app.core.audio.playUI(UI_POOL_IDS.COUNTDOWN[0]);
					app.core.audio.playUI(UI_IDS.TIMER);
				},
			},
			0,
		);
		timeline.fromTo(this._mesh3.position, { duration: 0, z: 0 }, { duration: 0.75, z: 1.25, ease: 'Power1.in' }, 0);
		timeline.to(this._mesh3.material.uniforms.uSwitchTransition, { duration: 0, value: false }, 0.6);
		timeline.to(this._mesh3.material.uniforms.uProgress, { duration: 0.5, value: -1.15 }, 0.6);
		timeline.fromTo(this._mesh3.position, { duration: 0, z: 1.25 }, { duration: 0.5, z: 2.75, ease: 'Power1.out' }, 0.6);

		timeline.to(
			this._mesh2.material.uniforms.uProgress,
			{
				duration: 0.5,
				value: 1.25,
				onStart: () => {
					app.core.audio.playUI(UI_IDS.PUBLIC);
					app.core.audio.playUI(UI_POOL_IDS.COUNTDOWN[1]);
				},
			},
			0.8,
		);
		timeline.fromTo(this._mesh2.position, { duration: 0, z: 0 }, { duration: 0.75, z: 1.25, ease: 'Power1.in' }, 0.8);
		timeline.to(this._mesh2.material.uniforms.uSwitchTransition, { duration: 0, value: false }, 1.4);
		timeline.to(this._mesh2.material.uniforms.uProgress, { duration: 0.5, value: -1.15 }, 1.4);
		timeline.fromTo(this._mesh2.position, { duration: 0, z: 1.25 }, { duration: 0.5, z: 2.75, ease: 'Power1.out' }, 1.4);

		timeline.to(
			this._mesh1.material.uniforms.uProgress,
			{
				duration: 0.5,
				value: 1.25,
				onStart: () => {
					app.core.audio.playUI(UI_POOL_IDS.COUNTDOWN[2]);
				},
			},
			1.6,
		);
		timeline.fromTo(this._mesh1.position, { duration: 0, z: 0 }, { duration: 0.75, z: 1.25, ease: 'Power1.in' }, 1.6);
		timeline.to(this._mesh1.material.uniforms.uSwitchTransition, { duration: 0, value: false }, 2.2);
		timeline.to(this._mesh1.material.uniforms.uProgress, { duration: 0.5, value: -1.15 }, 2.2);
		timeline.fromTo(this._mesh1.position, { duration: 0, z: 1.25 }, { duration: 0.5, z: 2.75, ease: 'Power1.out' }, 2.2);

		timeline.to(
			this._meshGo.material.uniforms.uProgress,
			{
				duration: 0.5,
				value: 1.25,
				onStart: () => {
					app.core.audio.playUiRandom(UI_POOL_IDS.GO);
				},
			},
			2.4,
		);
		timeline.fromTo(this._meshGo.position, { duration: 0, z: 0 }, { duration: 0.75, z: 1.25, ease: 'Power1.in' }, 2.4);
		timeline.fromTo(this._meshGo.position, { duration: 0, z: 1.25 }, { duration: 2.75, z: 2.5, ease: 'Sine.out' }, 2.5);
		timeline.to(this._meshGo.material.uniforms.uSwitchTransition, { duration: 0, value: false }, 3.5);
		timeline.to(this._meshGo.material.uniforms.uProgress, { duration: 2.5, value: -1.15 }, 3.5);

		return timeline;
	}
}
