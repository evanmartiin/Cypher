export default class Step {
	constructor() {
		this.isRunning = false;
		if (this.constructor === Step) {
			throw new Error('Abstract class "Step" cannot be instantiated directly.');
		}
	}
	start() {
		throw new Error('Method "start" must be implemented.');
	}
	stop() {
		throw new Error('Method "stop" must be implemented.');
	}
}
