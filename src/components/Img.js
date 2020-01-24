import React from 'react'
import useCanvasObject from '../gl-components/useCanvasObject'
import MorphImage from '../gl-components/MorphImage'

const Img = React.memo(({ className, style, alt, index, onClick, ...props }) => {
  const handleClick = React.useCallback(() => onClick(index), [onClick, index])
  const [el] = useCanvasObject({ ...props, onClick: handleClick }, MorphImage)
  return <img ref={el} style={{ ...style, opacity: 0 }} src={props.src} alt={alt} />
})

export default Img