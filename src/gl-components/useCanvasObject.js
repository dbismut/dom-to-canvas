import { useRef, useCallback, useEffect } from 'react'
import uuid from 'uuid/v1'
import { scroll, useStore } from '../store'
import { debounce } from '../utils'
import { useWebGLSupport } from '../context'

export default function useCanvasObject(props, elementClass) {
  const webGLSupported = useWebGLSupport()
  const ref = useRef(null)
  const id = useRef(uuid())
  const addObject = useStore(state => state.addObject)
  const updateProps = useStore(state => state.updateProps)
  const removeObject = useStore(state => state.removeObject)
  const initialized = useRef(false)
  const { src } = props

  const set = useCallback(newProps => updateProps(id.current, newProps), [updateProps])

  const updateBounds = useCallback(() => {
    if (!webGLSupported) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    set({ bounds: { left, top, width, height, scrollY: scroll.top } })
    if (!initialized.current) {
      initialized.current = true
      addObject(id.current, elementClass)
    }
  }, [set, addObject, elementClass, webGLSupported])

  const debouncedUpdateBounds = debounce(updateBounds, 500)

  useEffect(() => {
    if (webGLSupported) window.addEventListener('resize', debouncedUpdateBounds)
    return () => {
      if (webGLSupported) window.removeEventListener('resize', debouncedUpdateBounds)
    }
  }, [removeObject, debouncedUpdateBounds, webGLSupported])

  useEffect(() => {
    if (!webGLSupported) return
    if (!src) updateBounds()
    else {
      const img = new Image()
      img.src = src
      img.onload = updateBounds
    }
  }, [src, updateBounds, webGLSupported])

  useEffect(() => {
    if (!webGLSupported) return
    const _id = id.current
    return () => {
      if (webGLSupported) removeObject(_id)
    }
  }, [removeObject, webGLSupported])

  useEffect(() => {
    if (webGLSupported) set(props)
  }, [props, set, webGLSupported])

  return [ref, set]
}
