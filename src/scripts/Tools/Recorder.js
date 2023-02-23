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
		this.mediaChunks = [];
		this.mediaRecorder.addEventListener('dataavailable', this.handleDataAvailable);
		this.recDOM.style.display = 'none';
	}

	handleDataAvailable = (event) => {
		this.mediaChunks.push(event.data);
		state.emit(EVENTS.VIDEO_READY, this.mediaChunks);

		this.mediaRecorder.removeEventListener('dataavailable', this.handleDataAvailable);
	};
}
