import React, { useRef, useCallback, useEffect } from 'react'
import { Canvas } from 'react-three-fiber'
import uuid from 'uuid/v1'
import { scroll, useStore } from './store'
import { debounce } from './utils'
import './CustomMaterial'

function Objects() {
  const objects = useStore(state => state.objects)
  return Object.entries(objects).map(([id, elementClass]) => React.createElement(elementClass, { key: id, id }))
}

export function ImageCanvas() {
  return (
    <Canvas
      orthographic
      camera={{ zoom: scroll.zoom, position: [0, 0, 500] }}
      style={{ position: 'fixed', top: 0, left: 0 }}>
      <Objects />
    </Canvas>
  )
}

export function useCanvasObject(props, elementClass) {
  const ref = useRef(null)
  const id = useRef(uuid())
  const addObject = useStore(state => state.addObject)
  const updateProps = useStore(state => state.updateProps)
  const removeObject = useStore(state => state.removeObject)
  const { src } = props

  const set = useCallback(newProps => updateProps(id.current, newProps), [updateProps])

  const updateBounds = useCallback(() => {
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    set({
      sizes: {
        position: [left + width / 2, -top - height / 2 - scroll.top],
        scale: [width, height, 0.00001]
      }
    })
  }, [set])

  const debouncedUpdateBounds = debounce(updateBounds, 500)

  useEffect(() => {
    window.addEventListener('resize', debouncedUpdateBounds)
    return () => window.removeEventListener('resize', debouncedUpdateBounds)
  }, [removeObject, debouncedUpdateBounds])

  useEffect(() => {
    if (!src) updateBounds()
    else {
      const img = new Image()
      img.src = src
      img.onload = updateBounds
    }
  }, [src, updateBounds])

  useEffect(() => {
    const _id = id.current
    addObject(_id, elementClass)
    return () => removeObject(_id)
  }, [addObject, removeObject, elementClass])

  useEffect(() => {
    set(props)
  }, [props, set])

  return [ref, set]
}
