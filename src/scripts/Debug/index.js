import { URLParams } from './UrlParams.js';

async function createDebugModules() {
	await import('@styles/debug/debug.scss');

	const Mapping = (await import('./Mapping.js')).Mapping;
	const mapping = new Mapping();
	await mapping.load();

	const Stats = (await import('./Stats.js')).Stats;
	const stats = new Stats();
	await stats.load();

	const urlParams = new URLParams();

	return {
		mapping,
		stats,
		urlParams,
	};
}

export { createDebugModules };
