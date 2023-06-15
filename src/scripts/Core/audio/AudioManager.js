import { Howl, Howler } from 'howler';
import SOUNDS_MUSIC from './musics.json';
import SOUNDS_UI from './ui.json';

const MUSIC_VOLUME = 1;

export const MUSIC_IDS = {
	MUSIC_1: 'music-1',
	MUSIC_2: 'music-2',
};

export const UI_IDS = {
	BUTTON_2: 'button-2',
	BUTTON_RELEASED: 'button-released',
	BUTTON: 'button',
	TREE: 'tree',
};

class AudioManager {
	_musics = new Map();
	canPlay = false;
	currentAmbientName;
	currentAmbientId;
	currentAmbient;

	constructor() {
		Howler.autoSuspend = false;
		Howler.html5PoolSize = 0;
		Howler.usingWebAudio = true;

		// @ts-ignore
		SOUNDS_MUSIC.sources.forEach((music) => {
			this._musics.set(music.name, new Howl({ src: `src/assets/audio/musics/${music.src}`, loop: true, volume: MUSIC_VOLUME }));
		});

		// @ts-ignore
		this._UI = new Howl(SOUNDS_UI);

		Howler.volume(0);

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
		this._UI.play(name);
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
