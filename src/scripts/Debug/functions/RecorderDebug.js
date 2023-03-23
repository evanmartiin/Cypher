import { SERVER_EVENTS } from '@utils/constants.js';
import { app } from '@scripts/App.js';

function createPane(pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: true });

	folder.addButton({ title: 'Send video' }).on('click', async () => {
		const src = (await import('@assets/video/video-sample.webm')).default;
		const buffer = await (await fetch(src)).arrayBuffer();
		app.server.emit(SERVER_EVENTS.CREATE_VIDEO, {
			id: Date.now(),
			index: 0,
			length: Math.ceil(buffer.byteLength / 1_000_000),
			buffer: buffer.slice(0, 1_000_000),
		});
	});

	return folder;
}

function debug(_instance) {}

export { createPane, debug };
