import { EVENTS } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export default class Recorder {
	constructor() {
		state.register(this);
	}

	onAttach() {
		this.recDOM = document.getElementById('rec');
	}

	async init() {
		/// #if DEBUG
		if (app.tools.urlParams.has('skip-screen-record')) return;
		/// #endif

		await navigator.mediaDevices
			.getDisplayMedia({ video: true })
			.then((stream) => {
				this.mediaRecorder = new MediaRecorder(stream);
			})
			.catch((error) => {
				console.error('Error accessing media devices.', error);
			});
	}

	start() {
		/// #if DEBUG
		if (app.tools.urlParams.has('skip-screen-record')) return;
		/// #endif

		this.mediaRecorder.start();
		this.recDOM.style.display = 'block';
	}

	stop() {
		/// #if DEBUG
		if (app.tools.urlParams.has('skip-screen-record')) return;
		/// #endif

		this.mediaRecorder.stop();
		this.mediaRecorder.addEventListener('dataavailable', this.handleDataAvailable);
		this.recDOM.style.display = 'none';
	}

	handleDataAvailable = async (event) => {
		const buffer = await event.data.arrayBuffer();
		const id = Date.now();
		for (let i = 0; i < Math.ceil(buffer.byteLength / 1_000_000); i++) {
			state.emit(EVENTS.VIDEO_READY, {
				id,
				index: i,
				length: Math.ceil(buffer.byteLength / 1_000_000),
				buffer: buffer.slice(i * 1_000_000, (i + 1) * 1_000_000),
			});
		}

		this.mediaRecorder.removeEventListener('dataavailable', this.handleDataAvailable);
	};
}
