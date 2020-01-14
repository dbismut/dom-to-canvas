import React, { useRef, useEffect, useState } from 'react'
import lerp from 'lerp'
import { useSpring, a } from 'react-spring/three'
import { useFrame, useThree } from 'react-three-fiber'
import { useScroll } from 'react-use-gesture'
import * as THREE from 'three/src/Three'
import { scroll, useStore } from './store'
import { ImageCanvas, useCanvasObject } from './canvas'
import './styles.css'
import './CustomMaterial'

import { names, imgs } from './data'

const loader = new THREE.TextureLoader()
const pos = (y, [left, top], { width, height }) => [left - width / 2, y + top + height / 2, 0]

function WebGLFigure({ id }) {
  const { sizes, src, ...props } = useStore(state => state.props[id])
  const [material, setMaterial] = useState(null)
  const { viewport } = useThree()
  const { top, vy } = scroll
  const mat = useRef()

  useFrame(() => {
    if (!mat.current) return
    mat.current.scale = lerp(
      mat.current.scale,
      Math.abs((sizes.position[1] + sizes.scale[1] / 2 + top.get()) / viewport.height / 5),
      0.1
    )

    mat.current.shift = vy.get() / 10
  })

  useEffect(() => {
    if (!sizes) return
    loader.load(src, tex => {
      tex.generateMipmaps = false
      tex.minFilter = THREE.LinearFilter
      tex.needsUpdate = true
      setMaterial(tex)
    })
  }, [src, sizes])

  if (!sizes || !material) return null

  const { scale, position } = sizes

  return (
    <a.mesh {...props} scale={scale} position={top.to(y => pos(y, position, viewport))}>
      <planeBufferGeometry attach="geometry" args={[1, 1, 32, 32]} />
      <customMaterial ref={mat} attach="material" map={material} aspect={scale[0] / scale[1]} />
    </a.mesh>
  )
}

WebGLFigure.whyDidYouRender = false

function Img({ className, style, alt, ...props }) {
  const [el] = useCanvasObject(props, WebGLFigure)
  return <img ref={el} style={{ ...style, opacity: 0 }} src={props.src} alt={alt} />
}

export default function App() {
  const [{ y, vy }, set] = useSpring(() => ({ y: window.scrollY, vy: 0 }))

  scroll.top = y
  scroll.vy = vy

  const windowScroll = useScroll(({ xy: [, y], vxvy: [, vy] }) => set({ y, vy }), { domTarget: window })

  useEffect(windowScroll, [windowScroll])

  return (
    <>
      <ImageCanvas />
      <h1>The trees</h1>
      <div className="grid">
        {names.map((name, index) => (
          <div key={name}>
            <h4>{name}</h4>
            <div>
              <Img alt={name} src={imgs[index]} onClick={() => console.log(name)} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
