export default class Signal {
	constructor() {
		this._listeners = [];
	}

	on(cbk, once = false) {
		if (this._findListener(cbk) === -1) {
			this._listeners.push({ cbk, once });
		}
	}

	off(cbk) {
		const i = this._findListener(cbk);
		if (i > -1) {
			this._listeners.splice(i, 1);
		}
	}

	release() {
		this._listeners = [];
	}

	emit(e) {
		for (const l of this._listeners) {
			l.cbk(e);
		}

		if (this._listeners.some((l) => l.once)) {
			this._listeners = this._listeners.filter((l) => !l.once);
		}
	}

	_findListener(cbk) {
		return this._listeners.findIndex((l) => l.cbk === cbk);
	}
}
