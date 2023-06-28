import { gsap } from 'gsap';
import { Vector2 } from 'three';
import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';
import { UI_IDS } from '@Core/audio/AudioManager.js';

export default class TutorialStep extends Step {
	constructor() {
		super();
		this.text = 'Tutoriel';
	}

	start(timing = 0) {
		this.isRunning = true;

		this.resetLight();

		app.dom.ui.title.node.innerHTML = this.text;

		app.webgl.camera.enter();
		app.webgl.postProcessing.blurPass.disable();

		app.dom.ui.tutorialLight.show();
		app.dom.ui.bottomText.show();
		app.dom.ui.tutoSkipButton.show();
		app.dom.cursors.enable();

		this.timeline = gsap.timeline({ paused: true });
		this.timeline.to(this, {
			duration: 4,
			delay: 1,
			onStart: () => {
				app.dom.ui.bottomText.showText("Bienvenue dans Cypher, c'est un jeu de breakdance en plusieurs niveaux.");
				app.core.audio.playUI(UI_IDS.SUB1, 1);
			},
			onComplete: () => app.dom.ui.bottomText.hideText(),
		});
		this.timeline.to(
			this,
			{
				duration: 4,
				delay: 1,
				onStart: () => {
					app.dom.ui.bottomText.showText("Ça, c'est toi.");
					app.core.audio.playUI(UI_IDS.SUB2, 1);
					this.lightOn(15, new Vector2(15, 80));
				},
				onComplete: () => {
					this.lightOff();
					app.dom.ui.bottomText.hideText();
				},
			},
			'>',
		);
		this.timeline.to(
			this,
			{
				duration: 8,
				delay: 1,
				onStart: () => {
					app.dom.ui.bottomText.showText("Et ça, c'est encore toi, bouge pour tester !");
					app.core.audio.playUI(UI_IDS.SUB3, 1);
					this.lightOn(40, new Vector2(50, 60));
					app.webgl.scene.avatar.enableControl();
					app.webgl.scene._particles.show();
				},
				onComplete: () => {
					this.lightOff();
					app.dom.ui.bottomText.hideText();
					app.tensorflow.hide();
				},
			},
			'>',
		);
		this.timeline.to(
			this,
			{
				duration: 8,
				delay: 1,
				onStart: () => {
					app.dom.ui.bottomText.showText('À chaque niveau, Bernard-Boy te montre un mouvement que tu dois reproduire.');
					app.core.audio.playUI(UI_IDS.SUB4, 1);
					this.lightOn(15, new Vector2(27, 50));
					app.webgl.scene.avatarDemo.dance(0);
				},
				onComplete: () => {
					this.lightOff();
					app.dom.ui.bottomText.hideText();
				},
			},
			'>',
		);
		this.timeline.to(
			this,
			{
				duration: 8,
				delay: 1,
				onStart: () => {
					app.dom.ui.bottomText.showText("Pour passer au niveau suivant, il faut remplir ta barre d'énergie en bougeant.");
					app.core.audio.playUI(UI_IDS.SUB5, 1);
					this.lightOn(10, new Vector2(10, 85));
					app.energy.start();
					app.energy.tutorial = true;
				},
				onComplete: () => {
					this.lightOff();
					app.dom.ui.bottomText.hideText();
				},
			},
			'>',
		);
		this.timeline.to(
			this,
			{
				delay: 1,
				onStart: () => {
					app.dom.ui.bottomText.showText("Alors, t'es prêt ?");
					app.core.audio.playUI(UI_IDS.SUB6, 1);
					app.dom.ui.tutoEndButton.show();
					app.dom.ui.tutoSkipButton.hide();
				},
			},
			'>',
		);

		this.timeline.time(timing);
		this.timeline.play();
	}

	stop() {
		this.isRunning = false;
		this.timeline.pause();
		app.dom.ui.tutorialLight.hide();
		app.dom.ui.bottomText.hideText(true);
		app.dom.ui.tutoEndButton.hide();
		app.dom.cursors.disable();
		app.energy.stop();
		app.energy.tutorial = false;
		app.webgl.scene.avatarDemo.stop();
		app.dom.ui.tutoSkipButton.hide();
	}

	save() {
		return {
			timing: this.timeline.time(),
			text: app.dom.ui.bottomText.text,
		};
	}

	restore(save) {
		this.start(save.timing);
		app.dom.ui.bottomText.showText(save.text);
	}

	lightOff() {
		return gsap.to(this, {
			lightOpacity: 0,
			duration: 1,
			ease: 'power2.in',
			onUpdate: () => this.updateLight(),
		});
	}

	lightOn(size, pos) {
		this.lightSize = size;
		this.lightPos.copy(pos);
		return gsap.to(this, {
			lightOpacity: 1,
			duration: 1,
			ease: 'power2.out',
			onUpdate: () => this.updateLight(),
		});
	}

	resetLight() {
		this.lightPos = new Vector2();
		this.lightOpacity = 0;
		this.lightSize = 20;
		this.updateLight();
	}

	updateLight() {
		app.dom.ui.tutorialLight.node.style.background = `radial-gradient(circle at ${this.lightPos.x}% ${this.lightPos.y}%, rgba(0,0,0,0) ${
			(this.lightSize - 5) * this.lightOpacity
		}%, rgba(0,0,0,0.7) ${(this.lightSize + 5) * this.lightOpacity}%)`;
	}
}
