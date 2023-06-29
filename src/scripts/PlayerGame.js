import { DANCES } from '@utils/constants.js';
import { app } from './App.js';
import { state } from './State.js';

// Timing in seconds
const DELAY_BEFORE_ENERGY = 2;

const DIFFICULTY = [1000, 2000, 3000, 4000, 5000];

class PlayerGame {
	constructor() {
		state.register(this);

		this.isRunning = false;

		this.timer = 0;
		this.level = 0;
	}

	start() {
		this.isRunning = true;
		this.level = 0;
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
		if (this.level > Object.keys(DANCES).length) {
			app.timeline.next();
			return;
		}
		app.webgl.scene.avatarDemo.dance(Object.values(DANCES)[this.level]);
		app.webgl.scene.carpet.show();
		app.webgl.scene.title.show(Object.values(DANCES)[this.level]);
		this.timer = 0;
	}

	save() {
		return {
			level: this.level,
			timer: this.timer,
			energyActive: app.energy.active,
		};
	}

	restore(save) {
		this.isRunning = true;
		this.level = save.level;
		this.timer = save.timer;
		save.energyActive && app.energy.start();

		app.webgl.scene.avatarDemo.resume();
		app.webgl.scene.carpet.show();
	}

	onMidEnergyReached() {
		if (!this.isRunning) return;
		app.webgl.scene.reactions.show();
	}

	onMaxEnergyReached() {
		if (!this.isRunning) return;
		this.level++;
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
				app.energy.start(DIFFICULTY[this.level]);
			}
		}
	}
}

export { PlayerGame };
