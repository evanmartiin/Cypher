import { STEPS } from '@utils/constants.js';
import { state } from '@scripts/State.js';
import Timer from './Timer.js';

class Timeline {
	steps = [];

	constructor() {
		state.register(this);
		this.titleDOM = document.querySelector('#title');
		this.nextDOM = document.querySelector('#next');
		this.timer = new Timer();

		STEPS.forEach((s) => this.steps.push(new s()));
		this.nextDOM.addEventListener('click', () => this.next());
	}

	onAttach() {
		this.start();
	}

	start() {
		this.current = this.steps[0];
		this.current.start();
	}

	next() {
		this.current.stop();
		if (this.steps[(this.steps.indexOf(this.current) + 1) % this.steps.length]) {
			this.current = this.steps[(this.steps.indexOf(this.current) + 1) % this.steps.length];
			this.current.start();
		}
	}

	set(step) {
		this.current.stop();
		this.current = step;
		this.current.start();
	}
}

export { Timeline };
