import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class PlayerDetectedStep extends Step {
	constructor() {
		super();
		this.text = 'Détection';
	}

	start() {
		this.isRunning = true;

		app.dom.ui.title.node.innerHTML = this.text;
		app.dom.cursors.enable();
		app.dom.ui.title.show();
		app.dom.ui.bottomText.show();
		app.dom.ui.bottomText.showText("T'as déjà joué à Cypher ?");
		app.dom.ui.tutoYesButton.show();
		app.dom.ui.tutoNoButton.show();
	}

	stop() {
		this.isRunning = false;
		app.dom.cursors.disable();
		app.dom.ui.bottomText.hideText(true);
		app.dom.ui.tutoYesButton.hide();
		app.dom.ui.tutoNoButton.hide();
	}
}
