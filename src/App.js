import React, { useRef, useEffect, useState } from 'react'
import { useGesture } from 'react-use-gesture'
import { scroll, pointer, bounds } from './store'
import ImageCanvas from './gl-components/ImageCanvas'
import Img from './components/Img'

import { names, imgs } from './data'
import './styles.css'

export default function App() {
  const ref = useRef(null)

  useEffect(() => {
    const updateBodySize = () => {
      bounds.vw = window.innerWidth
      bounds.vh = window.innerHeight
      document.body.style.height = ref.current.getBoundingClientRect().height + 'px'
    }
    window.addEventListener('resize', updateBodySize)
    updateBodySize()
    return () => window.removeEventListener('resize', updateBodySize)
  }, [])

  React.useEffect(() => {
    scroll.top = scroll.lerped.top = window.scrollY
    function raf() {
      scroll.tick()
      pointer.tick()
      ref.current.style.transform = `translate3d(0,${-scroll.lerped.top}px,0)`
      requestAnimationFrame(raf)
    }
    raf()
  }, [])

  const windowScroll = useGesture(
    {
      onScroll: ({ xy: [, y] }) => void (scroll.top = y),
      onMove: ({ xy: [x, y], vxvy: [vx, vy] }) => {
        pointer.x = x
        pointer.y = y
        pointer.velo.x = vx
        pointer.velo.y = vy
      }
    },
    { domTarget: window }
  )

  const [index, setIndex] = useState(-1)

  useEffect(windowScroll, [windowScroll])
  const handleClick = React.useCallback(i => setIndex(_i => (_i !== -1 ? -1 : i)), [])

  return (
    <>
      <ImageCanvas />
      <main ref={ref} style={{ opacity: index >= 0 ? 0 : 1 }}>
        <h1>The trees</h1>
        <div className="grid">
          {names.map((name, i) => (
            <div key={name}>
              <h4>{name}</h4>
              <div>
                <Img index={i} selected={i === index} alt={name} src={imgs[i]} onClick={handleClick} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
