import { DANCES } from '@utils/constants.js';
import { app } from './App.js';
import { state } from './State.js';
import { UI_IDS, UI_POOL_IDS } from '@Core/audio/AudioManager.js';

// Timing in seconds
const DELAY_BEFORE_ENERGY = 2;
const DEMO_DURATION = 10;

class PlayerGame {
	constructor() {
		state.register(this);

		this.isRunning = false;

		this.timer = 0;
		this.danceID = 0;
	}

	start() {
		this.isRunning = true;
		this.newPhase();
	}

	stop() {
		this.isRunning = false;
		app.energy.stop();
		app.webgl.scene.avatarDemo.disable();
		app.webgl.scene.title.stop();
		this.timer = 0;
	}

	newPhase() {
		app.webgl.scene.avatarDemo.enable();
		app.webgl.scene.carpet.show();
		app.webgl.scene.title.show(Object.values(DANCES)[this.danceID]);
		this.timer = 0;

		this.danceID++;
		this.danceID = this.danceID % Object.keys(DANCES).length;
	}

	onMaxEnergyReached() {
		if (!this.isRunning) return;
		app.energy.stop();
		app.webgl.scene.carpet.hide();
		app.webgl.scene.avatarDemo.disable();
		app.webgl.scene.changeEnv().then(() => {
			if (!this.isRunning) return;
			this.newPhase();
		});
	}

	onTick({ dt }) {
		if (!this.isRunning) return;
		if (app.webgl.scene.avatarDemo.active) {
			this.timer += dt;
			if (this.timer >= DELAY_BEFORE_ENERGY && !app.energy.active) {
				app.energy.start();
			}
			if (this.timer >= DEMO_DURATION) {
				this.timer = 0;
				app.webgl.scene.avatarDemo.disable();
			}
		}
	}
}

export { PlayerGame };
