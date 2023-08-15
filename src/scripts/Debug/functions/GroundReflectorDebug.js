function createPane(pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: false });

	folder.addInput(instance.reflector.scale, 'x', {
		min: 0,
		max: 17,
	});
	folder.addInput(instance.reflector.scale, 'y', {
		min: 0,
		max: 17,
	});
	folder.addInput(instance.reflector.rotation, 'z', {
		min: -Math.PI * 0.5,
		max: Math.PI * 0.5,
		label: 'rotation',
	});

	return folder;
}

function debug(_instance) {}

export { createPane, debug };
