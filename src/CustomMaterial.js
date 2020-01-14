import { ShaderMaterial } from 'three'
import { extend } from 'react-three-fiber'

class CustomMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader: `uniform float scale;
      uniform float shift;
      varying vec2 vUv;
      void main() {
        vec3 pos = position;
        pos.y = pos.y + ((sin(uv.x * 3.1415926535897932384626433832795) * shift * 5.0) * 0.125);
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.);
      }`,
      fragmentShader: `uniform sampler2D texture;
      uniform float hasTexture;
      uniform float shift;
      uniform float scale;
      uniform float imageRatio;
      uniform float aspect;
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
        vec4 cr = texture2D(texture, p + offset);
        vec4 cga = texture2D(texture, p);
        vec4 cb = texture2D(texture, p - offset);
        gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
      }`,
      uniforms: {
        texture: { value: null },
        scale: { value: 0 },
        shift: { value: 0 },
        aspect: { value: 1.0 },
        imageRatio: { value: 1.0 }
      }
    })
  }

  set scale(value) {
    this.uniforms.scale.value = value
  }

  get scale() {
    return this.uniforms.scale.value
  }

  set shift(value) {
    this.uniforms.shift.value = value
  }

  get shift() {
    return this.uniforms.shift.value
  }

  set map(value) {
    this.uniforms.texture.value = value
    this.uniforms.imageRatio.value = value.image.width / value.image.height
  }

  get map() {
    return this.uniforms.texture.value
  }

  set aspect(value) {
    this.uniforms.aspect.value = value
  }

  get aspect() {
    return this.uniforms.aspect.value
  }
}

extend({ CustomMaterial })
