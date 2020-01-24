import { ShaderMaterial } from 'three'
import { extend } from 'react-three-fiber'

class CustomMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader: `
        uniform float shift;
        uniform float uPress;
        uniform float progress;
        uniform float scaleZ;
        varying vec2 vUv;

        #define M_PI 3.1415926535897932384626433832795

        void main() {
          vec3 pos = position;
            
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.);

          float dist = 1. - distance(uv,  vec2(0.5));
          float rippleEffect = cos(5. * (dist + progress));
          mvPosition.z *= scaleZ;
          mvPosition.z -= rippleEffect * uPress;
          
          vUv = uv;
          gl_Position = projectionMatrix * mvPosition;
      }`,
      fragmentShader: `
        uniform sampler2D tex;
        uniform float shift;
        uniform float scale;
        uniform float imageRatio;
        uniform float aspect;
        uniform float uVelo;
        uniform float progress;

        varying vec2 vUv;

        void main() {         
          float angle = 1.55;

          vec2 ratio = vec2(
            min(aspect / imageRatio, 1.0),
            min(imageRatio / aspect, 1.0)
          );

          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );

          vec2 p = (uv - vec2(0.5, 0.5)) * (1.0 - scale) + vec2(0.5, 0.5);
          vec2 offset = shift / 4.0 * vec2(cos(angle), sin(angle));
          vec4 tex1 = texture2D(tex, p + offset);
          vec4 tex2 = texture2D(tex, p);
          vec4 tex3 = texture2D(tex, p - offset);
          gl_FragColor = vec4(tex1.r, tex2.g, tex3.b, 1.);
      }`,
      uniforms: {
        tex: { value: null },
        scale: { value: 0 },
        shift: { value: 0 },
        aspect: { value: 1 },
        imageRatio: { value: 1 },
        progress: { value: 0 },
        uPress: { value: 0 },
        scaleZ: { value: 1 }
      }
    })
  }

  set map(value) {
    this.uniforms.tex.value = value
    this.uniforms.imageRatio.value = value.image.width / value.image.height
  }

  get map() {
    return this.uniforms.tex.value
  }
}

extend({ CustomMaterial })
