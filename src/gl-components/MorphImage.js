import React, { useRef, useEffect, useState, useMemo } from 'react'
import lerp from 'lerp'
import { useFrame, useThree } from 'react-three-fiber'
import { useMove } from 'react-use-gesture'
import * as THREE from 'three/src/Three'
import { scroll, useStore } from '../store'
import './CustomMaterial'

import { Vector3 } from 'three/src/Three'

const loader = new THREE.TextureLoader()

const posY = (scrollY, top, h, vh) => scrollY - top - h / 2 + vh / 2
const posX = (scrollX, left, w, vw) => scrollX + left + w / 2 - vw / 2

export default function MorphImage({ id }) {
  const { bounds: initialBounds, src, onClick, selected, ...props } = useStore(state => state.props[id])
  const [material, setMaterial] = useState(null)
  const { viewport } = useThree()
  const mat = useRef()
  const mesh = useRef()
  const _mouse = useRef({ xy: undefined, velocity: 0 })
  const _vel = useRef(0)
  const _position = useRef()
  const _scale = useRef()

  const bind = useMove(
    ({ event, velocity, active }) => {
      event.stopPropagation()
      _mouse.current.xy = event.uv
      _vel.current = velocity / 10
    },
    { eventOptions: { pointer: true } }
  )

  const bounds = useMemo(() => {
    if (!initialBounds) return null
    const { left, top, width: w, height: h, scrollY } = initialBounds

    const { width: vw, height: vh } = viewport
    const width = selected ? vw : w
    const height = selected ? vh / 1 : h
    const x = posX(0, selected ? 0 : left, width, vw)
    const y = posY(0, selected ? 0 : top + scrollY, height, vh)

    return { width, height, x, y }
  }, [initialBounds, selected, viewport])

  useFrame(() => {
    if (!mat.current) return

    const { height: vh } = viewport

    const { x, y, width, height } = bounds

    _position.current.set(x, selected ? y : y + scroll.top, selected ? 10 : 0)
    _scale.current.set(width, height, 0.00001)

    mesh.current.position.lerp(_position.current, 0.1)
    mesh.current.scale.lerp(_scale.current, 0.05)

    _mouse.current.velocity = lerp(_mouse.current.velocity, _vel.current, 0.1)

    mat.current.scale = Math.abs(mesh.current.position.y / vh / 5)
    mat.current.shift = scroll.vy_lerp / 20

    mat.current.uMouse = _mouse.current.xy
    mat.current.aspect = mesh.current.scale.x / mesh.current.scale.y
    mat.current.uVelo = _mouse.current.velocity
    mat.current.progress = lerp(mat.current.progress, selected ? 1 : 0, 0.05)
  })

  useEffect(() => {
    if (!src) return
    loader.load(src, tex => {
      tex.generateMipmaps = false
      tex.minFilter = THREE.LinearFilter
      tex.needsUpdate = true
      setMaterial(tex)
    })
  }, [src])

  React.useLayoutEffect(() => {
    if (!material || _position.current) return
    _position.current = new Vector3(bounds.x, bounds.y, 0.0)
    _scale.current = new Vector3(bounds.width, bounds.height, 0.00001)
    mesh.current.position.add(_position.current)
    mesh.current.position.y += scroll.top
    mesh.current.scale.add(_scale.current)
  }, [bounds, material])

  const handleClick = event => {
    event.stopPropagation()
    onClick && onClick()
  }

  if (!material) return null

  return (
    <mesh {...props} {...bind()} onClick={handleClick} ref={mesh}>
      <planeBufferGeometry attach="geometry" args={[1, 1, 16, 16]} />
      <customMaterial ref={mat} attach="material" map={material} />
    </mesh>
  )
}

MorphImage.whyDidYouRender = false
