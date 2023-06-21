import { gsap } from 'gsap';
import { AdditiveBlending, ClampToEdgeWrapping, FrontSide, Group, Mesh, PlaneGeometry, ShaderMaterial } from 'three';
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
		gsap.to(this.mesh.position, { y: 0.1, duration: 0.5, ease: 'power2.out' });
	}

	hide() {
		gsap.to(this, { rotateMultiplier: 5, duration: 0.5, ease: 'power2.in' });
		gsap.to(this.opacity, { value: 0, duration: 0.5, ease: 'power2.in' });
		gsap.to(this.mesh.position, { y: -0.1, duration: 0.9, ease: 'power2.in' });
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
			uniform float uOpacity;
		    uniform sampler2D tTex;
		    varying vec2 vUv;
		    void main() {
				if (vUv.x < 0. || vUv.x > 1. || vUv.y < 0. || vUv.y > 1.) discard;
                vec4 tex = texture2D(tTex, vUv);
				if (tex.a <= 0.6) discard;
		        gl_FragColor = tex * uOpacity;
		    }
		    `,
			uniforms: {
				uOpacity: this.opacity,
				uRotation: this.rotationZ,
				tTex: { value: tex },
			},
			side: FrontSide,
			blending: AdditiveBlending,
		});

		this.mesh = new Mesh(new PlaneGeometry(1, 1), material);
		this.mesh.position.set(0, -0.1, 3);
		this.mesh.scale.set(3, 3, 3);
		this.mesh.rotateX(-Math.PI / 2);
		this.add(this.mesh);
	}

	onRender({ dt }) {
		this.rotationZ.value += dt * this.rotateMultiplier;
	}
}

export { Carpet };