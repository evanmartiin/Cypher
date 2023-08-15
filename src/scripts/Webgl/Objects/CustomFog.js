import { Fog, ShaderChunk } from 'three';
import fogFragment from '@Webgl/Materials/CustomFog/fogFragment.fs';
import fogParsFragment from '@Webgl/Materials/CustomFog/fogParsFragment.fs';
import fogParsVertex from '@Webgl/Materials/CustomFog/fogParsVertex.vs';
import fogVertex from '@Webgl/Materials/CustomFog/fogVertex.vs';

export class CustomFog {
	constructor() {
		ShaderChunk.fog_pars_vertex = fogParsVertex;
		ShaderChunk.fog_vertex = fogVertex;
		ShaderChunk.fog_pars_fragment = fogParsFragment;
		ShaderChunk.fog_fragment = fogFragment;

		this.fog = new Fog('#FFFFFF', 0, 50);
	}
}
