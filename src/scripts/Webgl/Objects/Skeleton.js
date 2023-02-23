import { Group, SkeletonHelper } from 'three';
import { STORE } from '@utils/constants.js';
import { store } from '@scripts/Store.js';

class Skeleton extends Group {
	constructor() {
		super();
	}

	show() {
		this.skeleton = new SkeletonHelper(store.get(STORE.SKELETON));
		this.add(this.skeleton);
	}

	hide() {
		this.remove(this.skeleton);
	}
}

export { Skeleton };
