import { useRef, useCallback, useEffect } from 'react'
import uuid from 'uuid/v1'
import { scroll, useStore } from '../store'
import { debounce } from '../utils'

export default function useCanvasObject(props, elementClass) {
  const ref = useRef(null)
  const id = useRef(uuid())
  const addObject = useStore(state => state.addObject)
  const updateProps = useStore(state => state.updateProps)
  const removeObject = useStore(state => state.removeObject)
  const initialized = useRef(false)
  const { src } = props

  const set = useCallback(newProps => updateProps(id.current, newProps), [updateProps])

  const updateBounds = useCallback(() => {
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    set({ bounds: { left, top, width, height, scrollY: scroll.top } })
    if (!initialized.current) {
      initialized.current = true
      addObject(id.current, elementClass)
    }
  }, [set, addObject, elementClass])

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
    return () => removeObject(_id)
  }, [removeObject])

  useEffect(() => {
    set(props)
  }, [props, set])

  return [ref, set]
}
