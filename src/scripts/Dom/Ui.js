import { UiElement } from './UiElement.js';

class Ui {
	constructor() {
		this.logo = new UiElement(document.getElementById('logo-container'));
		this.rec = new UiElement(document.getElementById('rec'));
		this.title = new UiElement(document.getElementById('title'));
		this.timer = new UiElement(document.getElementById('timer'));
		this.music = new UiElement(document.getElementById('music-container'));
		this.randomWord = new UiElement(document.getElementById('random-word'));
		this.approved = new UiElement(document.getElementsByClassName('approved-container')[0]);
		this.energy = new UiElement(document.getElementById('energy'));
		this.requireSound = new UiElement(document.getElementById('require-sound'));
	}
}

export { Ui };
