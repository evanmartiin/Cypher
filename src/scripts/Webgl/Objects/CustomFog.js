import { Fog, Group, ShaderChunk } from 'three';
import fogFragment from '@Webgl/Materials/CustomFog/fogFragment.fs';
import fogParsFragment from '@Webgl/Materials/CustomFog/fogParsFragment.fs';
import fogParsVertex from '@Webgl/Materials/CustomFog/fogParsVertex.vs';
import fogVertex from '@Webgl/Materials/CustomFog/fogVertex.vs';

export class CustomFog extends Group {
	constructor() {
		super();
		this._fog = this._createFog();
	}

	_createFog() {
		ShaderChunk.fog_pars_vertex = fogParsVertex;
		ShaderChunk.fog_vertex = fogVertex;
		ShaderChunk.fog_pars_fragment = fogParsFragment;
		ShaderChunk.fog_fragment = fogFragment;

		const customFog = new Fog('#FFFFFF', 0, 50);

		return customFog;
	}
}
