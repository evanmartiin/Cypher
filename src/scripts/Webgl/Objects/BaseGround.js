import { Color, Group, Mesh, MeshStandardMaterial, MeshToonMaterial, PlaneGeometry, Vector2 } from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import fragmentShader from '@Webgl/Materials/BaseGround/fragment.fs';
import vertexShader from '@Webgl/Materials/BaseGround/vertex.vs';
import { globalUniforms } from '@utils/globalUniforms.js';
import { app } from '@scripts/App.js';

export class BaseGround extends Group {
	constructor() {
		super();
		this.createMesh();
	}

	createMesh() {
		const geometry = new PlaneGeometry();

		const material = new CustomShaderMaterial({
			baseMaterial: MeshToonMaterial,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				...globalUniforms,
				uColor: { value: new Color('#1c334E') },
				uColor2: { value: new Color('#aacadb') },
				uGridColor: { value: new Color('#7FA9BE') },
			},
			transparent: true,
			normalMap: app.core.assetsManager.get('normal'),
			color: '#ffffff',
			// color: '#1c334E',
		});

		const mesh = new Mesh(geometry, material);
		mesh.receiveShadow = true;
		mesh.rotation.x = -Math.PI * 0.5;
		const scale = 20;
		mesh.position.z = -scale * 0.4;
		mesh.scale.set(scale, scale, 1);
		this.add(mesh);
	}
}
