function createPane(pane, instance, name) {
	const folder = pane.addFolder({ title: name, expanded: true });

	folder.addButton({ title: 'Add tag' }).on('click', () => {
		instance.addTag();
	});

	const PARAMS = {
		color: {
			r: instance.color.x,
			g: instance.color.y,
			b: instance.color.z,
		},
	};

	folder.addInput(PARAMS, 'color', { color: { type: 'float' } }).on('change', (v) => {
		instance.color.set(v.value.r, v.value.g, v.value.b);
		instance.tags.material.uniforms.uColor.value = instance.color.clone().multiplyScalar(0.8);
	});

	return folder;
}

function debug(_instance) {}

export { createPane, debug };
