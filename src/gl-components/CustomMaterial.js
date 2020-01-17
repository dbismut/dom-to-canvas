import { ShaderMaterial, Vector2 } from 'three'
import { extend } from 'react-three-fiber'

class CustomMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader: `
        uniform float scale;
        uniform float shift;
        uniform vec2 uMouse;
        uniform float uVelo;
        uniform float progress;
        varying vec2 vUv;

        float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
          uv -= disc_center;
          float dist = length(uv);
          return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
        }

        void main() {
          vec3 pos = position;

          vec2 center = uMouse;
          center.x *= 1.;
        
          float c = circle(uv, center, 0.0, 0.4);

          pos.y -= c * ((-uVelo * .5));
          pos.x += c * ((-uVelo * .5));

          float dist = length(uv);
          
          
          float amp;
          if (progress < 0.5) amp = mix(0.0, 0.1, progress);
          else amp = mix(0.1, 0.0, progress);
          pos.x *= 1.0 + sin(dist * 20.0) * amp;
          pos.y *= 1.0 + sin(dist * 20.0) * amp;

          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.);
      }`,
      fragmentShader: `
        uniform sampler2D texture;
        uniform float hasTexture;
        uniform float shift;
        uniform float scale;
        uniform float imageRatio;
        uniform float aspect;
        uniform vec2 uMouse;
        uniform float uVelo;

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
          vec4 tex1 = texture2D(texture, p + offset);
          vec4 tex2 = texture2D(texture, p);
          vec4 tex3 = texture2D(texture, p - offset);
          gl_FragColor = vec4(tex1.r, tex2.g, tex3.b, 1.);
      }`,
      uniforms: {
        texture: { value: null },
        uMouse: { value: new Vector2(0, 0) },
        uVelo: { value: 0 },
        scale: { value: 0 },
        shift: { value: 0 },
        aspect: { value: 1.0 },
        imageRatio: { value: 1.0 },
        progress: { value: 0.0 }
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

  set uMouse(value) {
    if (!value) return
    this.uniforms.uMouse.value = value
  }

  get uMouse() {
    return this.uniforms.uMouse.value
  }

  set uVelo(value) {
    this.uniforms.uVelo.value = value
  }

  get uVelo() {
    return this.uniforms.uVelo.value
  }

  set aspect(value) {
    this.uniforms.aspect.value = value
  }

  get aspect() {
    return this.uniforms.aspect.value
  }

  set progress(value) {
    this.uniforms.progress.value = value
  }

  get progress() {
    return this.uniforms.progress.value
  }
}

extend({ CustomMaterial })
