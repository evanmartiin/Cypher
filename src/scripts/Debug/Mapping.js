import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { state } from '@scripts/State.js';
import { PANE_TABS, PANE_TITLE } from './debugConfig.js';

/** @type Record<any, any> */
const mapping = Object.fromEntries(
	Object.entries(import.meta.glob('./functions/*Debug.js', { import: '*', eager: true })).map(([key, value]) => {
		return [key.split('/').pop().split('.')[0].replace('Debug', ''), value];
	}),
);

class Mapping {
	#childrenToAdd;
	#folders;
	#tabs;
	#globalPane;
	#Tweakpane;
	constructor() {
		state.register(this);

		/** @type Map<any, import("tweakpane").FolderApi> */
		this.#childrenToAdd = new Map();
		this.#folders = new Map();
	}
	async load() {
		this.#Tweakpane = await import('tweakpane');
	}

	init() {
		/** @type import('tweakpane').BladeApi */
		this.#globalPane = new this.#Tweakpane.Pane({ title: PANE_TITLE });
		this.#globalPane.registerPlugin(EssentialsPlugin);

		this.#tabs = this.#globalPane.addTab({
			pages: PANE_TABS.map((tab) => {
				return { title: tab };
			}),
		}).pages;
	}

	addToParent(instance, name, parentName) {
		if (!this.#childrenToAdd.get(parentName)) this.#childrenToAdd.set(parentName, []);
		this.#childrenToAdd.get(parentName).push(instance);

		if (this.#folders.get(parentName)) mapping[name].createPane(this.#folders.get(parentName), instance, name);
	}

	add(instance, name, tabIndex = 0, customName = '') {
		if (mapping[name]) {
			mapping[name].debug?.(instance);
			const folder = mapping[name].createPane?.(this.#tabs[tabIndex], instance, customName || name);
			this.#folders.set(name, folder);

			if (this.#childrenToAdd.get(name)) {
				this.#childrenToAdd.get(name).forEach((instance) => mapping[name](folder, instance, name));
				this.#childrenToAdd.delete(name);
			}
		} else console.warn('No debug mapping found for', name);
	}

	onKeyDown(key) {
		if (key === 'h') this.#globalPane.hidden = !this.#globalPane.hidden;
	}
}

export { Mapping };
