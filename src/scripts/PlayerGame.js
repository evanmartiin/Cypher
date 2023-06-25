import { DANCES } from '@utils/constants.js';
import { app } from './App.js';
import { state } from './State.js';

// Timing in seconds
const DELAY_BEFORE_ENERGY = 2;

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
		app.webgl.scene.avatarDemo.stop();
		app.webgl.scene.title.stop();
		this.timer = 0;
	}

	newPhase() {
		app.webgl.scene.avatarDemo.dance(Object.values(DANCES)[this.danceID]);
		app.webgl.scene.carpet.show();
		app.webgl.scene.title.show(Object.values(DANCES)[this.danceID]);
		this.timer = 0;
	}

	save() {
		return {
			danceID: this.danceID,
			timer: this.timer,
			energyActive: app.energy.active,
		}
	}

	restore(save) {
		this.isRunning = true;
		this.danceID = save.danceID;
		this.timer = save.timer;
		save.energyActive && app.energy.start();

		app.webgl.scene.avatarDemo.resume();
		app.webgl.scene.carpet.show();
		app.webgl.scene.title.show(Object.values(DANCES)[this.danceID]);
	}

	onMidEnergyReached() {
		if (!this.isRunning) return;
		app.webgl.scene.reactions.show();
	}

	onMaxEnergyReached() {
		if (!this.isRunning) return;
		this.danceID++;
		this.danceID = this.danceID % Object.keys(DANCES).length;

		app.energy.stop();
		app.webgl.scene.carpet.hide();
		app.webgl.scene.avatarDemo.stop();
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
		}
	}
}

export { PlayerGame };
