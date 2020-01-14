import React, { useRef, useEffect, useState } from 'react'
import lerp from 'lerp'
import { useFrame, useThree } from 'react-three-fiber'
import { useScroll } from 'react-use-gesture'
import * as THREE from 'three/src/Three'
import { scroll, useStore } from './store'
import { ImageCanvas, useCanvasObject } from './canvas'
import './styles.css'
import './CustomMaterial'

import { names, imgs } from './data'

const loader = new THREE.TextureLoader()
const pos = (y, top, height) => y + top + height / 2

function WebGLFigure({ id }) {
  const { sizes, src, ...props } = useStore(state => state.props[id])
  const [material, setMaterial] = useState(null)
  const { viewport } = useThree()
  const mat = useRef()
  const mesh = useRef()
  const last = useRef(window.scrollY)
  const lastV = useRef(0)

  useFrame(() => {
    if (!mat.current) return
    last.current = lerp(last.current, scroll.top, 0.1)
    mesh.current.position.y = pos(last.current, sizes.position[1], viewport.height)

    mat.current.scale = Math.abs((sizes.position[1] + sizes.scale[1] / 2 + last.current) / viewport.height / 5)

    lastV.current = lerp(lastV.current, scroll.vy, 0.1)
    mat.current.shift = lastV.current / 10
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
    <mesh
      {...props}
      ref={mesh}
      scale={scale}
      position={[position[0] - viewport.width / 2, position[1] + viewport.height / 2, 0]}>
      <planeBufferGeometry attach="geometry" args={[1, 1, 32, 32]} />
      <customMaterial ref={mat} attach="material" map={material} aspect={scale[0] / scale[1]} />
    </mesh>
  )
}

WebGLFigure.whyDidYouRender = false

function Img({ className, style, alt, ...props }) {
  const [el] = useCanvasObject(props, WebGLFigure)
  return <img ref={el} style={{ ...style, opacity: 0 }} src={props.src} alt={alt} />
}

export default function App() {
  const ref = useRef(null)

  useEffect(() => {
    const updateBodySize = () => (document.body.style.height = ref.current.getBoundingClientRect().height + 'px')
    window.addEventListener('resize', updateBodySize)
    updateBodySize()
    return () => window.removeEventListener('resize', updateBodySize)
  }, [])

  useEffect(() => {
    let y = scroll.top
    function raf() {
      y = lerp(y, scroll.top, 0.06)
      ref.current.style.transform = `translate3d(0,${-y}px,0)`
      requestAnimationFrame(raf)
    }
    raf()
  }, [])

  const windowScroll = useScroll(
    ({ xy: [, y], vxvy: [, vy] }) => {
      scroll.top = y
      scroll.vy = vy
    },
    { domTarget: window }
  )

  useEffect(windowScroll, [windowScroll])

  return (
    <>
      <ImageCanvas />
      <main ref={ref}>
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
      </main>
    </>
  )
}
