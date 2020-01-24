import { Vector2 } from 'three'

export default {
  uniforms: {
    tDiffuse: { value: null },
    uMouse: { value: new Vector2(0, 0) },
    uVelo: { value: 0 }
  },

  vertexShader: `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `,

  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 uMouse;
    uniform float uVelo;
    varying vec2 vUv;
    
    float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
      uv -= disc_center;
      float dist = length(uv);
      return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
    }

		void main() {
      vec2 uv = vUv;

      vec2 center = uMouse;
      //vec2 center = vec2(0.5);
      float uVeloM = 1.;
      uv.x *= 1.;
      center.x *= 1.;
    
      float c = circle(uv, center, 0.0, 0.2);
    
      float r = texture2D(tDiffuse, uv.xy += c * ((uVelo * .5) * uVeloM)).x;
      float g = texture2D(tDiffuse, uv.xy += c * ((uVelo * .525) * uVeloM)).y;
      float b = texture2D(tDiffuse, uv.xy += c * ((uVelo * .55) * uVeloM)).z;

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4( r, g, b, texel.w );
    }
    `
}
