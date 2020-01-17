import React, { useRef, useEffect, useState } from 'react'
import { useScroll } from 'react-use-gesture'
import { scroll } from './store'
import { ImageCanvas } from './gl-components'
import Img from './components/Img'

import { names, imgs } from './data'
import './styles.css'

export default function App() {
  const ref = useRef(null)

  useEffect(() => {
    const updateBodySize = () => (document.body.style.height = ref.current.getBoundingClientRect().height + 'px')
    window.addEventListener('resize', updateBodySize)
    updateBodySize()
    return () => window.removeEventListener('resize', updateBodySize)
  }, [])

  React.useEffect(() => {
    scroll.top = scroll.top_lerp = window.scrollY
    function raf() {
      scroll.tick()
      ref.current.style.transform = `translate3d(0,${-scroll.top_lerp}px,0)`
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

  const [index, setIndex] = useState(-1)

  useEffect(windowScroll, [windowScroll])

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
                <Img
                  selected={i === index}
                  alt={name}
                  src={imgs[i]}
                  onClick={() => setIndex(_i => (_i === i ? -1 : i))}
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
