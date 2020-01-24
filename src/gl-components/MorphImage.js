import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three/src/Three'
import { gsap } from 'gsap'
import { usePrevious } from '../utils'
import { scroll, useStore } from '../store'
import './CustomMaterial'

const loader = new THREE.TextureLoader()

const posY = (top, h, vh) => -top - h / 2 + vh / 2
const posX = (left, w, vw) => left + w / 2 - vw / 2

const MorphImage = ({ id }) => {
  const { bounds: initialBounds, src, onClick, selected, ...props } = useStore(state => state.props[id])
  const [material, setMaterial] = useState(null)
  const { viewport } = useThree()
  const mat = useRef()
  const mesh = useRef()
  const animating = useRef(false)
  const wasSelected = usePrevious(selected)

  useEffect(() => {
    if (!src) return
    loader.load(src, tex => {
      tex.generateMipmaps = false
      tex.minFilter = THREE.LinearFilter
      tex.needsUpdate = true
      setMaterial(tex)
    })
  }, [src])

  const bounds = useMemo(() => {
    const { left, top, width: w, height: h, scrollY } = initialBounds
    const { width: vw, height: vh, factor } = viewport

    const width = selected ? vw * 0.6 : w / factor
    const height = selected ? vh * 0.4 : h / factor
    const x = selected ? 0 : posX(left / factor, width, vw)
    const y = posY(selected ? 200 / factor : (top + scrollY) / factor, height, vh)

    return { width, height, x, y }
  }, [initialBounds, selected, viewport])

  useEffect(() => {
    if (wasSelected === selected) {
      // don't animate if bounds have changed but selected hasn't
      mesh.current.scale.set(bounds.width, bounds.height, 1)
      mesh.current.position.set(bounds.x, bounds.y + selected ? 0 : scroll.top, 0)
    } else {
      animating.current = true
      gsap
        .timeline({
          onComplete: () => (animating.current = false)
        })
        .to(mat.current.uniforms.uPress, { value: 0.75, duration: 0.25, ease: 'expo' })
        .to(mat.current.uniforms.uPress, { value: 0, duration: 0.75, ease: 'power2' }, 0.5)
        .to(mat.current.uniforms.progress, { value: selected ? 1 : 0, duration: 1, ease: 'linear' }, 0)
        .to(mesh.current.scale, { x: bounds.width, y: bounds.height, duration: 1, ease: 'expo' }, 0)
        .to(
          mesh.current.position,
          {
            x: bounds.x,
            y: selected ? bounds.y : bounds.y + scroll.top / viewport.factor,
            duration: 1,
            ease: 'power2'
          },
          0
        )
        .to(mesh.current.position, { z: selected ? 1.5 : 0, duration: 1, ease: 'power2' }, selected ? 0 : 0.5)
    }
  }, [bounds.x, bounds.y, bounds.width, bounds.height, selected, wasSelected, viewport.factor])

  useFrame(() => {
    const { height: vh } = viewport

    if (!selected && !animating.current) {
      mesh.current.position.y = bounds.y + scroll.lerped.top / viewport.factor
    }
    if (material) {
      mat.current.uniforms.scale.value = Math.abs(mesh.current.position.y / vh / 5)
      mat.current.uniforms.shift.value = scroll.velo.top
      mat.current.uniforms.aspect.value = mesh.current.scale.x / mesh.current.scale.y
    }
  })

  const handleClick = event => {
    event.stopPropagation()
    onClick && onClick()
  }

  return (
    <mesh {...props} onClick={handleClick} ref={mesh}>
      <planeBufferGeometry attach="geometry" args={[1, 1, 24, 24]} />
      {material && <customMaterial ref={mat} attach="material" map={material} />}
    </mesh>
  )
}

MorphImage.whyDidYouRender = false

export default React.memo(MorphImage)
