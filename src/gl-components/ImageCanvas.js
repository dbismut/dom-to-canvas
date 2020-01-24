import React from 'react'
import { Canvas, useThree } from 'react-three-fiber'
import { useStore } from '../store'
import Effects from './Effects'

function Objects() {
  const objects = useStore(state => state.objects)
  return Object.entries(objects).map(([id, elementClass]) => React.createElement(elementClass, { key: id, id }))
}

/** This component creates a fullscreen colored plane */
function Background({ color }) {
  const { viewport } = useThree()
  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry attach="geometry" args={[1, 1]} />
      <meshBasicMaterial attach="material" color={color} depthTest={false} />
    </mesh>
  )
}

export default function ImageCanvas() {
  return (
    <Canvas camera={{ fov: 45, near: 1, far: 100, position: [0, 0, 5] }} style={{ position: 'fixed', top: 0, left: 0 }}>
      <Background color="#fff" />
      <Objects />
      <Effects />
    </Canvas>
  )
}
