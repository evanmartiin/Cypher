import { Color, Group, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import fragmentShader from '@Webgl/Materials/BaseGround/fragment.fs';
import vertexShader from '@Webgl/Materials/BaseGround/vertex.vs';
import { globalUniforms } from '@utils/globalUniforms.js';

export class BaseGround extends Group {
	constructor() {
		super();
		this.createMesh();
	}

	createMesh() {
		const geometry = new PlaneGeometry();

		const material = new CustomShaderMaterial({
			baseMaterial: MeshStandardMaterial,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				...globalUniforms,
				uColor: { value: new Color('#1c334E') },
				uColor2: { value: new Color('#aacadb') },
				uGridColor: { value: new Color('#7FA9BE') },
			},
			transparent: true,
			metalness: 0.7,
			roughness: 0.7,
			color: '#ffffff',
			// color: '#1c334E',
		});

		const mesh = new Mesh(geometry, material);
		mesh.receiveShadow = true;
		mesh.rotation.x = -Math.PI * 0.5;
		this.add(mesh);
		const scale = 10;
		mesh.position.z = -scale * 0.4;
		mesh.scale.set(scale, scale, 1);
	}
}
