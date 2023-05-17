function createPane(pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: false });

	folder.addInput(instance.options, 'mouse_force', {
		min: 20,
		max: 200,
	});

	return folder;
}

function debug(_instance) {}

export { createPane, debug };
