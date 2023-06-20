import { UiElement } from './UiElement.js';

class Ui {
	constructor() {
		this.logo = new UiElement(document.getElementById('logo-container'));
        this.rec = new UiElement(document.getElementById('rec'));
        this.title = new UiElement(document.getElementById('title'));
        this.timer = new UiElement(document.getElementById('timer'));
        this.music = new UiElement(document.getElementById('music-container'));
        this.randomWord = new UiElement(document.getElementById('random-word'));
        this.move = new UiElement(document.getElementById('move'));
	}
}

export { Ui };
