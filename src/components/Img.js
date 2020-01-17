import React from 'react'
import { useCanvasObject } from '../gl-components'
import MorphImage from '../gl-components/MorphImage'

export default function Img({ className, style, alt, ...props }) {
  const [el] = useCanvasObject(props, MorphImage)
  return <img ref={el} style={{ ...style, opacity: 0 }} src={props.src} alt={alt} />
}
