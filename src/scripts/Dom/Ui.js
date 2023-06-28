import { app } from '@scripts/App.js';
import { Button } from './Button.js';
import { Text } from './Text.js';
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
		this.idContainer = new UiElement(document.getElementsByClassName('id-container')[0]);
		this.id = new UiElement(document.getElementsByClassName('id')[0]);
		this.energyContainer = new UiElement(document.getElementById('energy-container'));
		this.energy = new UiElement(document.getElementById('energy'));
		this.requireSound = new UiElement(document.getElementById('require-sound'));
		this.tutorialLight = new UiElement(document.getElementById('tutorial-light'));

		this.bottomText = new Text(document.getElementById('bottom-text'));

		this.tutoNoButton = new Button(document.getElementsByClassName('start-game')[0], () => {
			app.timeline.next();
			app.timeline.next();
		});
		this.tutoYesButton = new Button(document.getElementsByClassName('start-tutorial')[0], () => app.timeline.next());
		this.tutoEndButton = new Button(document.getElementsByClassName('end-tutorial')[0], () => app.timeline.next());
		this.tutoSkipButton = new Button(document.getElementsByClassName('skip-tutorial')[0], () => app.timeline.next());
	}
}

export { Ui };
