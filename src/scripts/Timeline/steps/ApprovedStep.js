import { gsap } from 'gsap';
import { UI_IDS, UI_POOL_IDS } from '@Core/audio/AudioManager.js';
import { SplitText } from '@utils/gsap/SplitText.js';
import Step from '@utils/models/Step.js';
import { app } from '@scripts/App.js';

export default class ApprovedStep extends Step {
	constructor() {
		super();
		this.duration = 5000;
		gsap.registerPlugin(SplitText);
	}

	start() {
		this.isRunning = true;

		//UI
		app.dom.ui.approved.show();
		this.animText();
		app.dom.ui.title.hide();

		app.tensorflow.pose.disable();

		//SOUND
		app.core.audio.playUiRandom(UI_POOL_IDS.END);
		app.core.audio.playUI(UI_IDS.PUBLIC_END);
		app.core.audio.playUI(UI_IDS.CAMERA_TRANSITION);

		app.timeline.timer.setGauge(this.duration, () => app.timeline.next());

		app.tools.recorder.stop();

		app.server.on('SEND_ID', this.handleId);
	}

	stop() {
		this.isRunning = false;

		app.dom.ui.approved.hide();

		app.timeline.timer.resetTimer();
		app.server.off('SEND_ID', this.handleId);
	}

	animText() {
		const tl = gsap.timeline();
		const splittedChars = new SplitText('.approved-text', { type: 'chars' }).chars;
		gsap.set(splittedChars, { opacity: 0 });
		tl.fromTo(
			splittedChars,
			{
				opacity: 0,
			},
			{
				opacity: 1,
				duration: 0.3,
				stagger: 0.07,
			},
		);
		tl.fromTo('.approved-logo', { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.in' }, '>-0.5');

		tl.to(
			'.approved-container',
			{
				scale: 0.98,
				duration: 0.07,
				onComplete: () => {
					app.core.audio.playUI(UI_IDS.TAMPON);
				},
			},
			'>',
		);
		tl.to('.approved-container', { scale: 1, duration: 0.07 }, '>');
	}

	handleId = (id) => {
		// app.dom.ui.title.node.innerHTML = this.text + ' ID vidéo: ' + id;
	};
}
