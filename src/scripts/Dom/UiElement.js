class UiElement {
	constructor(node) {
		if (node) this.node = node;
	}

	show() {
		this.node.classList.remove('hide');
	}

	hide() {
		this.node.classList.add('hide');
	}

	spawn(duration) {
		this.node.classList.remove('hide');

		setTimeout(() => {
			this.node.classList.add('hide');
		}, duration);
	}
}

export { UiElement };
