import React, { useRef, useEffect, useState } from 'react'
import { useScroll } from 'react-use-gesture'
import { scroll } from './store'
import { ImageCanvas } from './gl-components'
import Img from './components/Img'
import { useSpring, a } from 'react-spring'

import { names, imgs } from './data'
import './styles.css'

export default function App() {
  const ref = useRef(null)
  const [{ y, vy }, set] = useSpring(() => ({ y: -window.scrollY, vy: 0 }))
  scroll.y = y
  scroll.vy = vy

  useEffect(() => {
    const updateBodySize = () => (document.body.style.height = ref.current.getBoundingClientRect().height + 'px')
    window.addEventListener('resize', updateBodySize)
    updateBodySize()
    return () => window.removeEventListener('resize', updateBodySize)
  }, [])

  const windowScroll = useScroll(
    ({ xy: [, y], vxvy: [, vy] }) => {
      set({ y: -y, vy })
    },
    { domTarget: window }
  )

  const [index, setIndex] = useState(-1)

  useEffect(windowScroll, [windowScroll])

  return (
    <>
      <ImageCanvas />
      <a.main ref={ref} style={{ y, opacity: index >= 0 ? 0 : 1 }}>
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
      </a.main>
    </>
  )
}
