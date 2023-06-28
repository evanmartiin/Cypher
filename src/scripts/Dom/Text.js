import { gsap } from 'gsap';
import { SplitText } from '@utils/gsap/SplitText.js';
import { UiElement } from './UiElement.js';

class Text extends UiElement {
	constructor(node) {
		super(node);

		gsap.registerPlugin(SplitText);
	}

	showText(text) {
		this.node.innerHTML = text;
		this.node.style.opacity = 1;
		const splittedChars = new SplitText(this.node, { type: 'words' }).words;
		gsap.fromTo(splittedChars, { opacity: 0, translateY: '13px' }, { opacity: 1, translateY: '0px', duration: 0.2, stagger: 0.05 });
	}

	hideText(hideAtTheEnd = false) {
		gsap.to(this.node, { opacity: 0, duration: 0.2, onComplete: () => hideAtTheEnd && this.hide() });
	}
}

export { Text };
