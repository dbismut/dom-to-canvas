import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useThree } from 'react-three-fiber'
import { useMove } from 'react-use-gesture'
import { useSpring, to, a } from 'react-spring/three'
import * as THREE from 'three/src/Three'
import { scroll, useStore } from '../store'
import CustomMaterial from './CustomMaterial'

const loader = new THREE.TextureLoader()

const posY = (scrollY, top, h, vh) => scrollY - top - h / 2 + vh / 2
const posX = (scrollX, left, w, vw) => scrollX + left + w / 2 - vw / 2

export default function MorphImage({ id }) {
  const { bounds: initialBounds, src, onClick, selected, ...props } = useStore(state => state.props[id])
  const [material, setMaterial] = useState(null)
  const { viewport } = useThree()
  const mat = useRef()
  const mesh = useRef()

  const bounds = useMemo(() => {
    if (!initialBounds) return null
    const { left, top, width: w, height: h, scrollY } = initialBounds

    const { width: vw, height: vh } = viewport
    const width = selected ? vw : w
    const height = selected ? vh / 1 : h
    const x = posX(0, selected ? 0 : left, width, vw)
    const y = posY(0, selected ? 0 : top - scrollY, height, vh)

    return { width, height, x, y }
  }, [initialBounds, selected, viewport])

  // scale
  const { width, height, x, y, progress } = useSpring({ ...bounds, progress: selected ? 1 : 0 })

  // mouse for material deformation
  const [{ mouseX, mouseY, mouseVelocity }, set] = useSpring(() => ({ mouseX: 0, mouseY: 0, mouseVelocity: 0 }))

  const bind = useMove(
    ({ event, velocity, active }) => {
      event.stopPropagation()
      const { x, y } = event.uv
      set({ mouseX: x, mouseY: y, mouseVelocity: velocity / 10 })
    },
    { eventOptions: { pointer: true } }
  )

  useEffect(() => {
    if (!src) return
    loader.load(src, tex => {
      tex.generateMipmaps = false
      tex.minFilter = THREE.LinearFilter
      tex.needsUpdate = true
      setMaterial(tex)
    })
  }, [src])

  const handleClick = event => {
    event.stopPropagation()
    onClick && onClick()
  }

  if (!material) return null

  const meshY = to([y, scroll.y], (y, s) => (selected ? y : y - s))

  return (
    <a.mesh
      {...props}
      {...bind()}
      position-x={x}
      position-y={meshY}
      scale-x={width}
      scale-y={height}
      scale-z={0.00001}
      onClick={handleClick}
      ref={mesh}>
      <planeBufferGeometry attach="geometry" args={[1, 1, 16, 16]} />
      <CustomMaterial
        ref={mat}
        attach="material"
        map={material}
        mouse-x={mouseX}
        mouse-y={mouseY}
        velocity={mouseVelocity}
        progress={progress}
        shift={scroll.vy.to(v => v / 10)}
        aspect={to([width, height], (w, h) => w / h)}
        scale={meshY.to(y => Math.abs(y) / viewport.height / 5)}
      />
    </a.mesh>
  )
}

MorphImage.whyDidYouRender = false
