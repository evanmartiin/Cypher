import { app } from '@scripts/App.js';

export default class Recorder {
	constructor() {}

	async init() {
		/// #if DEBUG
		if (app.tools.urlParams.has('skip-video')) return;
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
		if (app.tools.urlParams.has('skip-video')) return;
		/// #endif

		this.mediaRecorder.start();
	}

	stop() {
		/// #if DEBUG
		if (app.tools.urlParams.has('skip-video')) return;
		/// #endif

		this.mediaRecorder.stop();
		this.mediaChunks = [];
		this.mediaRecorder.addEventListener('dataavailable', this.handleDataAvailable);
	}

	handleDataAvailable = (event) => {
		this.mediaChunks.push(event.data);
		// console.log(new Blob(this.mediaChunks, { type: 'video/webm' }));
		this.mediaRecorder.removeEventListener('dataavailable', this.handleDataAvailable);
	};
}
