import { DEBUG, INSTALL } from '@utils/config.js';
import { INSTALL_STEPS, STEPS } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';
import Timer from './Timer.js';
import StandbyStep from './steps/StandbyStep.js';

class Timeline {
	steps = [];

	constructor() {
		state.register(this);
		this.nextDOM = document.getElementById('next');
		this.timer = new Timer();
		this.standby = false;

		(INSTALL ? INSTALL_STEPS : STEPS).forEach((Step) => this.steps.push(new Step()));
		this.standbyStep = new StandbyStep();

		if (DEBUG) this.nextDOM.addEventListener('click', () => this.next());
		else this.nextDOM.style.display = 'none';
	}

	onFirstClick() {
		this.start();

		/// #if DEBUG
		if (this.requestedStep) {
			while (this.current.constructor.name.slice(0, -4).toLowerCase() !== this.requestedStep) {
				this.next();
			}
		}
		/// #endif
	}

	onAttach() {
		/// #if DEBUG
		if (app.tools.urlParams.has('step')) {
			const loweredSteps = (INSTALL ? INSTALL_STEPS : STEPS).map((Step) => Step.name.slice(0, -4).toLowerCase());
			const requestedStep = app.tools.urlParams.getString('step').toLowerCase();
			if (loweredSteps.includes(requestedStep)) {
				this.requestedStep = requestedStep;
			}
		}
		/// #endif
	}

	onKeyDown(key) {
		if (key === 'h') {
			this.nextDOM.style.display = this.nextDOM.style.display === 'none' ? 'block' : 'none';
		}
	}

	start() {
		this.current = this.steps[0];
		this.current.start();
	}

	next() {
		this.current.stop();
		const nextStep = this.steps[(this.steps.indexOf(this.current) + 1) % this.steps.length];
		if (nextStep) {
			this.current = nextStep;
			this.current.start();
		}
	}

	reset() {
		if (this.standby) {
			this.standby = false;
			this.standbyStep.stop();
			this.savedConfig = null;
		}
		this.current = this.steps[0];
		this.current.start();

		app.dom.ui.title.hide();
	}

	resume() {
		this.standby = false;
		this.standbyStep.abort();
		this.current.restore(this.savedConfig);
		this.savedConfig = null;
	}

	onPlayerLeft() {
		if (this.current.constructor.name === 'WaitingStep') return;

		if (this.current.constructor.name === 'PlayerDetectedStep') {
			this.current.stop();
			this.reset();
		} else {
			this.savedConfig = this.current.save();
			this.current.stop();
			this.standby = true;
			this.standbyStep.start();
		}
	}
}

export { Timeline };
