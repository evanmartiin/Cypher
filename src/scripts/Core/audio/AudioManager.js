import { Howl, Howler } from 'howler';
import { state } from '@scripts/State.js';
import SOUNDS_MUSIC from './musics.json';
// import SOUNDS_UI from './ui-spritesheet.json';
import SOUNDS_UI from './ui.json';

const MUSIC_VOLUME = 0.5;
const UI_VOLUME = 0.7;

export const MUSIC_IDS = {
	MUSIC_ATTENTE: 'music_attente',
	MUSIC_FUNK_1: 'music_funk',
	MUSIC_FUNK_1_FILTERED: 'music_funk_filtered',
	MUSIC_FUNK_2: 'music_funk_2',
	MUSIC_FUNK_2_FILTERED: 'music_funk_filtered_2',
	MUSIC_POOL: ['music_1', 'music_2', 'music_3', 'music_4', 'music_5', 'music_6', 'music_7'],
};

export const UI_IDS = {
	SCRATCH: 'scratch',
	TIMER: 'timer',
	PUBLIC: 'public_end',
	PUBLIC_TRANSITION: 'public_end',
	PUBLIC_END: 'public_end',
	CURSOR: 'cursor_placed',
	TRANSITION_SCENE: 'transition',
	TEXT_APPARITION: 'text_apparition',
	CAMERA_TRANSITION: 'transition_ui_1',
	STAMP: 'stamp',
	FREESTYLE: 'freestyle',
};

export const UI_POOL_IDS = {
	READY: ['intro_1', 'intro_2', 'intro_3'],
	COUNTDOWN: ['3', '2', '1'],
	GO: ['go_1', 'go_2', 'go_3', 'go_4'],
	TRANSITION_MC: ['transition_1', 'transition_2', 'transition_3', 'transition_4', 'transition_5', 'transition_6'],
	END: ['end_1', 'end_2', 'end_3'],
	SCRATCH: ['scratch'],
	TEXT_APPARITION: ['text_apparition'],
	TIMER: ['timer'],
	RANDOM_WORD: ['yeah', 'nice', 'lets_go', 'insane'],
	TRANSITION_SCENE: ['transition', 'transition_ui_1', 'transition_ui_2'],
	PUBLIC: ['public_end', 'public'],
	CURSOR: ['cursor_placed'],
	STAMP: ['stamp'],
};

class AudioManager {
	_musics = new Map();
	_sounds = new Map();
	canPlay = false;
	currentAmbientName;
	currentAmbientId;
	currentAmbient;

	constructor() {
		state.register(this);

		this.frequencies = [];
		this.analyser;
		this.frequencyData;
	}

	onFirstClick() {
		this.audioContext = new window.AudioContext();

		Howler.autoSuspend = false;
		Howler.html5PoolSize = 0;
		Howler.usingWebAudio = true;

		Howler.volume(1);

		// @ts-ignore
		SOUNDS_MUSIC.sources.forEach((music) => {
			this._musics.set(music.name, new Howl({ src: `src/assets/audio/musics/${music.src}`, loop: true, volume: MUSIC_VOLUME }));
		});

		// @ts-ignore
		// this._UI = new Howl(SOUNDS_UI);
		SOUNDS_UI.sources.forEach((sound) => {
			this._sounds.set(sound.name, new Howl({ src: `src/assets/audio/ui/${sound.src}`, loop: false, volume: UI_VOLUME }));
		});

		this.canPlay = true;
	}

	setMute(flag) {
		Howler.volume(flag ? 0 : 1);
	}

	fadeVolume(id, soundId, volume, duration = 1000) {
		if (!this.canPlay) return;
		const howl = this._musics.get(id);
		howl.fade(howl.volume(undefined, howl), volume, duration, soundId);
	}

	playUI(name) {
		// this._UI.play(name);
		// console.log(name)
		console.log(name)
		const ui = this._sounds.get(name);
		if (!ui) return;
		ui.play();
		return ui;
	}

	playUiRandom(names, random = null) {
		if (random === null) {
			const random = Math.floor(Math.random() * names.length);
			const ui = this._sounds.get(names[random]);
			if (!ui) return;
			ui.play();
			// this._UI.play(names[random]);
		} else {
			const ui = this._sounds.get(names[random]);
			// console.log(ui)
			if (!ui) return;
			ui.play();
			// this._UI.play(names[random]);
		}
	}

	getUiRandom(names) {
		const random = Math.floor(Math.random() * names.length);
		const ui = this._sounds.get(names[random]);
		// randomSoundDuration: Object.values(this._UI._sprite)[random][1]

		return { randomSoundDuration: ui._duration * 1000, random: random };
	}

	playMusic(name) {
		if (name !== this.currentAmbientName) {
			if (this.currentAmbient) {
				this.fadeOut(this.currentAmbientName, 1000, this.currentAmbientId);
			}

			this.currentAmbient = this._musics.get(name);
			this.currentAmbientName = name;
			this.currentAmbientId = this.fadeIn(this.currentAmbientName, MUSIC_VOLUME, 1000);
			this.initFrequencies(name);
		}
	}

	initFrequencies(id) {
		const howl = this._musics.get(id);
		const audioContext = howl._sounds[0]._node.context;

		// Créer un nœud d'analyseur audio
		this.analyser = audioContext.createAnalyser();
		this.analyser.fftSize = 2048; // Taille de la fenêtre FFT (doit être une puissance de 2)
		this.analyser.minDecibels = -90; // Niveau minimal en décibels
		this.analyser.maxDecibels = -10; // Niveau maximal en décibels
		this.analyser.smoothingTimeConstant = 0.85; // Constante de lissage (entre 0 et 1)

		const howlNode = Howler.masterGain;
		howlNode.connect(this.analyser);

		this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
	}

	onRender() {
		if (!this.analyser) return;
		this.analyser.getByteFrequencyData(this.frequencyData);
		const frequencyStep = Math.floor(this.frequencyData.length / 7);

		for (let i = 0; i < 6; i++) {
			const frequency = this.frequencyData.slice(frequencyStep * i, frequencyStep * (i + 1));
			this.frequencies[i] = this.calculateAverageVolume(frequency);
		}
	}

	calculateAverageVolume(frequencyData) {
		let sum = 0;
		for (let i = 0; i < frequencyData.length; i++) {
			sum += frequencyData[i];
		}
		const average = sum / frequencyData.length;
		return average;
	}

	pause(id) {
		if (!this.canPlay) return;

		const howl = this._musics.get(id);
		howl.pause();
	}

	stop(id) {
		if (!this.canPlay) return;

		const howl = this._musics.get(id);
		howl.stop();
	}

	fadeIn(id, volume = MUSIC_VOLUME, duration = 1000) {
		if (!this.canPlay) return;

		const howl = this._musics.get(id);
		const soundId = howl.play();

		// console.log(soundId)
		// console.log(volume)

		howl.fade(0, volume, duration, soundId);

		return soundId;
	}

	fadeOut(id, duration = 1000, soundId) {
		if (!this.canPlay) return;

		const howl = this._musics.get(id);

		howl.off('fade', undefined, soundId);
		howl.fade(MUSIC_VOLUME, 0, duration, soundId);

		return new Promise((resolve) => {
			howl.once('fade', resolve, soundId);
		});
	}

	fadeOutStop(id, duration = 1000, soundId) {
		if (!this.canPlay) return;

		this.fadeOut(id, duration, soundId).then(() => this.stop(id));
	}
}

export { AudioManager };
