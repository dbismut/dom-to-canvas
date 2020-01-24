import React, { useRef, useEffect } from 'react'
import { extend, useThree, useFrame } from 'react-three-fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { pointer } from '../store'
import RGBShiftShader from './RGBShiftShader'

extend({ EffectComposer, ShaderPass, RenderPass })

export default function Effects() {
  const composer = useRef()
  const shader = useRef()
  const { scene, gl, size, camera } = useThree()

  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame(() => {
    shader.current.uniforms.uMouse.value = [pointer.gl.x, pointer.gl.y]
    shader.current.uniforms.uVelo.value = pointer.velo.abs
    composer.current.render()
  }, 1)
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <shaderPass ref={shader} attachArray="passes" args={[RGBShiftShader]} />
    </effectComposer>
  )
}
