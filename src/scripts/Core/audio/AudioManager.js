import { Howl, Howler } from 'howler';
import { state } from '@scripts/State.js';
import SOUNDS_MUSIC from './musics.json';
// import SOUNDS_UI from './ui-spritesheet.json';
import SOUNDS_UI from './ui.json';

const MUSIC_VOLUME = 1;

export const MUSIC_IDS = {
	MUSIC_1: 'music-attente',
	MUSIC_2: 'music-2',
	MUSIC_3: 'music-3',
};

export const UI_IDS = {
	BUTTON_2: 'button-2',
	BUTTON_RELEASED: 'button-released',
	BUTTON: 'button',
	TREE: 'tree',
};

export const UI_POOL_IDS = {
	READY: ['intro_1', 'intro_2', 'intro_3'],
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
		Howler.autoSuspend = false;
		Howler.html5PoolSize = 0;
		Howler.usingWebAudio = true;

		// @ts-ignore
		SOUNDS_MUSIC.sources.forEach((music) => {
			this._musics.set(music.name, new Howl({ src: `src/assets/audio/musics/${music.src}`, loop: true, volume: MUSIC_VOLUME }));
		});

		// @ts-ignore
		// this._UI = new Howl(SOUNDS_UI);
		SOUNDS_UI.sources.forEach((sound) => {
			this._sounds.set(sound.name, new Howl({ src: `src/assets/audio/ui/${sound.src}`, loop: true, volume: MUSIC_VOLUME }));
		});

		console.log(this._UI);

		Howler.volume(0);

		//AudioContext
		this.audioContext = new window.AudioContext();
		this.frequencies = [];
		this.analyser;
		this.frequencyData;

		window.addEventListener('click', this.setCanPlay);
	}

	setCanPlay = () => {
		window.removeEventListener('click', this.setCanPlay);
		this.canPlay = true;
		Howler.volume(1);
	};

	setMute(flag) {
		Howler.volume(flag ? 0 : 1);
	}

	fadeVolume(id, soundId, volume, duration = 1000) {
		if (!this.canPlay) return;
		const howl = this._musics.get(id);
		howl.fade(howl.volume(undefined, soundId), volume, duration, soundId);
	}

	playUI(name) {
		// this._UI.play(name);
		const ui = this._sounds.get(name);
		if (!ui) return;
		ui.play(name);
		return ui;
	}

	playUiRandom(names, random = null) {
		if (random === null) {
			const random = Math.floor(Math.random() * names.length);
			this._UI.play(names[random]);
		} else {
			this._UI.play(names[random]);
		}
	}

	getUiRandom(names) {
		const random = Math.floor(Math.random() * names.length);
		return { randomSoundDuration: Object.values(this._UI._sprite)[random][1], random: random };
	}

	playMusic(name) {
		if (name !== this.currentAmbientName) {
			if (this.currentAmbient) {
				this.fadeOut(this.currentAmbientName, 1000, this.currentAmbientId);
			}

			this.currentAmbient = this._musics.get(name);
			this.currentAmbientName = name;
			this.currentAmbientId = this.fadeIn(this.currentAmbientName, MUSIC_VOLUME, 1000);
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

		howl.fade(0, volume, duration, soundId);

		return soundId;
	}

	fadeOut(id, duration = 1000, soundId) {
		if (!this.canPlay) return;

		const howl = this._musics.get(id);

		howl.off('fade', undefined, soundId);
		howl.fade(1, 0, duration, soundId);

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
