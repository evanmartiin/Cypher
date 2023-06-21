import { app } from './App.js';
import { state } from './State.js';

// Timing in seconds
const DELAY_BEFORE_ENERGY = 5;
const DEMO_DURATION = 10;

class PlayerGame {
	constructor() {
		state.register(this);

		this.isRunning = false;

		this.timer = 0;
	}

	start() {
		this.isRunning = true;
		app.webgl.scene.avatarDemo.enable();
	}

	stop() {
		this.isRunning = false;
		app.energy.stop();
		app.webgl.scene.avatarDemo.disable();
		this.timer = 0;
	}

	newPhase() {
		app.webgl.scene.avatarDemo.enable();
		app.webgl.scene.carpet.show();
		this.timer = 0;
	}

	onMaxEnergyReached() {
		app.energy.stop();
		app.webgl.scene.carpet.hide();
		app.webgl.scene.avatarDemo.disable();
		app.webgl.scene.changeEnv().then(() => {
			if (!this.isRunning) return;
			this.newPhase();
		});
	}

	onTick({ dt }) {
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