import { gsap } from 'gsap';
import { ClampToEdgeWrapping, DoubleSide, Group, Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

class Carpet extends Group {
	constructor() {
		super();
		state.register(this);

		this.rotationZ = { value: 0 };
		this.rotateMultiplier = 5;
		this.opacity = { value: 0 };
	}

	show() {
		gsap.to(this, { rotateMultiplier: 0.3, duration: 1, ease: 'power2.out' });
		gsap.to(this.opacity, { value: 1, duration: 1, ease: 'power2.out' });
	}

	hide() {
		gsap.to(this, { rotateMultiplier: 5, duration: 0.5, ease: 'power2.in' });
		gsap.to(this.opacity, { value: 0, duration: 0.5, ease: 'power2.in' });
	}

	onAttach() {
		const tex = app.core.assetsManager.get('carpet');
		tex.wrapS = tex.wrapT = ClampToEdgeWrapping;

		const material = new ShaderMaterial({
			vertexShader: `
            uniform float uRotation;
		    varying vec2 vUv;
		    vec2 rotateUV(vec2 uv, float rotation) {
		        float mid = 0.5;
		        return vec2(
		            cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
		            cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
		        );
		    }
		    void main() {
		        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
		        vUv = rotateUV(uv, uRotation);
		    }
		    `,
			fragmentShader: `
		    uniform sampler2D tTex;
            uniform float uOpacity;
		    varying vec2 vUv;
		    void main() {
                vec4 tex = texture2D(tTex, vUv);
		        gl_FragColor = vec4(tex.xyz, tex.a * uOpacity);
		    }
		    `,
			uniforms: {
				uRotation: this.rotationZ,
				uOpacity: this.opacity,
				tTex: { value: tex },
			},
			transparent: true,
			depthTest: false,
			side: DoubleSide,
			fog: false,
		});

		this.mesh = new Mesh(new PlaneGeometry(1, 1), material);
		this.mesh.position.set(0, 0.05, 2);
		this.mesh.scale.set(2, 2, 2);
		this.mesh.rotateX(-Math.PI / 2 + Math.PI / 16);
		this.add(this.mesh);
	}

	onRender({ dt }) {
		this.rotationZ.value += dt * this.rotateMultiplier;
	}
}

export { Carpet };
